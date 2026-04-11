import { useState } from "react";
import { emergencyScenarios, EmergencyScenario } from "@/data/emergencyScenarios";
import { EmergencyCard } from "@/components/EmergencyCard";
import { GuidedEmergency } from "@/components/GuidedEmergency";
import { Shield, Zap } from "lucide-react";

export default function Index() {
  const [activeScenario, setActiveScenario] = useState<EmergencyScenario | null>(null);

  if (activeScenario) {
    return (
      <GuidedEmergency
        scenario={activeScenario}
        onExit={() => setActiveScenario(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              SkillShot
            </h1>
            <p className="text-xs text-muted-foreground tracking-wide uppercase">
              Emergency Skill Injection
            </p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mt-4 leading-relaxed">
          Tap a situation below. Get step-by-step voice guidance that adapts to your stress level in real-time.
        </p>
      </div>

      {/* Tip banner */}
      <div className="mx-5 mb-5 p-4 rounded-xl bg-secondary/60 border border-border flex items-start gap-3">
        <Shield className="w-5 h-5 text-safe mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-semibold">Voice-guided.</span> Each scenario reads instructions aloud so your hands stay free. The system detects hesitation and simplifies instructions automatically.
        </p>
      </div>

      {/* Scenarios */}
      <div className="px-5 pb-12 space-y-3">
        <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
          Select Emergency
        </h2>
        {emergencyScenarios.map((s) => (
          <EmergencyCard
            key={s.id}
            scenario={s}
            onClick={() => setActiveScenario(s)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 pb-8 text-center">
        <p className="text-xs text-muted-foreground/50">
          Not a substitute for professional medical training. Always call emergency services.
        </p>
      </div>
    </div>
  );
}
