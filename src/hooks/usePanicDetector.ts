import { useState, useRef, useCallback } from "react";

export type PanicLevel = "calm" | "nervous" | "panicking";

export function usePanicDetector() {
  const [panicLevel, setPanicLevel] = useState<PanicLevel>("calm");
  const tapTimestamps = useRef<number[]>([]);
  const hesitationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recordInteraction = useCallback(() => {
    const now = Date.now();
    tapTimestamps.current.push(now);

    // Keep last 10 taps
    if (tapTimestamps.current.length > 10) {
      tapTimestamps.current = tapTimestamps.current.slice(-10);
    }

    // Clear hesitation timer
    if (hesitationTimer.current) {
      clearTimeout(hesitationTimer.current);
    }

    // Start new hesitation timer — if no interaction for 8s, user might be panicking
    hesitationTimer.current = setTimeout(() => {
      setPanicLevel("panicking");
    }, 8000);

    // Check tap frequency
    const recent = tapTimestamps.current.filter((t) => now - t < 3000);
    if (recent.length >= 5) {
      setPanicLevel("panicking"); // Rapid tapping
    } else if (recent.length >= 3) {
      setPanicLevel("nervous");
    } else {
      setPanicLevel("calm");
    }
  }, []);

  const reset = useCallback(() => {
    setPanicLevel("calm");
    tapTimestamps.current = [];
    if (hesitationTimer.current) clearTimeout(hesitationTimer.current);
  }, []);

  return { panicLevel, recordInteraction, reset };
}
