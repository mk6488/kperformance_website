import { useEffect, useMemo, useRef, useState } from 'react';
import { IntakeValues, defaultIntakeValues } from './types';

const STORAGE_KEY = 'kperformance-intake-draft-v2';
const SAVE_DELAY_MS = 400;

function isDefault(values: IntakeValues) {
  return JSON.stringify(values) === JSON.stringify(defaultIntakeValues);
}

function readDraft(): { values: IntakeValues; updatedAt: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.values) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeDraft(values: IntakeValues) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ values, updatedAt: Date.now() }),
    );
  } catch {
    // fail silently
  }
}

function removeDraft() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function useIntakeDraft(values: IntakeValues) {
  const [restoreAvailable, setRestoreAvailable] = useState<boolean>(() => !!readDraft());
  const timeoutRef = useRef<number | null>(null);

  // Debounced autosave
  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      if (isDefault(values)) return;
      writeDraft(values);
      setRestoreAvailable(true);
    }, SAVE_DELAY_MS);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [values]);

  const restoreDraft = () => {
    const draft = readDraft();
    if (!draft) return null;
    return draft.values as IntakeValues;
  };

  const clearDraft = () => {
    removeDraft();
    setRestoreAvailable(false);
  };

  return useMemo(
    () => ({
      restoreAvailable,
      restoreDraft,
      clearDraft,
    }),
    [restoreAvailable],
  );
}

export default useIntakeDraft;

