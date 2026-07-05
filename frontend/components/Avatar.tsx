"use client";

import { useState } from "react";

interface AvatarProps {
  src: string;
  alt: string;
  initials: string;
  gradient: string;
  className?: string;
  textClassName?: string;
}

export default function Avatar({
  src,
  alt,
  initials,
  gradient,
  className = "h-10 w-10",
  textClassName = "text-sm",
}: AvatarProps) {
  const [failed, setFailed] = useState(false);

  const base = `relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`;

  if (failed) {
    return (
      <div
        className={`${base} bg-gradient-to-br ${gradient} font-bold text-white ${textClassName}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={base}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
