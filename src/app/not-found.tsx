import Link from "next/link";
import { Home, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Card className="max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-xl">
        <CardContent className="p-0 space-y-6">
          {/* 404 Illustration */}
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-primary/5" />
            <span className="font-display text-6xl font-bold text-primary">404</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Page not found
            </h1>
            <p className="text-sm text-text-tertiary">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been
              removed or doesn&apos;t exist.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="gap-2">
              <Link href="/"><Home className="h-4 w-4" />Back to Home</Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/venues"><Search className="h-4 w-4" />Browse Venues</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
