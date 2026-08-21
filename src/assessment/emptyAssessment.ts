import type {
  Assessment,
  AthleteSnapshot,
  BilateralStrengthTest,
  DerivedValue,
  DerivedStringValue,
  MeasuredValue,
  ObservationValue,
  PerformanceTest,
  RedFlagItem,
  StrengthSide,
} from './types';

function emptyMeasured(unit: string): MeasuredValue {
  return { value: null, unit, source: 'Manual', type: 'Measurement' };
}

function emptyDerived(unit: string): DerivedValue {
  return { value: null, unit, source: 'Derived', type: 'Derived' };
}

function emptyDerivedStr(): DerivedStringValue {
  return { value: null, source: 'Derived', type: 'Derived' };
}

function emptyObservation(): ObservationValue {
  return { value: null, source: 'Manual', type: 'Observation' };
}

function emptyRedFlag(): RedFlagItem {
  return { result: 'pass', notes: null, source: 'Manual', type: 'Observation' };
}

function emptyStrengthSide(): StrengthSide {
  return { trials: [], best: null, unit: 'N', source: 'ActivForce', type: 'Measurement' };
}

function emptyBilateral(): BilateralStrengthTest {
  return {
    left: emptyStrengthSide(),
    right: emptyStrengthSide(),
    lsi: emptyDerived('%'),
    leftPctBM: emptyDerived('%'),
    rightPctBM: emptyDerived('%'),
  };
}

function emptyPerf(unit: string): PerformanceTest {
  return { trials: [], best: null, unit, source: 'MyJumpLab', type: 'Measurement' };
}

export function emptyAthleteSnapshot(): AthleteSnapshot {
  return {
    name: '',
    dob: '',
    sex: 'M',
    sport: '',
    trainingDaysPerWeek: null,
    trainingMinsPerSession: null,
    yearsInSport: null,
    otherSports: null,
    hasStrengthCoach: null,
    strengthCoachName: null,
  };
}

export function emptyAssessment(now: string): Assessment {
  return {
    id: '',
    athleteId: '',
    status: 'draft',
    createdAt: now,
    updatedAt: now,

    sessionMeta: {
      date: now.slice(0, 10),
      assessor: '',
      parentGuardianPresent: false,
      conditions: {
        surface: '',
        wetDry: 'dry',
        wind: 'calm',
        tempC: null,
      },
    },

    athleteSnapshot: emptyAthleteSnapshot(),

    screening: {
      consentFormSigned: false,
      parqCompleted: false,
      injuryHistory: null,
      athleteGoals: null,
      parentGoals: null,
      assessorComments: null,
    },

    redFlagScreen: {
      passiveHipIR_left: emptyRedFlag(),
      passiveHipIR_right: emptyRedFlag(),
      systemicFlags: emptyRedFlag(),
      anyRedFlag: false,
      assessorComments: null,
    },

    anthropometrics: {
      standingHeight: emptyMeasured('cm'),
      sittingHeight: emptyMeasured('cm'),
      bodyMass: emptyMeasured('kg'),
      legLength: emptyDerived('cm'),
      decimalAge: emptyDerived('years'),
      maturityOffset: emptyDerived('years'),
      phvStatus: emptyDerivedStr(),
    },

    movementRange: {
      kneeToWallL: emptyMeasured('cm'),
      kneeToWallR: emptyMeasured('cm'),
      singleLegBalanceL: emptyMeasured('s'),
      singleLegBalanceR: emptyMeasured('s'),
      overheadSquat: {
        depth: emptyObservation(),
        heelLift: emptyObservation(),
        kneePosition: emptyObservation(),
        trunk: emptyObservation(),
        notes: emptyObservation(),
      },
      assessorComments: null,
    },

    strength: {
      hipAbduction: emptyBilateral(),
      hipAdduction: emptyBilateral(),
      kneeFlexion: emptyBilateral(),
      kneeExtension: emptyBilateral(),
      anklePlantarflexion: emptyBilateral(),
      adductorAbductorRatio: emptyDerived(''),
      kneeFlexionExtensionRatio: emptyDerived(''),
      assessorComments: null,
    },

    power: {
      cmj: emptyPerf('cm'),
      broadJump: emptyPerf('cm'),
      singleLegHopL: emptyPerf('cm'),
      singleLegHopR: emptyPerf('cm'),
      hopLsi: emptyDerived('%'),
      sprint0to10: emptyPerf('s'),
      sprint10to20: emptyPerf('s'),
      sprint20mTotal: emptyPerf('s'),
      sprintNotes: null,
      assessorComments: null,
    },

    endurance: {
      protocol: null,
      result: null,
      derived: null,
      assessorComments: null,
    },

    debrief: {
      retestDate: null,
      packageSold: null,
      strengths: [],
      priorityMeasures: [],
    },
  };
}
