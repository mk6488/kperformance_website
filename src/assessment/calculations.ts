import type { Assessment, DerivedValue, DerivedStringValue } from './types';

function derived(value: number | null, unit: string): DerivedValue {
  return { value, unit, source: 'Derived', type: 'Derived' };
}

function derivedStr(value: string | null): DerivedStringValue {
  return { value, source: 'Derived', type: 'Derived' };
}

function best(...vals: (number | null | undefined)[]): number | null {
  const valid = vals.filter((v): v is number => v !== null && v !== undefined && !isNaN(v));
  return valid.length ? Math.max(...valid) : null;
}

function bestTime(...vals: (number | null | undefined)[]): number | null {
  const valid = vals.filter((v): v is number => v !== null && v !== undefined && !isNaN(v));
  return valid.length ? Math.min(...valid) : null;
}

function lsi(a: number | null, b: number | null): number | null {
  if (a === null || b === null || a <= 0 || b <= 0) return null;
  return (Math.min(a, b) / Math.max(a, b)) * 100;
}

// Exact formula from calculator.html, Mirwald et al. 2002
function mirwald(
  sex: string,
  age: number,
  height: number,
  sittingHeight: number,
  mass: number,
  legLen: number,
): number | null {
  if (sex === 'M') {
    return (
      -9.236 +
      0.0002708 * (legLen * sittingHeight) -
      0.001663 * (age * legLen) +
      0.007216 * (age * sittingHeight) +
      0.02292 * ((mass / height) * 100)
    );
  }
  if (sex === 'F') {
    return (
      -9.376 +
      0.0001882 * (legLen * sittingHeight) +
      0.0022 * (age * legLen) +
      0.005841 * (age * sittingHeight) -
      0.002658 * (age * mass) +
      0.07693 * ((mass / height) * 100)
    );
  }
  return null;
}

function phvStatus(offset: number | null): string | null {
  if (offset === null) return null;
  if (offset < -1) return 'pre-PHV';
  if (offset <= 1) return 'circa-PHV';
  return 'post-PHV';
}

// Decimal age in years from ISO date strings
export function calcDecimalAge(dob: string, sessionDate: string): number | null {
  if (!dob || !sessionDate) return null;
  const ms = new Date(sessionDate).getTime() - new Date(dob).getTime();
  if (isNaN(ms) || ms < 0) return null;
  return ms / (1000 * 60 * 60 * 24 * 365.25);
}

