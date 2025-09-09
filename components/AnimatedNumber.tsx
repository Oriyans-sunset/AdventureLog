import React, { useEffect, useRef, useState } from 'react';
import { ThemedText, ThemedTextProps } from './ThemedText';

export function AnimatedNumber({ value, duration = 500, ...textProps }: { value: number; duration?: number } & ThemedTextProps) {
  const [display, setDisplay] = useState<number>(value);
  const raf = useRef<number | null>(null);
  const fromRef = useRef<number>(value);

  useEffect(() => {
    // Cancel previous animation
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
    const from = fromRef.current;
    const to = value;
    const start = Date.now();

    const tick = () => {
      const now = Date.now();
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const current = Math.round(from + (to - from) * eased);
      setDisplay(current);
      if (t < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
        raf.current = null;
      }
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value, duration]);

  return <ThemedText {...textProps}>{display}</ThemedText>;
}
