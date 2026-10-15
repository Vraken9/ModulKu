import React from "react";
import Image from "next/image";

interface ModulKuLogoProps {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
  showSubtitle?: boolean;
  subtitleText?: string;
  inverted?: boolean;
}

export function ModulKuLogo({
  variant = "full",
  size = "md",
  className = "",
  showSubtitle = false,
  subtitleText = "Standar BKPDM Kemendikdasmen",
  inverted = false,
}: ModulKuLogoProps) {
  const heightClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  }[size];

  if (variant === "icon") {
    const iconSrc = inverted ? "/modulku-icon-white.png" : "/modulku-icon.png";
    return (
      <div className={`inline-flex items-center shrink-0 ${className}`}>
        <Image
          src={iconSrc}
          alt="ModulKu Icon"
          width={40}
          height={40}
          className={`${heightClasses} w-auto object-contain`}
          priority
        />
      </div>
    );
  }

  const logoSrc = inverted ? "/modulku-logo-white.png" : "/modulku-logo.png";

  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      <Image
        src={logoSrc}
        alt="ModulKu Logo"
        width={140}
        height={44}
        className={`${heightClasses} w-auto object-contain`}
        priority
      />
      {showSubtitle && (
        <span
          className={`hidden sm:inline-block border-l pl-2.5 text-[10px] uppercase font-mono font-medium tracking-wider ${
            inverted ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500"
          }`}
        >
          {subtitleText}
        </span>
      )}
    </div>
  );
}
