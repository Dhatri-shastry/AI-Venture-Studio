import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function WorkspaceLoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-black">
      <div className="relative flex flex-col items-center">
        {/* Soft elegant glowing ring */}
        <div className="absolute h-16 w-16 animate-pulse rounded-full bg-brand-blue/10 blur-xl"></div>
        
        {/* Spinner */}
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
          <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Sparkles className="h-3 w-3 text-brand-blue animate-pulse" />
          </span>
        </div>
        
        <h3 className="mt-4 text-xs font-semibold tracking-tight font-sans text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
          Syncing Strategy Room...
        </h3>
      </div>
    </div>
  );
}
