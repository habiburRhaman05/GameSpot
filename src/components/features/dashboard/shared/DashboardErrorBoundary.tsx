"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface DashboardErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface DashboardErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class DashboardErrorBoundary extends Component<
  DashboardErrorBoundaryProps,
  DashboardErrorBoundaryState
> {
  constructor(props: DashboardErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): DashboardErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Dashboard Error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex max-w-md flex-col items-center gap-5 text-center">
            {/* Error icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>

            {/* Error info */}
            <div className="space-y-2">
              <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
                {this.props.fallbackTitle || "Something went wrong"}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {this.props.fallbackMessage ||
                  "An unexpected error occurred while loading this section. Please try again."}
              </p>
            </div>

            {/* Error details (dev only) */}
            {this.state.error && (
              <div className="w-full rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-left">
                <p className="text-[11px] font-mono text-destructive/80 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Retry button */}
            <button
              type="button"
              onClick={this.handleRetry}
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary-hover hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
