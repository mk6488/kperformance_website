import { useState, FormEvent } from 'react';
import calculatorHtml from '../assets/calculator.html?raw';

// SHA-256 of "email:password" — credentials stored as hash only, never plain text
const CRED_HASH = 'ea153c993b8836a350c40d7afa9be1dcbc6fd4b6bf16a81faaa5fcfd1259295e';
const SESSION_KEY = 'kp_calc_v1';

async function verifyCredentials(email: string, password: string): Promise<boolean> {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${email}:${password}`)
  );
  const hex = Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return hex === CRED_HASH;
}

function isAuthed(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export default function CalculatorPage() {
  const [authed, setAuthed] = useState<boolean>(isAuthed);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Replace the relative logo reference with an absolute path the iframe can resolve
  const srcDoc = calculatorHtml.replace(
    'src="logo-white.png"',
    `src="${window.location.origin}/calculator-logo.png"`
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const ok = await verifyCredentials(email.trim().toLowerCase(), password);
      if (ok) {
        sessionStorage.setItem(SESSION_KEY, '1');
        setAuthed(true);
      } else {
        setError('Incorrect email or password.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (authed) {
    return (
      <div style={{ position: 'fixed', inset: 0 }}>
        <iframe
          srcDoc={srcDoc}
          title="K Performance Assessment Calculator"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-offWhite flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">

        <div className="text-center space-y-3">
          <img
            src="/calculator-logo.png"
            alt="K Performance"
            className="h-12 w-auto mx-auto rounded-md"
          />
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">
              K Performance
            </p>
            <h1 className="text-xl font-bold text-brand-charcoal mt-0.5">
              Assessment Calculator
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue transition-colors"
              />
            </div>
            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-brand-navy text-white font-semibold py-2.5 text-sm hover:bg-brand-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Checking…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          Internal tool · session ends when you close this tab
        </p>

      </div>
    </div>
  );
}
