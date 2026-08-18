import React, { useMemo } from 'react';

export interface LiquidBackgroundProps {
  particleCount?: number;
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({ particleCount = 24 }) => {
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: Math.random() * 8 + 3,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 8,
      opacity: Math.random() * 0.4 + 0.15,
    }));
  }, [particleCount]);

  return (
    <div className="liquid-bg" aria-hidden="true">
      {/* Large flowing orbs */}
      <div className="liquid-orb liquid-orb-1" />
      <div className="liquid-orb liquid-orb-2" />
      <div className="liquid-orb liquid-orb-3" />
      <div className="liquid-orb liquid-orb-4" />
      <div className="liquid-orb liquid-orb-5" />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
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
