import { useState, useEffect, useRef, useCallback } from 'react';

const DURATION_S = 12 * 60;
const MAX_ACCURACY_M = 20;  // discard GPS fix if accuracy is worse than this
const MAX_SPEED_MS   = 8;   // discard GPS fix if implied speed exceeds 8 m/s (≈ 29 km/h)

type TimerState = 'idle' | 'running' | 'done' | 'gps_error';

interface GpsPoint { lat: number; lon: number; ts: number }

function haversineMetres(a: GpsPoint, b: GpsPoint): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const c =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLon * sinLon;
  return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

type Props = { onComplete: (metres: number) => void };

export default function CooperTimer({ onComplete }: Props) {
  const [state, setState] = useState<TimerState>('idle');
  const [secondsLeft, setSecondsLeft] = useState(DURATION_S);
  const [distanceM, setDistanceM] = useState(0);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string | null>(null);

  const watchId    = useRef<number | null>(null);
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPoint  = useRef<GpsPoint | null>(null);
  const accumulated = useRef(0);
  const wakeLock   = useRef<{ release(): Promise<void> } | null>(null);

  const stop = useCallback((finalDist: number) => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    if (intervalId.current !== null) clearInterval(intervalId.current);
    wakeLock.current?.release().catch(() => {});
    watchId.current    = null;
    intervalId.current = null;
    accumulated.current = finalDist;
    setState('done');
    setDistanceM(finalDist);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    if (intervalId.current !== null) clearInterval(intervalId.current);
    wakeLock.current?.release().catch(() => {});
  }, []);

  async function start() {
    if (!navigator.geolocation) {
      setGpsErrorMsg('Geolocation is not available on this device.');
      setState('gps_error');
      return;
    }

    // Acquire wake lock so screen stays on during the run
    try {
      // navigator.wakeLock is not yet in all TypeScript DOM libs — cast to any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      wakeLock.current = await (navigator as any).wakeLock?.request('screen');
    } catch {
      // Wake lock denied or unsupported — degrade gracefully, timer still works
    }

    accumulated.current = 0;
    lastPoint.current = null;
    setDistanceM(0);
    setSecondsLeft(DURATION_S);
    setState('running');

    // GPS watch
    watchId.current = navigator.geolocation.watchPosition(
      pos => {
        const { latitude: lat, longitude: lon, accuracy } = pos.coords;
        setGpsAccuracy(Math.round(accuracy));
        if (accuracy > MAX_ACCURACY_M) return; // noisy fix — skip

        const now: GpsPoint = { lat, lon, ts: pos.timestamp };
        const prev = lastPoint.current;
        if (prev) {
          const d = haversineMetres(prev, now);
          const dt = (now.ts - prev.ts) / 1000; // seconds
          if (dt > 0 && d / dt > MAX_SPEED_MS) return; // physically implausible — skip
          if (d > 0.5) { // ignore sub-half-metre jitter
            accumulated.current += d;
            setDistanceM(Math.round(accumulated.current));
          }
        }
        lastPoint.current = now;
      },
      err => {
        setGpsErrorMsg(err.message);
        setState('gps_error');
      },
      { enableHighAccuracy: true, maximumAge: 0 },
    );

    // Countdown
    const startTs = Date.now();
    intervalId.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTs) / 1000);
      const remaining = DURATION_S - elapsed;
      if (remaining <= 0) {
        clearInterval(intervalId.current!);
        intervalId.current = null;
        stop(accumulated.current);
      } else {
        setSecondsLeft(remaining);
      }
    }, 250); // 250ms tick for sub-second accuracy in display
  }

  function handleComplete() {
    onComplete(Math.round(distanceM));
  }

  if (state === 'idle') {
    return (
      <div className="bg-brand-charcoal rounded-xl p-6 space-y-4 text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Cooper 12-min timer</p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Athlete runs with the phone in their pocket. Distance is tracked via GPS automatically for 12 minutes.
        </p>
        <button
          onClick={start}
          className="w-full bg-brand-green text-white font-bold text-lg py-5 rounded-full min-h-[64px] hover:opacity-90 transition-opacity"
        >
          ▶ Start 12-min timer
        </button>
      </div>
    );
  }

  if (state === 'gps_error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
        <p className="font-semibold text-red-700 text-sm">GPS unavailable</p>
        <p className="text-xs text-red-600">{gpsErrorMsg ?? 'Location permission denied.'}</p>
        <p className="text-xs text-red-600">Enter the distance manually below after the run.</p>
        <button onClick={() => setState('idle')} className="text-xs text-red-700 underline">Try again</button>
      </div>
    );
  }

  if (state === 'running') {
    return (
      <div className="bg-brand-charcoal rounded-xl p-6 space-y-6">
        <div className="text-center space-y-1">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Remaining</p>
          <p className="text-6xl font-bold text-white font-mono tracking-tight">{fmtTime(secondsLeft)}</p>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Distance</p>
          <p className="text-5xl font-bold text-brand-green font-mono">{distanceM} m</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">
            GPS {gpsAccuracy !== null ? `±${gpsAccuracy} m` : 'acquiring…'}
          </p>
        </div>
        <button
          onClick={() => stop(accumulated.current)}
          className="w-full border border-slate-600 text-slate-400 text-sm font-semibold py-3 rounded-full min-h-[48px] hover:border-slate-400 transition-colors"
        >
          Finish early
        </button>
      </div>
    );
  }

  // done
  return (
    <div className="bg-brand-charcoal rounded-xl p-6 space-y-5 text-center">
      <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Complete</p>
      <p className="text-6xl font-bold text-brand-green font-mono">{distanceM} m</p>
      <p className="text-sm text-slate-400">GPS distance — recorded automatically</p>
      <div className="flex gap-3">
        <button
          onClick={() => { setDistanceM(0); setSecondsLeft(DURATION_S); setState('idle'); }}
          className="flex-1 border border-slate-600 text-slate-400 text-sm font-semibold py-3 rounded-full min-h-[48px] hover:border-slate-400 transition-colors"
        >
          Redo
        </button>
        <button
          onClick={handleComplete}
          className="flex-1 bg-brand-green text-white font-bold text-sm py-3 rounded-full min-h-[48px] hover:opacity-90 transition-opacity"
        >
          Record {distanceM} m
        </button>
      </div>
    </div>
  );
}
