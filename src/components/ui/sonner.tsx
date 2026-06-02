"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Alert02Icon,
  MultiplicationSignCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            strokeWidth={2}
            className="size-4"
          />
        ),
        info: (
          <HugeiconsIcon
            icon={InformationCircleIcon}
            strokeWidth={2}
            className="size-4"
          />
        ),
        warning: (
          <HugeiconsIcon
            icon={Alert02Icon}
            strokeWidth={2}
            className="size-4"
          />
        ),
        error: (
          <HugeiconsIcon
            icon={MultiplicationSignCircleIcon}
            strokeWidth={2}
            className="size-4"
          />
        ),
        loading: (
          <HugeiconsIcon
            icon={Loading03Icon}
            strokeWidth={2}
            className="size-4 animate-spin"
          />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--primary)",
          "--normal-text": "var(--primary-foreground)",
          "--normal-border":
            "color-mix(in oklab, var(--primary) 55%, var(--border))",

          "--success-bg": "var(--primary)",
          "--success-text": "var(--primary-foreground)",
          "--success-border":
            "color-mix(in oklab, var(--primary) 75%, var(--secondary))",

          "--info-bg":
            "color-mix(in oklab, var(--primary) 88%, var(--sidebar-accent))",
          "--info-text": "var(--primary-foreground)",
          "--info-border":
            "color-mix(in oklab, var(--sidebar-accent) 65%, var(--primary))",

          "--warning-bg":
            "color-mix(in oklab, var(--primary) 72%, var(--secondary))",
          "--warning-text": "var(--primary-foreground)",
          "--warning-border":
            "color-mix(in oklab, var(--secondary) 60%, var(--primary))",

          "--error-bg": "var(--destructive)",
          "--error-text": "var(--primary-foreground)",
          "--error-border":
            "color-mix(in oklab, var(--destructive) 80%, var(--border))",

          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast glass-strong text-foreground shadow-xl font-sans",
          title: "font-label font-bold uppercase tracking-wide text-[13px]",
          description: "text-text-secondary font-sans font-medium",
          actionButton:
            "bg-primary text-primary-foreground font-label uppercase text-xs hover:bg-primary-hover rounded-lg",
          cancelButton: "bg-surface-2 text-foreground font-label uppercase text-xs hover:bg-surface rounded-lg",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
