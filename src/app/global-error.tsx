"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body className="bg-background text-foreground">
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="max-w-md space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-semibold tracking-tight">Critical Error</h1>
              <p className="text-sm text-text-tertiary">
                A critical error occurred. Please try refreshing.
              </p>
            </div>
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-fg transition-all hover:bg-primary-hover active:scale-[0.98]"
            >
              <RefreshCcw className="h-4 w-4" />
              Reload Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
