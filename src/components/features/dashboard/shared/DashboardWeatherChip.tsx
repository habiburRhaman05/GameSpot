"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudRain,
  CloudSun,
  Cloudy,
  Snowflake,
  Sun,
} from "lucide-react";

import { weatherService } from "@/service/weather.service";
import { cn } from "@/lib/utils";

type WeatherVisual = {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const WEATHER_REFRESH_MS = 10 * 60 * 1000;

const getWeatherVisual = (code: number, isDay: boolean): WeatherVisual => {
  if (code === 0) return { label: "Clear", Icon: isDay ? Sun : CloudSun };
  if ([1, 2].includes(code)) return { label: "Partly Cloudy", Icon: CloudSun };
  if (code === 3) return { label: "Cloudy", Icon: Cloudy };
  if ([45, 48].includes(code)) return { label: "Fog", Icon: CloudFog };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: "Drizzle", Icon: CloudDrizzle };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: "Rain", Icon: CloudRain };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Snow", Icon: Snowflake };
  if ([95, 96, 99].includes(code)) return { label: "Storm", Icon: CloudRain };
  return { label: "Weather", Icon: Cloud };
};

export function DashboardWeatherChip() {
  const weatherQuery = useQuery({
    queryKey: ["dashboard-weather-current"],
    queryFn: () => weatherService.getCurrentWeather(),
    staleTime: WEATHER_REFRESH_MS,
    gcTime: 30 * 60 * 1000,
    refetchInterval: WEATHER_REFRESH_MS,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 0,
  });

  if (weatherQuery.isLoading) {
    return (
      <div className="h-9 w-36 skeleton rounded-lg" />
    );
  }

  if (weatherQuery.isError || !weatherQuery.data) return null;

  const weather = weatherQuery.data;
  const visual = getWeatherVisual(weather.weatherCode, weather.isDay);
  const shortLocation = weather.cityLabel.split(",")[0]?.trim() || "Local";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 rounded-lg border border-border/60",
        "bg-surface-glass backdrop-blur-xl px-3 py-2 shadow-sm",
        "transition-all duration-200",
      )}
    >
      <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={visual.label}
            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <visual.Icon className="h-3.5 w-3.5 text-primary" />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[11px] font-semibold text-foreground">
          {weather.temperatureC}°C · {shortLocation}
        </p>
        <p className="truncate text-[10px] text-text-tertiary">
          {visual.label} · {weather.windSpeedKmh} km/h
        </p>
      </div>
    </div>
  );
}
