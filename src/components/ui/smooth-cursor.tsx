"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useReducedMotion } from "motion/react";

interface Position {
  x: number;
  y: number;
}

export interface SmoothCursorProps {
  disableRotation?: boolean;
  disableSmooth?: boolean;
}

export function SmoothCursor({
  disableRotation = true,
  disableSmooth = false,
}: SmoothCursorProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isOverPointer, setIsOverPointer] = useState(false);
  const [isOverText, setIsOverText] = useState(false);
  const [isOverPrevent, setIsOverPrevent] = useState(false);

  const prefersReducedMotion = useReducedMotion();

  const lastMousePos = useRef<Position>({ x: 0, y: 0 });
  const velocity = useRef<Position>({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);
  const movingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fisika pegas responsif minimal lag ala hexaa.sh
  const cursorX = useSpring(0, {
    stiffness: disableSmooth ? 10000 : 1200,
    damping: disableSmooth ? 100 : 80,
    mass: disableSmooth ? 0.1 : 0.28,
  });

  const cursorY = useSpring(0, {
    stiffness: disableSmooth ? 10000 : 1200,
    damping: disableSmooth ? 100 : 80,
    mass: disableSmooth ? 0.1 : 0.28,
  });

  const rotation = useSpring(0, {
    stiffness: 800,
    damping: 60,
    mass: 0.35,
  });

  const scale = useSpring(1, {
    stiffness: 1000,
    damping: 60,
    mass: 0.2,
  });

  // Deteksi ukuran layar perangkat mobile (< 768px) seperti hexaa.sh useIsMobile
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const updateVelocity = useCallback((currentPos: Position) => {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTime.current;

    if (deltaTime > 0) {
      velocity.current = {
        x: (currentPos.x - lastMousePos.current.x) / deltaTime,
        y: (currentPos.y - lastMousePos.current.y) / deltaTime,
      };
    }

    lastUpdateTime.current = currentTime;
    lastMousePos.current = currentPos;
  }, []);

  const checkIfOverElement = useCallback((clientX: number, clientY: number) => {
    const element = document.elementFromPoint(clientX, clientY);
    if (!element) return;

    // 1. Elemen Pointer (Tombol, Tautan, Input Interaktif)
    const isPointerElement =
      element.closest(
        "a, button, [role='button'], input[type='button'], input[type='submit'], select, label, [data-cursor-pointer]"
      ) !== null || window.getComputedStyle(element).cursor === "pointer";
    setIsOverPointer(isPointerElement);

    // 2. Elemen Teks (Heading, Paragraph, Blockquote, Code)
    const isTextElement =
      !isPointerElement &&
      (element.closest("h1, h2, h3, h4, h5, h6, p, blockquote, code, [data-cursor-text]") !== null ||
        window.getComputedStyle(element).cursor === "text");
    setIsOverText(isTextElement);

    // 3. Elemen Pencegah Kursor Kustom
    const isPreventElement =
      element.closest("[data-smoothcursor-prevent]") !== null;
    setIsOverPrevent(isPreventElement);
  }, []);

  useEffect(() => {
    if (!mounted || isMobile) return;

    let rafId: number = 0;

    const smoothMouseMove = (e: MouseEvent) => {
      const currentPos = { x: e.clientX, y: e.clientY };
      updateVelocity(currentPos);
      checkIfOverElement(e.clientX, e.clientY);

      cursorX.set(currentPos.x);
      cursorY.set(currentPos.y);

      if (!hasMoved) setHasMoved(true);
      setIsMoving(true);

      const speed = Math.sqrt(
        velocity.current.x ** 2 + velocity.current.y ** 2
      );

      if (speed > 0.1 && !disableRotation && !prefersReducedMotion) {
        const currentAngle =
          Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI);
        let angleDiff = currentAngle - previousAngle.current;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        accumulatedRotation.current += angleDiff;
        rotation.set(accumulatedRotation.current);
        previousAngle.current = currentAngle;
      }

      if (movingTimeoutRef.current) {
        clearTimeout(movingTimeoutRef.current);
      }

      // Fadeout dan perbesar saat kursor idle ala hexaa.sh
      movingTimeoutRef.current = setTimeout(
        () => {
          setIsMoving(false);
          movingTimeoutRef.current = null;
        },
        prefersReducedMotion ? 0 : 650
      );
    };

    const throttledMouseMove = (e: MouseEvent) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        smoothMouseMove(e);
        rafId = 0;
      });
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      scale.set(0.78);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      scale.set(1);
    };

    const handleMouseLeave = () => {
      setIsMoving(false);
    };

    const handleMouseEnter = () => {
      setIsMoving(true);
    };

    window.addEventListener("mousemove", throttledMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafId) cancelAnimationFrame(rafId);
      if (movingTimeoutRef.current) clearTimeout(movingTimeoutRef.current);
    };
  }, [
    mounted,
    isMobile,
    hasMoved,
    cursorX,
    cursorY,
    rotation,
    scale,
    disableRotation,
    prefersReducedMotion,
    updateVelocity,
    checkIfOverElement,
  ]);

  if (!mounted || isMobile || !hasMoved || isOverPrevent) {
    return null;
  }

  const isExpanded = isOverPointer || isClicking;
  const isVisible = isMoving || isExpanded || isOverText;

  return (
    <motion.div
      className={`pointer-events-none fixed top-0 left-0 z-[99999] mix-blend-exclusion transition-[scale,opacity] ${
        isVisible ? "scale-100 opacity-100 duration-200" : "scale-150 opacity-0 duration-500"
      }`}
      style={{
        left: cursorX,
        top: cursorY,
        transform: "translate(-50%, -50%) translateZ(0)",
        backfaceVisibility: "hidden",
        willChange: "transform",
      }}
    >
      <motion.div
        style={{
          scale,
          rotate: disableRotation || isOverPointer ? 0 : rotation,
        }}
      >
        {/* 1. Kursor Mode Pointer (Hover Tombol/Link) ala hexaa.sh: Piringan Putih Solid Eksklusi */}
        {isOverPointer ? (
          <div className="relative flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-white shadow-sm transition-all duration-150 ease-out" />
            <div className="absolute h-13 w-13 rounded-full border border-white/30 animate-ping opacity-25" />
          </div>
        ) : isOverText ? (
          /* 2. Kursor Mode Teks (Hover Heading/Paragraph): Kapsul Vertikal Magnetik */
          <div className="relative flex items-center justify-center">
            <div className="h-8 w-2 rounded-full bg-white shadow-xs transition-all duration-150 ease-out" />
          </div>
        ) : (
          /* 3. Kursor Mode Normal (Roaming/Default): Cincin Lingkaran 34px Berkontur + Titik Inti */
          <div className="relative flex items-center justify-center">
            {/* Cincin Lingkaran Luar 34px */}
            <div className="h-[34px] w-[34px] rounded-full border-2 border-white shadow-sm transition-all duration-200 ease-out" />
            {/* Titik Tengah Inti (Center Core Dot) */}
            <div
              className={`absolute rounded-full bg-white transition-all duration-150 ${
                isClicking ? "h-2.5 w-2.5" : "h-1.5 w-1.5"
              }`}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}


