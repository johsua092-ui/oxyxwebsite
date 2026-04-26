"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}

export default function TiltCard({
  children,
  className = "",
  intensity = 8,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ transform: "", glarePos: { x: 50, y: 50 } });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * intensity;
    const rotateY = (x - 0.5) * intensity;

    setStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      glarePos: { x: x * 100, y: y * 100 },
    });
  }

  function handleLeave() {
    setStyle({ transform: "", glarePos: { x: 50, y: 50 } });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative overflow-hidden transition-transform duration-300 ease-out ${className}`}
      style={{ transform: style.transform, transformStyle: "preserve-3d" }}
    >
      {children}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 hover-parent:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${style.glarePos.x}% ${style.glarePos.y}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
          }}
        />
      )}
    </div>
  );
}