export function applyDerivedValues(a: Assessment): Assessment {
  const snap = a.athleteSnapshot;
  const anthr = a.anthropometrics;

  // Anthropometrics — derived chain
  const h = anthr.standingHeight.value;
  const sh = anthr.sittingHeight.value;
  const mass = anthr.bodyMass.value;
  const legLen = h !== null && sh !== null ? h - sh : null;
  const age = calcDecimalAge(snap.dob, a.sessionMeta.date);
  const offset =
    age !== null && h !== null && sh !== null && mass !== null && legLen !== null
      ? mirwald(snap.sex, age, h, sh, mass, legLen)
      : null;

  const newAnthr = {
    ...anthr,
    legLength: derived(legLen, 'cm'),
    decimalAge: derived(age, 'years'),
    maturityOffset: derived(offset, 'years'),
    phvStatus: derivedStr(phvStatus(offset)),
  };

  // Strength — LSI, %BM, ratios per test
  const str = a.strength;
  function strDerived(test: typeof str.hipAbduction) {
    const lb = test.left.best;
    const rb = test.right.best;
    return {
      ...test,
      lsi: derived(lsi(lb, rb), '%'),
      leftPctBM: derived(lb !== null && mass ? (lb / mass) * 100 : null, '%'),
      rightPctBM: derived(rb !== null && mass ? (rb / mass) * 100 : null, '%'),
    };
  }

  const abdL = str.hipAbduction.left.best;
  const abdR = str.hipAbduction.right.best;
  const addL = str.hipAdduction.left.best;
  const addR = str.hipAdduction.right.best;
  const flexL = str.kneeFlexion.left.best;
  const flexR = str.kneeFlexion.right.best;
  const extL = str.kneeExtension.left.best;
  const extR = str.kneeExtension.right.best;

  // Average both sides — matches calculator.html formula exactly
  const abdAvg = abdL !== null && abdR !== null ? (abdL + abdR) / 2 : null;
  const addAvg = addL !== null && addR !== null ? (addL + addR) / 2 : null;
  const flexAvg = flexL !== null && flexR !== null ? (flexL + flexR) / 2 : null;
  const extAvg = extL !== null && extR !== null ? (extL + extR) / 2 : null;

  const newStr = {
    ...str,
    hipAbduction: strDerived(str.hipAbduction),
    hipAdduction: strDerived(str.hipAdduction),
    kneeFlexion: strDerived(str.kneeFlexion),
    kneeExtension: strDerived(str.kneeExtension),
    anklePlantarflexion: strDerived(str.anklePlantarflexion),
    adductorAbductorRatio: derived(
      addAvg !== null && abdAvg ? addAvg / abdAvg : null,
      '',
    ),
    kneeFlexionExtensionRatio: derived(
      flexAvg !== null && extAvg ? flexAvg / extAvg : null,
      '',
    ),
  };

  // Power — best values and hop LSI
  const pw = a.power;
  const hopLBest = best(...pw.singleLegHopL.trials);
  const hopRBest = best(...pw.singleLegHopR.trials);

  const newPower = {
    ...pw,
    cmj: { ...pw.cmj, best: best(...pw.cmj.trials) },
    broadJump: { ...pw.broadJump, best: best(...pw.broadJump.trials) },
    singleLegHopL: { ...pw.singleLegHopL, best: hopLBest },
    singleLegHopR: { ...pw.singleLegHopR, best: hopRBest },
    hopLsi: derived(lsi(hopLBest, hopRBest), '%'),
    sprint0to10: {
      ...pw.sprint0to10,
      best: bestTime(...pw.sprint0to10.trials),
    },
    sprint10to20: {
      ...pw.sprint10to20,
      best: bestTime(...pw.sprint10to20.trials),
    },
    sprint20mTotal: {
      ...pw.sprint20mTotal,
      best: bestTime(...pw.sprint20mTotal.trials),
    },
  };

  // Endurance derived values — auto-calculated for Cooper and critical speed only.
  // Beep test VO2max requires a level-to-VO2max lookup and remains manually entered.
  const end = a.endurance;
  let newEnd = end;
  const rawResult = end.result?.value ?? null;

  if (end.protocol === 'cooper12min' && rawResult !== null) {
    newEnd = { ...end, derived: derived(cooperVo2max(rawResult), 'ml/kg/min') };
  }
  // criticalSpeed3min: not auto-calculated — pending protocol clarification on whether
  // the run sheet captures a final-segment distance (required for true CS) or total
  // distance only (which is mean speed, not the same construct). Enter manually for now.

  return { ...a, anthropometrics: newAnthr, strength: newStr, power: newPower, endurance: newEnd };
}

// Trial variance check — returns the % difference if > 10%, else null
export function trialVariance(t1: number | null, t2: number | null): number | null {
  if (t1 === null || t2 === null || t1 <= 0 || t2 <= 0) return null;
  const diff = (Math.abs(t1 - t2) / Math.max(t1, t2)) * 100;
  return diff > 10 ? diff : null;
}

// Cooper (1968): VO2max (ml/kg/min) from 12-minute run distance in metres
export function cooperVo2max(distanceM: number): number | null {
  if (distanceM <= 0) return null;
  const v = (distanceM - 504.9) / 44.73;
  return v > 0 ? Math.round(v * 10) / 10 : null;
}

// Critical speed (m/s) from 3-minute all-out distance in metres
export function criticalSpeed(distanceM: number): number | null {
  if (distanceM <= 0) return null;
  return Math.round((distanceM / 180) * 100) / 100;
}
