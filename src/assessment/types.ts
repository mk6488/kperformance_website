export type MeasurementSource = 'ActivForce' | 'MyJumpLab' | 'Manual' | 'GPS' | 'Derived';
export type FieldType = 'Measurement' | 'Observation' | 'Derived';
export type SessionStatus = 'draft' | 'complete' | 'partialRedFlag';
export type Sex = 'M' | 'F' | 'Other';
export type WindCondition = 'calm' | 'light' | 'moderate' | 'strong';
export type AerobicProtocol = 'beepTest' | 'cooper12min' | 'criticalSpeed3min';

// --- Primitive value wrappers ---

// Audit trail written when a previously-saved value is corrected.
// The corrected value replaces the original in the parent field; this record captures
// the before/after for traceability. See 20_data_governance_and_retention.md.
export interface CorrectionRecord {
  originalValue: number | string | null;
  correctedValue: number | string | null;
  correctedBy: string;
  correctedAt: string; // ISO timestamp
  reason: string;
}

export interface MeasuredValue {
  value: number | null;
  unit: string;
  source: Exclude<MeasurementSource, 'Derived'>;
  type: 'Measurement';
  correction?: CorrectionRecord;
}

export interface DerivedValue {
  value: number | null;
  unit: string;
  source: 'Derived';
  type: 'Derived';
}

// For derived fields whose output is categorical, not numeric (e.g. PHV status)
export interface DerivedStringValue {
  value: string | null;
  source: 'Derived';
  type: 'Derived';
}

export interface ObservationValue {
  value: string | null;
  source: 'Manual';
  type: 'Observation';
  correction?: CorrectionRecord;
}

// --- Compound measurement shapes ---

export interface StrengthSide {
  // Up to 3 trials in Newtons. Third trial prompted automatically when
  // |t1 - t2| / max(t1, t2) > 10% — enforced by the UI, stored here as-is.
  trials: number[];
  best: number | null;
  unit: 'N';
  source: 'ActivForce';
  type: 'Measurement';
  correction?: CorrectionRecord;
}

export interface BilateralStrengthTest {
  left: StrengthSide;
  right: StrengthSide;
  lsi: DerivedValue;        // (weaker / stronger) × 100, unit '%'; flag < 90
  leftPctBM: DerivedValue;  // (left.best / bodyMass) × 100, unit '%'
  rightPctBM: DerivedValue;
}

// All jump and sprint tests come from My Jump Lab (entered manually after the external app).
export interface PerformanceTest {
  trials: number[];
  best: number | null;
  unit: string;   // 'cm' for jumps, 's' for sprints
  source: 'MyJumpLab';
  type: 'Measurement';
  correction?: CorrectionRecord;
}

export interface RedFlagItem {
  result: 'pass' | 'concern';
  notes: string | null;
  source: 'Manual';
  type: 'Observation';
  correction?: CorrectionRecord;
}

// --- Athlete profile (stable identity only) ---

export interface Athlete {
  id: string;
  name: string;
  dob: string;       // ISO date "YYYY-MM-DD"
  sex: Sex;
  primarySport: string;
  createdAt: string; // ISO timestamp
  updatedAt: string;
}

// --- Assessment document sections ---

export interface SessionMeta {
  date: string; // ISO date "YYYY-MM-DD"
  assessor: string;
  parentGuardianPresent: boolean;
  conditions: {
    surface: string;
    wetDry: 'dry' | 'wet';
    wind: WindCondition;
    tempC: number | null;
  };
}

// Athlete data captured at session time — denormalized so that historical reports
// remain accurate even if the athlete profile is later updated.
export interface AthleteSnapshot {
  name: string;
  dob: string;
  sex: Sex;
  sport: string;
  trainingDaysPerWeek: number | null;
  trainingMinsPerSession: number | null;
  yearsInSport: number | null;
  otherSports: string | null;
  hasStrengthCoach: boolean | null;
  strengthCoachName: string | null;
}

export interface Screening {
  consentFormSigned: boolean;
  parqCompleted: boolean;
  injuryHistory: string | null;
  athleteGoals: string | null;
  parentGoals: string | null;
  assessorComments: string | null;
}

export interface RedFlagScreen {
  passiveHipIR_left: RedFlagItem;
  passiveHipIR_right: RedFlagItem;
  systemicFlags: RedFlagItem; // night pain, rest pain, unexplained weight loss, unexplained limp
  anyRedFlag: boolean;        // if true, session status becomes 'partialRedFlag'
  assessorComments: string | null;
}

