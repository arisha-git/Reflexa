import { EmergencyScenario } from "@/data/emergencyScenarios";

interface Props {
  scenario: EmergencyScenario;
  onClick: () => void;
}

const colorMap = {
  critical: "border-critical/30 hover:border-critical/60 hover:glow-critical",
  warning: "border-warning/30 hover:border-warning/60 hover:glow-warning",
  safe: "border-safe/30 hover:border-safe/60 hover:glow-safe",
};

const badgeMap = {
  critical: "bg-critical/20 text-critical",
  warning: "bg-warning/20 text-warning",
  safe: "bg-safe/20 text-safe",
};

export function EmergencyCard({ scenario, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-xl border-2 bg-card transition-all duration-300 active:scale-[0.97] ${colorMap[scenario.color]}`}
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl">{scenario.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-bold text-lg text-foreground">
              {scenario.title}
            </h3>
            {scenario.callEmergency && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeMap[scenario.color]}`}>
                Call 911
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{scenario.shortDesc}</p>
        </div>
      </div>
    </button>
  );
}
