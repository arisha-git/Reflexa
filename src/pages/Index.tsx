import { useState, useEffect } from "react";
import { emergencyScenarios, EmergencyScenario } from "@/data/emergencyScenarios";
import { EmergencyCard } from "@/components/EmergencyCard";
import { GuidedEmergency } from "@/components/GuidedEmergency";
import { EmergencyDetectionScreen } from "@/components/EmergencyDetectionScreen";
import { LocationData } from "@/hooks/useGeolocation";
import { Shield, Phone, AlertTriangle, Activity } from "lucide-react";
import reflexaLogo from "@/assets/reflexa-logo.png";

type AppState = 
  | { screen: "home" }
  | { screen: "detecting" }
  | { screen: "guided"; scenario: EmergencyScenario; description?: string; location?: LocationData | null };

export default function Index() {
  const [state, setState] = useState<AppState>({ screen: "home" });
  const [pulse, setPulse] = useState(false);

  // Heartbeat pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  if (state.screen === "detecting") {
    return (
      <EmergencyDetectionScreen
        onScenarioDetected={(scenario, description, location) =>
          setState({ screen: "guided", scenario, description, location })
        }
        onCancel={() => setState({ screen: "home" })}
      />
    );
  }

  if (state.screen === "guided") {
    return (
      <GuidedEmergency
        scenario={state.scenario}
        onExit={() => setState({ screen: "home" })}
        emergencyDescription={state.description}
        emergencyLocation={state.location}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden pb-2">
        <div className="absolute inset-0 bg-gradient-to-b from-critical/20 via-critical/5 to-transparent pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-critical/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
        <div className="absolute top-20 -left-32 w-[250px] h-[250px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 -right-20 w-[200px] h-[200px] bg-warning/6 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative px-5 pt-12 pb-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="w-4 h-4 text-safe" />
              <span className="text-[11px] font-medium tracking-wide uppercase">System Active</span>
            </div>
            <a
              href="tel:911"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-critical text-critical-foreground font-display font-bold text-sm pulse-emergency active:scale-95 transition-transform shadow-lg shadow-critical/40"
            >
              <Phone className="w-4 h-4" />
              911
            </a>
          </div>

          {/* Brand */}
          <div className="flex items-center gap-4 mb-3">
            <div className={`relative w-10 h-10 transition-all duration-300 ${pulse ? 'drop-shadow-[0_0_20px_rgba(220,38,38,0.5)] scale-105' : 'scale-100'}`}>
              <img src={reflexaLogo} alt="Reflexa logo" width={40} height={40} className="w-full h-full object-contain" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-safe border-2 border-background breathe" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl text-foreground tracking-tight leading-none">
                Reflexa
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="h-px w-6 bg-gradient-to-r from-critical to-transparent" />
                <p className="text-[10px] text-primary font-bold tracking-[0.3em] uppercase">
                  Instant Survival Guide
                </p>
              </div>
            </div>
          </div>

          <p className="text-lg text-foreground font-display font-bold leading-snug mb-5 max-w-[320px]">
            Go from zero to life-saver<br />
            <span className="text-primary">in 10 seconds.</span>
          </p>

          <div className="h-3" />

          {/* Panic Button — now triggers detection screen */}
          <button
            onClick={() => setState({ screen: "detecting" })}
            className="group w-full p-5 rounded-2xl border-2 border-critical/50 bg-gradient-to-r from-critical/15 via-critical/10 to-critical/5 active:scale-[0.97] transition-all duration-200 glow-critical mb-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-critical/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl bg-critical/20 flex items-center justify-center shrink-0 transition-all duration-300 ${pulse ? 'bg-critical/30' : ''}`}>
                <AlertTriangle className="w-7 h-7 text-critical" />
              </div>
              <div className="text-left">
                <p className="font-display font-bold text-xl text-critical tracking-tight">
                  I DON'T KNOW WHAT TO DO
                </p>
                <p className="text-xs text-critical/60 mt-1 font-medium">
                  🎙️ Voice + 📍 GPS — auto-detect emergency
                </p>
              </div>
            </div>
          </button>

          {/* Info strip */}
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card/80 border border-border/60 backdrop-blur-sm">
            <div className="w-7 h-7 rounded-lg bg-safe/10 flex items-center justify-center shrink-0">
              <Shield className="w-3.5 h-3.5 text-safe" />
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="text-foreground font-semibold">Hands-free voice</span> · Adapts to stress · Location sharing
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
            onClick={() => setState({ screen: "guided", scenario: s })}
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