export interface Anthropometrics {
  standingHeight: MeasuredValue;  // unit: 'cm', source: 'Manual'
  sittingHeight: MeasuredValue;   // unit: 'cm', source: 'Manual'
  bodyMass: MeasuredValue;        // unit: 'kg', source: 'Manual'
  legLength: DerivedValue;        // standingHeight - sittingHeight, unit: 'cm'
  decimalAge: DerivedValue;       // (sessionDate − dob) in decimal years, unit: 'years'
  maturityOffset: DerivedValue;   // Mirwald formula, unit: 'years'
  phvStatus: DerivedStringValue;  // 'pre-PHV' | 'circa-PHV' | 'post-PHV' from maturityOffset
}

export interface OverheadSquatObservation {
  depth: ObservationValue;
  heelLift: ObservationValue;
  kneePosition: ObservationValue;
  trunk: ObservationValue;
  notes: ObservationValue;
}

export interface MovementRange {
  kneeToWallL: MeasuredValue;      // unit: 'cm' or '°' (inclinometer), source: 'Manual'
  kneeToWallR: MeasuredValue;
  singleLegBalanceL: MeasuredValue; // unit: 's', max 30, source: 'Manual'
  singleLegBalanceR: MeasuredValue;
  overheadSquat: OverheadSquatObservation;
  assessorComments: string | null;
}

export interface Strength {
  hipAbduction: BilateralStrengthTest;
  hipAdduction: BilateralStrengthTest;
  kneeFlexion: BilateralStrengthTest;
  kneeExtension: BilateralStrengthTest;
  anklePlantarflexion: BilateralStrengthTest;
  adductorAbductorRatio: DerivedValue;
  kneeFlexionExtensionRatio: DerivedValue;
  assessorComments: string | null;
}

export interface Power {
  cmj: PerformanceTest;           // countermovement jump, unit: 'cm'
  broadJump: PerformanceTest;     // unit: 'cm'
  singleLegHopL: PerformanceTest; // unit: 'cm'
  singleLegHopR: PerformanceTest; // unit: 'cm'
  hopLsi: DerivedValue;           // (weaker / stronger) × 100, unit: '%'
  sprint0to10: PerformanceTest;   // unit: 's'
  sprint10to20: PerformanceTest;  // unit: 's'
  // Stored as captured — run sheet treats 20m total as its own row with its own trials.
  // Verifiable as sum of 0-10 + 10-20 best from the same effort.
  sprint20mTotal: PerformanceTest;
  sprintNotes: string | null;     // e.g. "only 20m total captured, no split data available"
  assessorComments: string | null;
}

export interface Endurance {
  // Chosen once per athlete; never changed between test and retest.
  protocol: AerobicProtocol | null;
  // Unit varies by protocol: 'm' for Cooper/criticalSpeed, 'level.shuttle' string for beep test
  result: MeasuredValue | null;
  // VO2max estimate (Cooper); level-to-VO2max lookup (beep); critical speed m/s (3-min)
  derived: DerivedValue | null;
  assessorComments: string | null;
}

export interface Debrief {
  retestDate: string | null; // ISO date; booked in the room before the athlete leaves
  packageSold: boolean | null;
  // Two genuine strengths named specifically — run sheet: "two genuine strengths, named specifically"
  strengths: string[];
  // Field-path keys of measures flagged as top-3 priorities (circled on the run sheet).
  // Must be retested regardless of the standard battery. e.g. ['hipAbductionLsi', 'cmjBest']
  priorityMeasures: string[];
}

// --- Session type and retest-specific sections ---

export type SessionType = 'initial' | 'retest';

export interface RetestUpdate {
  weeksSinceInitial: number | null;
  injuriesSince: string | null;
  illnessTimeOff: string | null;
  trainingAdherence: string | null;
  growthChange: string | null;
  conditionsMatchInitial: boolean;
  conditionsMismatchNote: string | null;
}

export interface RetestPriorityCaptureItem {
  label: string;
  outOfBattery: boolean;
  observation: ObservationValue | null;
}

export interface RetestDiscussion {
  improvements: string[];
  stillNeedsWork: string[];
  nextBlock: string | null;
  nextRetestDate: string | null;
}

// --- Top-level assessment document ---

export interface Assessment {
  id: string;
  athleteId: string;
  status: SessionStatus;
  sessionType: SessionType;
  previousAssessmentId: string | null;
  createdAt: string; // ISO timestamp
  updatedAt: string;
  sessionMeta: SessionMeta;
  athleteSnapshot: AthleteSnapshot;
  screening: Screening;
  redFlagScreen: RedFlagScreen;
  anthropometrics: Anthropometrics;
  movementRange: MovementRange;
  strength: Strength;
  power: Power;
  endurance: Endurance;
  debrief: Debrief;
  retestUpdate: RetestUpdate | null;
  retestPriorityCapture: RetestPriorityCaptureItem[] | null;
  retestDiscussion: RetestDiscussion | null;
}
