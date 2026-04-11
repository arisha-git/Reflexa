import { useState } from "react";
import { emergencyScenarios, EmergencyScenario } from "@/data/emergencyScenarios";
import { EmergencyCard } from "@/components/EmergencyCard";
import { GuidedEmergency } from "@/components/GuidedEmergency";
import { Shield, Phone, AlertTriangle } from "lucide-react";

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

  // "I don't know what's happening" → defaults to CPR (most critical)
  const panicScenario = emergencyScenarios.find((s) => s.id === "cpr")!;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-critical/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-critical/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative px-5 pt-14 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display font-bold text-3xl text-foreground tracking-tight">
                Reflexa
              </h1>
              <p className="text-xs text-primary font-semibold tracking-[0.2em] uppercase mt-0.5">
                Instant Survival Guide
              </p>
            </div>
            <a
              href="tel:911"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-critical text-critical-foreground font-display font-bold text-sm pulse-emergency active:scale-95 transition-transform"
            >
              <Phone className="w-4 h-4" />
              911
            </a>
          </div>

          {/* Panic Big Button */}
          <button
            onClick={() => setActiveScenario(panicScenario)}
            className="w-full p-5 rounded-2xl border-2 border-critical/40 bg-critical/10 active:scale-[0.97] transition-all duration-200 glow-critical mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-critical/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-critical" />
              </div>
              <div className="text-left">
                <p className="font-display font-bold text-lg text-critical">
                  I DON'T KNOW WHAT TO DO
                </p>
                <p className="text-xs text-critical/70 mt-0.5">
                  Tap here — we'll guide you step by step
                </p>
              </div>
            </div>
          </button>

          {/* Info strip */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-secondary/60 border border-border">
            <Shield className="w-4 h-4 text-safe shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="text-foreground font-semibold">Hands-free voice guidance</span> that adapts to your stress level
            </p>
          </div>
        </div>
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
