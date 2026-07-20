/**
 * Real, current local business data via Google Places API - the correct
 * tool for "how many nurseries are near Uttarahalli" style questions,
 * which a general web search engine (Tavily) simply doesn't have
 * structured data for. Requires GOOGLE_PLACES_API_KEY; fails soft
 * (returns []) when unset or on any API error, same pattern as every
 * other optional integration in this project.
 */

const PLACES_ENDPOINT = "https://maps.googleapis.com/maps/api/place/textsearch/json";

export interface LocalBusiness {
    name: string;
    address: string;
    rating?: number;
    userRatingsTotal?: number;
}

/**
 * `query` should already be a clean "<business type> in <place>" style
 * string (e.g. "plant nursery Uttarahalli Bangalore") - see
 * research.node.ts, which builds this via an LLM call rather than
 * passing the founder's raw message straight through.
 */
export async function searchLocalBusinesses(query: string): Promise<LocalBusiness[]> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
        return [];
    }

    try {
        const url = `${PLACES_ENDPOINT}?query=${encodeURIComponent(query)}&key=${apiKey}`;
        const res = await fetch(url);

        if (!res.ok) {
            console.error(`Places API HTTP error (${res.status}): ${await res.text()}`);
            return [];
        }

        const data = await res.json();

        if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
            console.error(`Places API returned status ${data.status}: ${data.error_message || ""}`);
            return [];
        }

        return (data.results || []).slice(0, 15).map((r: any) => ({
            name: r.name,
            address: r.formatted_address,
            rating: r.rating,
            userRatingsTotal: r.user_ratings_total,
        }));
    } catch (error) {
        console.error("searchLocalBusinesses: request failed, continuing without local data", error);
        return [];
    }
}

export function formatLocalBusinesses(businesses: LocalBusiness[]): string {
    if (businesses.length === 0) {
        return "";
    }

    const lines = businesses.map((b, i) => {
        const ratingPart = b.rating ? ` (${b.rating}★, ${b.userRatingsTotal ?? 0} reviews)` : "";
        return `${i + 1}. ${b.name} - ${b.address}${ratingPart}`;
    });

    return `Local businesses found (${businesses.length} result(s), via Google Places - real, current listings):\n${lines.join("\n")}`;
}
