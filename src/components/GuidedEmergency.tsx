import { useState, useEffect, useCallback } from "react";
import { EmergencyScenario } from "@/data/emergencyScenarios";
import { useVoice } from "@/hooks/useVoice";
import { usePanicDetector, PanicLevel } from "@/hooks/usePanicDetector";
import { ArrowLeft, ArrowRight, Phone, Volume2, VolumeX } from "lucide-react";

interface Props {
  scenario: EmergencyScenario;
  onExit: () => void;
}

const panicColors: Record<PanicLevel, string> = {
  calm: "border-safe/40",
  nervous: "border-warning/40",
  panicking: "border-critical/40 glow-critical",
};

const panicLabels: Record<PanicLevel, string> = {
  calm: "You're doing great",
  nervous: "Stay focused",
  panicking: "BREATHE. Follow the steps.",
};

export function GuidedEmergency({ scenario, onExit }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showSimplified, setShowSimplified] = useState(false);
  const { speak, stop } = useVoice();
  const { panicLevel, recordInteraction, reset } = usePanicDetector();

  const step = scenario.steps[currentStep];
  const isLast = currentStep === scenario.steps.length - 1;
  const isFirst = currentStep === 0;

  // Auto-simplify when panicking
  useEffect(() => {
    if (panicLevel === "panicking") {
      setShowSimplified(true);
      if (voiceEnabled) {
        speak(step.simplifiedInstruction, { urgent: true });
      }
    }
  }, [panicLevel, step.simplifiedInstruction, voiceEnabled, speak]);

  // Speak instruction on step change
  useEffect(() => {
    if (voiceEnabled) {
      const text = showSimplified ? step.simplifiedInstruction : step.instruction;
      speak(text, { urgent: panicLevel === "panicking" });
    }
  }, [currentStep, voiceEnabled, showSimplified]);

  const handleNext = useCallback(() => {
    recordInteraction();
    if (!isLast) {
      setCurrentStep((s) => s + 1);
      setShowSimplified(false);
    }
  }, [isLast, recordInteraction]);

  const handlePrev = useCallback(() => {
    recordInteraction();
    if (!isFirst) {
      setCurrentStep((s) => s - 1);
      setShowSimplified(false);
    }
  }, [isFirst, recordInteraction]);

  const handleExit = useCallback(() => {
    stop();
    reset();
    onExit();
  }, [stop, reset, onExit]);

  const displayInstruction = showSimplified
    ? step.simplifiedInstruction
    : step.instruction;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={handleExit}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Exit</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{scenario.icon}</span>
          <span className="font-display font-bold text-foreground">
            {scenario.title}
          </span>
        </div>
        <button
          onClick={() => {
            setVoiceEnabled(!voiceEnabled);
            if (voiceEnabled) stop();
          }}
          className="p-2 rounded-lg bg-secondary text-secondary-foreground"
        >
          {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Progress */}
      <div className="px-4 pt-4">
        <div className="flex gap-1.5">
          {scenario.steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= currentStep ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {scenario.steps.length}
          </span>
          <span className={`text-xs font-medium ${
            panicLevel === "calm" ? "text-safe" : panicLevel === "nervous" ? "text-warning" : "text-critical"
          }`}>
            {panicLabels[panicLevel]}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-6">
        <div
          className={`p-6 rounded-2xl border-2 transition-all duration-500 ${panicColors[panicLevel]} bg-card`}
          onClick={() => recordInteraction()}
        >
          <h2 className={`font-display font-bold mb-4 leading-tight transition-all ${
            showSimplified ? "text-2xl" : "text-xl"
          } text-foreground`}>
            {displayInstruction}
          </h2>

          {!showSimplified && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {step.detail}
            </p>
          )}

          {step.criticalWarning && (
            <div className="mt-4 p-3 rounded-lg bg-critical/10 border border-critical/20">
              <p className="text-critical text-sm font-semibold">
                ⚠️ {step.criticalWarning}
              </p>
            </div>
          )}
        </div>

        {/* Simplify toggle */}
        {!showSimplified && (
          <button
            onClick={() => setShowSimplified(true)}
            className="mt-4 text-sm text-muted-foreground underline underline-offset-4 self-center hover:text-foreground transition-colors"
          >
            Too complex? Simplify
          </button>
        )}

        {/* Call 911 button */}
        {scenario.callEmergency && (
          <a
            href="tel:911"
            className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-critical text-critical-foreground font-display font-bold text-lg pulse-emergency"
          >
            <Phone className="w-5 h-5" />
            Call 911
          </a>
        )}
      </div>

      {/* Navigation */}
      <div className="px-4 pb-8 flex gap-3">
        <button
          onClick={handlePrev}
          disabled={isFirst}
          className="flex-1 py-4 rounded-xl bg-secondary text-secondary-foreground font-display font-semibold text-lg disabled:opacity-30 transition-all active:scale-[0.97]"
        >
          <ArrowLeft className="w-5 h-5 mx-auto" />
        </button>
        <button
          onClick={handleNext}
          disabled={isLast}
          className="flex-[3] py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg disabled:opacity-30 transition-all active:scale-[0.97]"
        >
          {isLast ? "Done ✓" : "Next Step →"}
        </button>
      </div>
    </div>
  );
}
