import { useState, useEffect } from "react";
import { useGeolocation, LocationData } from "@/hooks/useGeolocation";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { EmergencyScenario, emergencyScenarios } from "@/data/emergencyScenarios";
import { Mic, MapPin, Loader2, Radio, Share2 } from "lucide-react";

interface Props {
  onScenarioDetected: (scenario: EmergencyScenario, description: string, location: LocationData | null) => void;
  onCancel: () => void;
}

const DETECTION_KEYWORDS: Record<string, string[]> = {
  choking: ["choking", "choke", "can't breathe", "throat", "stuck in throat", "gagging"],
  bleeding: ["bleeding", "blood", "cut", "wound", "gash", "sliced"],
  cpr: ["not breathing", "unconscious", "collapsed", "no pulse", "heart stopped", "passed out", "fainted"],
  burns: ["burn", "fire", "scalded", "hot water", "chemical burn"],
  seizure: ["seizure", "convulsion", "shaking", "fitting", "epilepsy"],
  allergic: ["allergic", "allergy", "epipen", "swelling", "hives", "anaphylaxis"],
  heartattack: ["heart attack", "chest pain", "arm pain", "heart", "crushing pain"],
  drowning: ["drowning", "water", "pool", "can't swim", "underwater"],
};

function detectScenario(text: string): EmergencyScenario | null {
  const lower = text.toLowerCase();
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const [id, keywords] of Object.entries(DETECTION_KEYWORDS)) {
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = id;
    }
  }

  if (bestMatch && bestScore > 0) {
    return emergencyScenarios.find((s) => s.id === bestMatch) || null;
  }
  return null;
}

export function EmergencyDetectionScreen({ onScenarioDetected, onCancel }: Props) {
  const { location, loading: locationLoading, getLocation } = useGeolocation();
  const { transcript, isListening, startListening, stopListening } = useVoiceRecognition();
  const [phase, setPhase] = useState<"listening" | "detected" | "manual">("listening");
  const [detectedScenario, setDetectedScenario] = useState<EmergencyScenario | null>(null);
  const [dots, setDots] = useState("");

  // Start location + mic on mount
  useEffect(() => {
    getLocation();
    startListening();
    return () => stopListening();
  }, []);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-detect scenario from voice
  useEffect(() => {
    if (transcript.length > 10) {
      const scenario = detectScenario(transcript);
      if (scenario) {
        setDetectedScenario(scenario);
        setPhase("detected");
        stopListening();
      }
    }
  }, [transcript]);

  // Auto-navigate after detection
  useEffect(() => {
    if (phase === "detected" && detectedScenario) {
      const timer = setTimeout(() => {
        onScenarioDetected(detectedScenario, transcript, location);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, detectedScenario]);

  const handleManualSelect = (scenario: EmergencyScenario) => {
    stopListening();
    onScenarioDetected(scenario, transcript, location);
  };

  const shareLocation = () => {
    if (location && navigator.share) {
      navigator.share({
        title: "🚨 REFLEXA EMERGENCY ALERT",
        text: `REFLEXA ALERT 🚨\nEmergency detected.\nLive location:\n${location.mapsLink}`,
        url: location.mapsLink,
      }).catch(() => {});
    } else if (location) {
      navigator.clipboard.writeText(
        `REFLEXA ALERT 🚨\nEmergency detected.\nLive location:\n${location.mapsLink}`
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Pulsing background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-critical/10 rounded-full blur-[120px] pulse-emergency" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-6">
        {phase === "detected" ? (
          /* Detected state */
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <div className="text-6xl mb-4">{detectedScenario?.icon}</div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">
              {detectedScenario?.title} Detected
            </h2>
            <p className="text-muted-foreground text-sm">Loading guidance...</p>
            <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mt-4" />
          </div>
        ) : phase === "manual" ? (
          /* Manual selection */
          <div className="w-full max-w-sm space-y-3">
            <h2 className="font-display font-bold text-xl text-foreground text-center mb-4">
              Select Emergency Type
            </h2>
            {emergencyScenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => handleManualSelect(s)}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all active:scale-[0.97]"
              >
                <span className="text-2xl">{s.icon}</span>
                <div className="text-left">
                  <p className="font-display font-bold text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.shortDesc}</p>
                </div>
              </button>
            ))}
            <button onClick={onCancel} className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
          </div>
        ) : (
          /* Listening state */
          <div className="text-center">
            {/* Mic visualizer */}
            <div className={`relative w-28 h-28 mx-auto mb-6 ${isListening ? "pulse-emergency" : ""}`}>
              <div className="absolute inset-0 rounded-full bg-critical/20 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-critical/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Mic className="w-10 h-10 text-critical" />
              </div>
            </div>

            <h2 className="font-display font-bold text-2xl text-foreground mb-2">
              Detecting emergency{dots}
            </h2>
            <p className="text-muted-foreground text-sm mb-2">
              {isListening ? "Speak now — describe what's happening" : "Starting microphone..."}
            </p>

            {transcript && (
              <div className="mt-4 p-3 rounded-xl bg-card border border-border max-w-sm mx-auto">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-critical" /> Hearing:
                </p>
                <p className="text-sm text-foreground italic">"{transcript}"</p>
              </div>
            )}

            {/* Location status */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              {locationLoading ? (
                <><Loader2 className="w-3 h-3 animate-spin" /> Getting location...</>
              ) : location ? (
                <button onClick={shareLocation} className="flex items-center gap-1 text-safe hover:underline">
                  <MapPin className="w-3 h-3" /> Location captured
                  <Share2 className="w-3 h-3 ml-1" />
                </button>
              ) : (
                <><MapPin className="w-3 h-3 text-warning" /> Location unavailable</>
              )}
            </div>

            {/* Can't detect? Manual select */}
            <div className="mt-8 space-y-3">
              <button
                onClick={() => { setPhase("manual"); stopListening(); }}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Can't speak? Select manually
              </button>
              <br />
              <button onClick={onCancel} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
