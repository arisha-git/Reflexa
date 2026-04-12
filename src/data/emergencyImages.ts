// Emergency step visual aids - maps scenario+step to illustration images
import chokingHeimlich from "@/assets/emergency/choking-heimlich.jpg";
import bleedingPressure from "@/assets/emergency/bleeding-pressure.jpg";
import cprCompressions from "@/assets/emergency/cpr-compressions.jpg";
import rescueBreathing from "@/assets/emergency/rescue-breathing.jpg";
import burnsCooling from "@/assets/emergency/burns-cooling.jpg";
import seizureProtect from "@/assets/emergency/seizure-protect.jpg";
import epipenInjection from "@/assets/emergency/epipen-injection.jpg";
import heartAttackPosition from "@/assets/emergency/heart-attack-position.jpg";
import recoveryPosition from "@/assets/emergency/recovery-position.jpg";
import drowningRescue from "@/assets/emergency/drowning-rescue.jpg";

// Maps scenario ID → step index → image
export const stepImages: Record<string, Record<number, string>> = {
  choking: {
    0: chokingHeimlich,
    2: chokingHeimlich,
    4: cprCompressions,
  },
  bleeding: {
    0: bleedingPressure,
    1: bleedingPressure,
  },
  cpr: {
    2: cprCompressions,
    3: cprCompressions,
    4: rescueBreathing,
  },
  burns: {
    0: burnsCooling,
  },
  seizure: {
    0: seizureProtect,
    3: recoveryPosition,
  },
  allergic: {
    1: epipenInjection,
    3: epipenInjection,
  },
  heartattack: {
    2: heartAttackPosition,
    4: cprCompressions,
  },
  drowning: {
    0: drowningRescue,
    3: cprCompressions,
    4: recoveryPosition,
  },
};
