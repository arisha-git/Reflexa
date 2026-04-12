export interface EmergencyStep {
  instruction: string;
  detail: string;
  simplifiedInstruction: string; // shown if user hesitates
  criticalWarning?: string;
  duration?: number; // expected seconds for this step
  image?: string; // path to visual aid image
}

export interface EmergencyScenario {
  id: string;
  title: string;
  icon: string;
  color: "critical" | "warning" | "safe";
  shortDesc: string;
  steps: EmergencyStep[];
  callEmergency: boolean;
}

export const emergencyScenarios: EmergencyScenario[] = [
  {
    id: "choking",
    title: "Choking",
    icon: "🫁",
    color: "critical",
    shortDesc: "Person can't breathe or speak",
    callEmergency: true,
    steps: [
      {
        instruction: "Stand behind the person and wrap your arms around their waist",
        detail: "Lean them slightly forward. Place your fist just above their belly button.",
        simplifiedInstruction: "Go behind them. Arms around waist. Lean them forward.",
        criticalWarning: "If they're pregnant or obese, do chest thrusts instead",
      },
      {
        instruction: "Make a fist and place it above the belly button",
        detail: "Your thumb side should face inward. Grab your fist with the other hand.",
        simplifiedInstruction: "Fist above belly button. Grab it with other hand.",
      },
      {
        instruction: "Pull sharply inward and upward — hard and fast",
        detail: "Use quick, upward thrusts. Repeat up to 5 times.",
        simplifiedInstruction: "PULL IN AND UP. Hard. Do it 5 times.",
        duration: 10,
      },
      {
        instruction: "Check if the object came out",
        detail: "Look in their mouth. If still choking, repeat thrusts.",
        simplifiedInstruction: "Did it come out? No? Do it again!",
      },
      {
        instruction: "If unconscious, start CPR immediately",
        detail: "Lower them to the ground. Begin chest compressions. Call 911 if not done.",
        simplifiedInstruction: "They passed out? Put them down. Push on chest. Call 911.",
        criticalWarning: "Do NOT stop until help arrives",
      },
    ],
  },
  {
    id: "bleeding",
    title: "Severe Bleeding",
    icon: "🩸",
    color: "critical",
    shortDesc: "Heavy bleeding from wound",
    callEmergency: true,
    steps: [
      {
        instruction: "Apply direct pressure to the wound",
        detail: "Use a clean cloth, towel, or clothing. Press firmly with both hands.",
        simplifiedInstruction: "PRESS on the wound. Hard. Use cloth or shirt.",
      },
      {
        instruction: "Keep pressing — do NOT lift to check",
        detail: "Maintain constant pressure for at least 10 minutes.",
        simplifiedInstruction: "DON'T let go. Keep pressing. 10 minutes.",
        duration: 600,
        criticalWarning: "Lifting pressure restarts bleeding",
      },
      {
        instruction: "If blood soaks through, add more cloth on top",
        detail: "Never remove the first layer. Stack more material and keep pressing.",
        simplifiedInstruction: "Blood coming through? Add more cloth ON TOP. Keep pressing.",
      },
      {
        instruction: "Elevate the injured area above the heart",
        detail: "If it's a limb, raise it while maintaining pressure.",
        simplifiedInstruction: "Lift the arm/leg up. Keep pressing.",
      },
      {
        instruction: "Keep the person warm and calm",
        detail: "Cover them with a blanket. Talk to them. Wait for help.",
        simplifiedInstruction: "Cover them. Talk to them. Help is coming.",
      },
    ],
  },
  {
    id: "cpr",
    title: "CPR",
    icon: "❤️",
    color: "critical",
    shortDesc: "Person is unresponsive, not breathing",
    callEmergency: true,
    steps: [
      {
        instruction: "Check responsiveness — tap shoulders and shout",
        detail: "Shake their shoulders firmly. Shout 'Are you okay?' loudly.",
        simplifiedInstruction: "Shake them. Shout: ARE YOU OK?",
      },
      {
        instruction: "Call 911 and get an AED if available",
        detail: "Put phone on speaker. Ask someone nearby to find an AED.",
        simplifiedInstruction: "CALL 911 NOW. Speaker phone. Find AED.",
      },
      {
        instruction: "Place heel of hand on center of chest",
        detail: "Right between the nipples. Put other hand on top, fingers interlocked.",
        simplifiedInstruction: "Hand on CENTER of chest. Other hand on top.",
      },
      {
        instruction: "Push hard and fast — 2 inches deep, 100-120 per minute",
        detail: "Push to the beat of 'Stayin' Alive'. Let chest fully recoil between pushes.",
        simplifiedInstruction: "PUSH HARD. PUSH FAST. Think 'Stayin' Alive' beat.",
        duration: 120,
        criticalWarning: "Don't stop compressions except to give breaths",
      },
      {
        instruction: "Give 2 rescue breaths after every 30 compressions",
        detail: "Tilt head back, lift chin. Pinch nose. Seal mouth and blow for 1 second each.",
        simplifiedInstruction: "30 pushes → 2 breaths. Tilt head, pinch nose, blow.",
      },
      {
        instruction: "Continue until help arrives or they start breathing",
        detail: "Do NOT stop. Switch with someone every 2 minutes if possible.",
        simplifiedInstruction: "DON'T STOP. Switch with someone if tired.",
        criticalWarning: "Stopping compressions reduces survival chances",
      },
    ],
  },
  {
    id: "burns",
    title: "Burns",
    icon: "🔥",
    color: "warning",
    shortDesc: "Burn injury from heat, chemicals, or electricity",
    callEmergency: false,
    steps: [
      {
        instruction: "Cool the burn under cool running water for 20 minutes",
        detail: "Not ice cold — cool tap water. Start immediately.",
        simplifiedInstruction: "COOL WATER on burn. 20 minutes. Not ice!",
        duration: 1200,
        criticalWarning: "Do NOT use ice, butter, or toothpaste",
      },
      {
        instruction: "Remove jewelry or tight clothing near the burn",
        detail: "Do this quickly before swelling starts. Don't pull stuck clothing.",
        simplifiedInstruction: "Take off rings, watches near burn. Be gentle.",
      },
      {
        instruction: "Cover with a clean, non-stick dressing",
        detail: "Use cling wrap or a clean plastic bag if no dressing available.",
        simplifiedInstruction: "Cover with cling wrap or clean bandage.",
      },
      {
        instruction: "Take pain relief if available",
        detail: "Ibuprofen or paracetamol as directed. Keep hydrating.",
        simplifiedInstruction: "Take painkillers if you have them. Drink water.",
      },
    ],
  },
  {
    id: "seizure",
    title: "Seizure",
    icon: "⚡",
    color: "warning",
    shortDesc: "Person is having a seizure",
    callEmergency: true,
    steps: [
      {
        instruction: "Clear the area around them",
        detail: "Move furniture, sharp objects, anything they could hit.",
        simplifiedInstruction: "Move stuff away from them. Make space.",
        criticalWarning: "Do NOT hold them down or put anything in their mouth",
      },
      {
        instruction: "Protect their head",
        detail: "Place something soft under their head — jacket, pillow, your hands.",
        simplifiedInstruction: "Put something soft under their head.",
      },
      {
        instruction: "Time the seizure",
        detail: "Note when it started. Call 911 if it lasts more than 5 minutes.",
        simplifiedInstruction: "Check the time. Over 5 minutes = call 911.",
        duration: 300,
      },
      {
        instruction: "When it stops, roll them onto their side",
        detail: "Recovery position. This keeps their airway clear.",
        simplifiedInstruction: "Seizure over? Roll them on their side.",
      },
      {
        instruction: "Stay with them until they're fully alert",
        detail: "They'll be confused. Speak calmly. Tell them what happened.",
        simplifiedInstruction: "Stay. Talk calmly. Tell them they're safe.",
      },
    ],
  },
  {
    id: "allergic",
    title: "Allergic Reaction",
    icon: "💉",
    color: "critical",
    shortDesc: "Severe allergic reaction / anaphylaxis",
    callEmergency: true,
    steps: [
      {
        instruction: "Call 911 immediately",
        detail: "Anaphylaxis can be fatal within minutes. Don't wait.",
        simplifiedInstruction: "CALL 911 RIGHT NOW.",
      },
      {
        instruction: "Use their EpiPen if they have one",
        detail: "Remove cap. Push firmly into outer thigh. Hold 10 seconds.",
        simplifiedInstruction: "EpiPen → outer thigh → push hard → hold 10 sec.",
        duration: 10,
        criticalWarning: "Through clothing is fine. Don't inject into veins.",
      },
      {
        instruction: "Help them sit up if having trouble breathing",
        detail: "Sitting up opens airways. If dizzy, lay them down with legs raised.",
        simplifiedInstruction: "Can't breathe? Sit up. Dizzy? Lie down, legs up.",
      },
      {
        instruction: "Give a second EpiPen after 5 minutes if no improvement",
        detail: "Use on the other thigh. Continue monitoring.",
        simplifiedInstruction: "No better after 5 min? Second EpiPen, other leg.",
        duration: 300,
      },
      {
        instruction: "Monitor breathing until help arrives",
        detail: "Be ready to start CPR if they stop breathing.",
        simplifiedInstruction: "Watch their breathing. If they stop → CPR.",
      },
    ],
  },
  {
    id: "heartattack",
    title: "Heart Attack",
    icon: "🫀",
    color: "critical",
    shortDesc: "Chest pain, shortness of breath",
    callEmergency: true,
    steps: [
      {
        instruction: "Call 911 immediately",
        detail: "Tell them you suspect a heart attack. Don't drive yourself.",
        simplifiedInstruction: "CALL 911. Say: heart attack.",
      },
      {
        instruction: "Have them chew one aspirin (325mg)",
        detail: "Chewing works faster than swallowing. Skip if allergic to aspirin.",
        simplifiedInstruction: "CHEW one aspirin. Not swallow — CHEW.",
        criticalWarning: "Skip if allergic to aspirin",
      },
      {
        instruction: "Help them sit in a comfortable position",
        detail: "Semi-upright with knees bent. Loosen tight clothing.",
        simplifiedInstruction: "Sit them up, knees bent. Loosen collar/belt.",
      },
      {
        instruction: "Keep them calm and still",
        detail: "No walking or exertion. Reassure them. Monitor breathing.",
        simplifiedInstruction: "Keep still. Stay calm. Help is coming.",
      },
      {
        instruction: "Be ready to perform CPR",
        detail: "If they become unresponsive and stop breathing, start CPR.",
        simplifiedInstruction: "They collapse? Start CPR immediately.",
      },
    ],
  },
  {
    id: "drowning",
    title: "Drowning",
    icon: "🌊",
    color: "critical",
    shortDesc: "Person pulled from water",
    callEmergency: true,
    steps: [
      {
        instruction: "Get them out of the water safely",
        detail: "Use a reaching aid if possible. Don't become a victim yourself.",
        simplifiedInstruction: "Get them out. Use a pole or rope. Be safe.",
        criticalWarning: "Don't jump in unless you're a trained swimmer",
      },
      {
        instruction: "Call 911",
        detail: "Even if they seem fine. Delayed drowning is real.",
        simplifiedInstruction: "CALL 911. Even if they look ok.",
      },
      {
        instruction: "Check if they're breathing",
        detail: "Look for chest movement. Listen for breath. Feel for air on your cheek.",
        simplifiedInstruction: "Are they breathing? Look. Listen. Feel.",
      },
      {
        instruction: "Not breathing? Start CPR with rescue breaths",
        detail: "Give 5 initial rescue breaths, then 30 compressions : 2 breaths.",
        simplifiedInstruction: "5 breaths first, then push chest 30 times, 2 breaths. Repeat.",
      },
      {
        instruction: "If breathing, place in recovery position",
        detail: "Roll on their side. Keep airway clear. Keep them warm.",
        simplifiedInstruction: "Breathing? Roll on side. Cover with blanket.",
      },
    ],
  },
];
