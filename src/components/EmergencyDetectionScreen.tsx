import { useState, useEffect, useRef } from "react";
import { useGeolocation, LocationData } from "@/hooks/useGeolocation";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useCamera } from "@/hooks/useCamera";
import { EmergencyScenario, emergencyScenarios } from "@/data/emergencyScenarios";
import { Mic, MapPin, Loader2, Radio, Share2, Camera, X, ScanEye } from "lucide-react";

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
  const { isCapturing, isAnalyzing, preview, analysis, error: cameraError, startCamera, stopCamera, captureAndAnalyze, reset: resetCamera } = useCamera();
  const [phase, setPhase] = useState<"listening" | "detected" | "manual" | "camera">("listening");
  const [detectedScenario, setDetectedScenario] = useState<EmergencyScenario | null>(null);
  const [cameraDescription, setCameraDescription] = useState("");
  const [dots, setDots] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getLocation();
    startListening();
    return () => stopListening();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    if (phase === "detected" && detectedScenario) {
      const timer = setTimeout(() => {
        onScenarioDetected(detectedScenario, cameraDescription || transcript, location);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, detectedScenario]);

  const handleManualSelect = (scenario: EmergencyScenario) => {
    stopListening();
    stopCamera();
    onScenarioDetected(scenario, transcript, location);
  };

  const handleOpenCamera = async () => {
    stopListening();
    setPhase("camera");
    const stream = await startCamera();
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current) return;
    const scenario = await captureAndAnalyze(videoRef.current);
    if (scenario) {
      setCameraDescription(analysis?.description || "Camera-detected emergency");
      setDetectedScenario(scenario);
      stopCamera();
      setPhase("detected");
    }
  };

  const handleCameraBack = () => {
    stopCamera();
    resetCamera();
    setPhase("listening");
    startListening();
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
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-critical/10 rounded-full blur-[120px] pulse-emergency" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-6">
        {phase === "detected" ? (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <div className="text-6xl mb-4">{detectedScenario?.icon}</div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">
              {detectedScenario?.title} Detected
            </h2>
            {analysis?.description && (
              <p className="text-sm text-muted-foreground mb-2 max-w-xs mx-auto">{analysis.description}</p>
            )}
            <p className="text-muted-foreground text-sm">Loading guidance...</p>
            <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mt-4" />
          </div>
        ) : phase === "camera" ? (
          /* Camera mode */
          <div className="w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={handleCameraBack} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm">
                <X className="w-4 h-4" /> Back
              </button>
              <h2 className="font-display font-bold text-lg text-foreground">📷 Camera Scan</h2>
              <div className="w-14" />
            </div>

            <div className="relative rounded-2xl overflow-hidden border-2 border-border bg-black aspect-[4/3]">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
                  <ScanEye className="w-10 h-10 text-primary animate-pulse" />
                  <p className="text-white text-sm font-medium">Analyzing{dots}</p>
                </div>
              )}
            </div>

            {preview && analysis && !analysis.detected && (
              <div className="p-3 rounded-xl bg-warning/10 border border-warning/20 text-center">
                <p className="text-warning text-sm font-medium">No emergency detected</p>
                <p className="text-xs text-muted-foreground mt-1">{analysis.description}</p>
                <button onClick={resetCamera} className="text-xs text-primary underline mt-2">Try again</button>
              </div>
            )}

            {cameraError && (
              <div className="p-3 rounded-xl bg-critical/10 border border-critical/20 text-center">
                <p className="text-critical text-sm">{cameraError}</p>
              </div>
            )}

            <button
              onClick={handleCapture}
              disabled={isAnalyzing || !isCapturing}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg disabled:opacity-50 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              {isAnalyzing ? "Analyzing..." : "Capture & Analyze"}
            </button>

            <button
              onClick={() => { stopCamera(); setPhase("manual"); }}
              className="w-full text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Select manually instead
            </button>
          </div>
        ) : phase === "manual" ? (
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

            {/* Camera + manual options */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleOpenCamera}
                className="flex items-center gap-2 mx-auto px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-sm font-medium text-foreground"
              >
                <Camera className="w-4 h-4 text-primary" />
                Use Camera Instead
              </button>
              <button
                onClick={() => { setPhase("manual"); stopListening(); }}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors block mx-auto"
              >
                Can't speak? Select manually
              </button>
              <button onClick={onCancel} className="text-sm text-muted-foreground hover:text-foreground transition-colors block mx-auto">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
