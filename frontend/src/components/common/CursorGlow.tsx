/**
 * @file CursorGlow.tsx
 * @description Decorative cursor glow overlay component.
 *
 * Renders a radial gradient that follows the user's mouse cursor across the
 * entire viewport, creating a subtle glow effect.  The glow colour adapts to
 * the active theme (indigo in dark mode, slate in light mode).
 *
 * The component is `pointer-events-none` so it does not block any interactions.
 * Returns `null` when the cursor has not moved into the viewport.
 *
 * Mounted at the application root level in `App.tsx` so the glow covers the
 * whole page regardless of the current route.
 */

import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';


export const CursorGlow: React.FC = () => {
  const { theme } = useTheme();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const glowColor =
    theme === 'dark'
      ? 'rgba(99, 102, 241, 0.15)' // Indigo glow in dark mode
      : 'rgba(99, 196, 241, 0.25)'; // Soft indigo glow in light mode

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`,
      }}
    />
  );
};
