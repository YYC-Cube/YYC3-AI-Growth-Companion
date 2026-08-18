import React, { useMemo } from 'react';

export interface CyberpunkBackgroundProps {
  particleCount?: number;
  streamCount?: number;
}

export const CyberpunkBackground: React.FC<CyberpunkBackgroundProps> = ({
  particleCount = 20,
  streamCount = 8,
}) => {
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 6 + 6,
      opacity: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.6
        ? 'rgba(255, 0, 255, 0.5)'
        : Math.random() > 0.3
          ? 'rgba(0, 240, 255, 0.5)'
          : 'rgba(0, 255, 65, 0.4)',
      glow: Math.random() > 0.6
        ? '0 0 6px rgba(255, 0, 255, 0.6)'
        : '0 0 6px rgba(0, 240, 255, 0.6)',
    }));
  }, [particleCount]);

  const dataStreams = useMemo(() => {
    return Array.from({ length: streamCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 4 + 3,
      height: Math.random() * 80 + 40,
      color: Math.random() > 0.5 ? 'var(--cyber-cyan)' : 'var(--cyber-magenta)',
    }));
  }, [streamCount]);

  return (
    <div className="cyber-bg" aria-hidden="true">
      {/* Ambient orbs */}
      <div className="cyber-orb cyber-orb-1" />
      <div className="cyber-orb cyber-orb-2" />
      <div className="cyber-orb cyber-orb-3" />

      {/* Circuit grid overlay */}
      <div className="cyber-circuit-grid" />

      {/* Scanlines */}
      <div className="cyber-scanlines" />

      {/* Data streams */}
      {dataStreams.map((stream) => (
        <div
          key={`stream-${stream.id}`}
          className="cyber-data-stream"
          style={{
            left: `${stream.left}%`,
            height: stream.height,
            animationDuration: `${stream.duration}s`,
            animationDelay: `${stream.delay}s`,
            background: `linear-gradient(to bottom, transparent, ${stream.color}, transparent)`,
          }}
        />
      ))}

      {/* Floating neon particles */}
      {particles.map((p) => (
        <div
          key={`particle-${p.id}`}
          className="cyber-particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            background: p.color,
            boxShadow: p.glow,
            animationName: 'floatParticle',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
          }}
        />
      ))}
    </div>
  );
};
