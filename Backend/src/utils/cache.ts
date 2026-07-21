import Redis from "ioredis";

/**
 * Cache for expensive research calls (web search, local business
 * lookups). Backed by Redis when REDIS_URL is set - which is what lets
 * multiple backend instances behind a load balancer share one cache
 * instead of each re-paying for the same search - and transparently
 * falls back to an in-memory Map (single-instance only) when it isn't,
 * so local dev needs no Redis install at all.
 *
 * The public API (getOrSetCache / clearCache) never changes based on
 * which backing store is active - nothing calling it needs to know or
 * care.
 */

interface Entry<T> {
    value: T;
    expiresAt: number;
}

// ---- In-memory fallback (used when REDIS_URL is unset, or as a
// same-request safety net if Redis briefly errors) ----------------

const memoryStore = new Map<string, Entry<unknown>>();

function memorySweep(): void {
    if (memoryStore.size < 500) return;
    const now = Date.now();
    for (const [key, entry] of memoryStore) {
        if (entry.expiresAt <= now) memoryStore.delete(key);
    }
}

async function memoryGetOrSet<T>(key: string, ttlMs: number, factory: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const hit = memoryStore.get(key);

    if (hit && hit.expiresAt > now) {
        return hit.value as T;
    }

    const value = await factory();
    memorySweep();
    memoryStore.set(key, { value, expiresAt: now + ttlMs });
    return value;
}

// ---- Redis backend (optional - only used when REDIS_URL is set) -----

let redisClient: Redis | null | undefined; // undefined = not attempted yet, null = unavailable/disabled

function getRedisClient(): Redis | null {
    if (redisClient !== undefined) return redisClient;

    const url = process.env.REDIS_URL;
    if (!url) {
        redisClient = null;
        return redisClient;
    }

    try {
        const client = new Redis(url, {
            maxRetriesPerRequest: 1,
            // Don't hang around retrying forever if Redis is unreachable -
            // fail fast so callers fall back to in-memory for that request
            // instead of stalling a founder's chat response.
            retryStrategy: () => null,
            reconnectOnError: () => false,
        });

        client.on("error", (err: Error) => {
            console.error("cache: Redis error - falling back to in-memory cache for this call:", err.message);
        });

        redisClient = client;
    } catch (error) {
        console.error("cache: failed to create Redis client - falling back to in-memory cache", error);
        redisClient = null;
    }

    return redisClient;
}

export function normalizeCacheKey(...parts: string[]): string {
    return parts
        .map((p) => p.trim().toLowerCase())
        .filter(Boolean)
        .join("::");
}

/**
 * Returns the cached value for `key` if still fresh, otherwise calls
 * `factory()`, caches the result for `ttlMs`, and returns it. A
 * rejected factory() is never cached, so a transient failure doesn't
 * poison the cache for the whole TTL window.
 *
 * Uses Redis when REDIS_URL is configured (shared across instances);
 * otherwise (or if Redis errors mid-request) falls back to the local
 * in-memory store automatically.
 */
export async function getOrSetCache<T>(key: string, ttlMs: number, factory: () => Promise<T>): Promise<T> {
    const redis = getRedisClient();

    if (redis) {
        try {
            const cached = await redis.get(key);
            if (cached !== null) {
                return JSON.parse(cached) as T;
            }

            const value = await factory();

            // Cache only after a successful factory() call, same rule as
            // the in-memory path - don't cache a value we haven't produced.
            try {
                await redis.set(key, JSON.stringify(value), "PX", ttlMs);
            } catch (writeError) {
                console.error(`cache: Redis SET failed for "${key}" - value still returned, just not cached`, writeError);
            }

            return value;
        } catch (error) {
            console.error(`cache: Redis GET failed for "${key}" - falling back to in-memory for this call`, error);
            return memoryGetOrSet(key, ttlMs, factory);
        }
    }

    return memoryGetOrSet(key, ttlMs, factory);
}

/** Manual invalidation - e.g. an admin "refresh research" action. */
export async function clearCache(prefix?: string): Promise<void> {
    const redis = getRedisClient();

    if (redis) {
        try {
            if (!prefix) {
                await redis.flushdb();
            } else {
                const stream = redis.scanStream({ match: `${prefix}*` });
                const pipeline = redis.pipeline();
                let queued = 0;

                for await (const keys of stream) {
                    for (const key of keys as string[]) {
                        pipeline.del(key);
                        queued++;
                    }
                }

                if (queued > 0) await pipeline.exec();
            }
        } catch (error) {
            console.error("cache: Redis clear failed", error);
        }
    }

    if (!prefix) {
        memoryStore.clear();
        return;
    }
    for (const key of memoryStore.keys()) {
        if (key.startsWith(prefix)) memoryStore.delete(key);
    }
}
