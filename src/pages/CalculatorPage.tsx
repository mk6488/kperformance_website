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
    'src="logo-blue.png"',
    `src="${window.location.origin}/logo-blue.png"`
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

  function handleLogout() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
    setAuthed(false);
  }

  if (authed) {
    return (
      <div style={{ position: 'fixed', inset: 0 }}>
        <iframe
          srcDoc={srcDoc}
          title="K Performance Assessment Calculator"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        />
        <button
          onClick={handleLogout}
          style={{
            position: 'absolute',
            top: 14,
            right: 24,
            background: '#fff',
            color: '#334155',
            border: '1px solid #e2e8f0',
            borderRadius: 100,
            padding: '6px 16px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-offWhite flex flex-col">

      {/* Header — matches main site */}
      <header className="bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="flex items-center gap-3 px-6 py-2.5">
          <img src="/logo-blue.png" alt="K Performance" className="h-10 w-10 object-contain" />
          <span className="text-lg font-semibold tracking-tight text-brand-navy">K Performance</span>
          <div className="w-px h-5 bg-slate-200 mx-0.5" />
          <span className="text-sm font-semibold text-slate-500">Assessment Calculator</span>
        </div>
      </header>

      {/* Centred form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-5">

          <div className="space-y-1">
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-brand-blue">Internal Tool</p>
            <h1 className="text-2xl font-semibold text-brand-charcoal">Sign in</h1>
          </div>

          <div className="bg-white rounded-xl border border-[#e9eef5] shadow-sm p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[0.72rem] font-semibold text-slate-500 tracking-[0.02em]">
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[0.72rem] font-semibold text-slate-500 tracking-[0.02em]">
                  Password
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors"
                />
              </div>
              {error ? (
                <p className="text-sm text-red-600">{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-brand-navy text-white font-semibold py-2.5 text-sm hover:bg-brand-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                {submitting ? 'Checking…' : 'Sign in'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400">
            Session ends when you close this tab
          </p>

        </div>
      </div>

      {/* Footer — matches main site */}
      <footer className="bg-brand-slate">
        <div className="px-6 py-6">
          <p className="text-sm font-semibold text-white">K Performance</p>
          <p className="text-xs text-white/70 mt-1">Leigh Woods, Bristol — youth athlete assessment</p>
        </div>
      </footer>

    </div>
  );
}
