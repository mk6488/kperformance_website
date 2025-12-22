export type IntakeStepId = 'about' | 'problem' | 'medical' | 'lifestyle' | 'consent';

export type IntakeStep = {
  id: IntakeStepId;
  title: string;
  shortLabel: string;
};

export type IntakeValues = {
  client: {
    fullName: string;
    dob: string;
    email: string;
    phone: string;
    under18: boolean;
    guardian: {
      fullName: string;
      email: string;
      phone: string;
      relationship: string;
    };
  };
  problem: {
    mainConcern: string;
    onset: string;
    locationText: string;
    painNow: number | null;
    aggravators: string;
    easers: string;
    goals: string;
  };
  medical: {
    conditions: string;
    surgeries: string;
    medications: string;
    allergies: string;
    checkboxes: Record<string, boolean>;
    redFlags: string[];
  };
  lifestyle: {
    activity: string;
    weeklyLoad: string;
    sleepHours: string;
    stressScore: number | null;
  };
  bodyMap: {
    markers: Array<{
      view: 'front' | 'back' | 'left' | 'right';
      x: number;
      y: number;
    }>;
  };
  consent: {
    healthDataConsent: boolean;
    contactPrefs: {
      email: boolean;
      sms: boolean;
      phone: boolean;
    };
    confirmTruthful: boolean;
    aiDraftConsent: boolean;
  };
  meta: {
    formVersion: 'intake-v2';
  };
};

export const defaultIntakeValues: IntakeValues = {
  client: {
    fullName: '',
    dob: '',
    email: '',
    phone: '',
    under18: false,
    guardian: {
      fullName: '',
      email: '',
      phone: '',
      relationship: '',
    },
  },
  problem: {
    mainConcern: '',
    onset: '',
    locationText: '',
    painNow: null,
    aggravators: '',
    easers: '',
    goals: '',
  },
  medical: {
    conditions: '',
    surgeries: '',
    medications: '',
    allergies: '',
    checkboxes: {},
    redFlags: [],
  },
  lifestyle: {
    activity: '',
    weeklyLoad: '',
    sleepHours: '',
    stressScore: null,
  },
  bodyMap: {
    markers: [],
  },
  consent: {
    healthDataConsent: false,
    contactPrefs: {
      email: false,
      sms: false,
      phone: false,
    },
    confirmTruthful: false,
    aiDraftConsent: false,
  },
  meta: {
    formVersion: 'intake-v2',
  },
};

