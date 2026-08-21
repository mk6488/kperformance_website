import { useState, useEffect, useRef, useCallback } from 'react';
import type { Assessment } from './types';
import { loadAssessment, saveAssessment } from './assessmentApi';
import { applyDerivedValues } from './calculations';

const AUTOSAVE_DELAY_MS = 1500;

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function useAssessment(assessmentId: string) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef<Assessment | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadAssessment(assessmentId).then(data => {
      if (!cancelled) {
        setAssessment(data);
        latestRef.current = data;
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [assessmentId]);

  const update = useCallback((updater: (prev: Assessment) => Assessment) => {
    setAssessment(prev => {
      if (!prev) return prev;
      const next = applyDerivedValues(updater(prev));
      latestRef.current = next;

      // Debounced autosave
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setSaveState('saving');
      saveTimer.current = setTimeout(async () => {
        const toSave = latestRef.current;
        if (!toSave) return;
        try {
          const { id, ...rest } = toSave;
          await saveAssessment(id, rest);
          setSaveState('saved');
          setTimeout(() => setSaveState('idle'), 2000);
        } catch {
          setSaveState('error');
        }
      }, AUTOSAVE_DELAY_MS);

      return next;
    });
  }, []);

  return { assessment, loading, saveState, update };
}
