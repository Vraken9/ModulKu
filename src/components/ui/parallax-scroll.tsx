"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ParallaxLayerProps {
  children?: React.ReactNode;
  layer: string;
  className?: string;
  speed?: number;
}

export function ParallaxLayer({
  children,
  layer,
  className,
}: ParallaxLayerProps) {
  return (
    <div data-parallax-layer={layer} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

export interface ParallaxLayerConfig {
  layer: string;
  yPercent: number;
}

export interface ParallaxScrollProps {
  children: React.ReactNode;
  className?: string;
  layers?: ParallaxLayerConfig[];
}

/**
 * ParallaxScroll component inspired by hexaa.sh/labs/components/parallax-scroll.
 * Applies smooth proportional vertical translations to configured layers based on scroll progress.
 */
export function ParallaxScroll({
  children,
  className,
  layers = [
    { layer: "bg-pattern", yPercent: 25 },
    { layer: "3d-element", yPercent: -15 },
    { layer: "floating-badge", yPercent: -35 },
  ],
}: ParallaxScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;

    const handleScroll = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only calculate when container is in or near viewport
      if (rect.bottom >= 0 && rect.top <= windowHeight) {
        // Progress from 0 (container entering viewport) to 1 (container exiting viewport)
        const totalDistance = rect.height + windowHeight;
        const currentDistance = windowHeight - rect.top;
        const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));

        // Center progress around 0 (-0.5 to 0.5)
        const centeredProgress = progress - 0.5;

        layers.forEach((layerConfig) => {
          const elements = container.querySelectorAll<HTMLElement>(
            `[data-parallax-layer="${layerConfig.layer}"]`
          );
          const offsetPx = centeredProgress * layerConfig.yPercent * 2.5;

          elements.forEach((el) => {
            el.style.transform = `translate3d(0, ${offsetPx.toFixed(1)}px, 0)`;
          });
        });
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [layers]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {children}
    </div>
  );
}
