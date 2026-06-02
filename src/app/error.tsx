"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <Card className="max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-xl">
          <CardContent className="p-0 space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Something went wrong</h1>
              <p className="text-sm text-text-tertiary">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={() => reset()} className="gap-2">
                <RefreshCcw className="h-4 w-4" />Try Again
              </Button>
              <Button onClick={() => window.location.href = "/"} variant="outline" className="gap-2">
                <Home className="h-4 w-4" />Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
