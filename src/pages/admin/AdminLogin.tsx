import { FormEvent, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Section } from '../../components/ui/Section';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { adminSignIn, useAuthUser, useIsAdmin } from '../../lib/adminAuth';

export default function AdminLogin() {
  const { user, loading } = useAuthUser();
  const { isAdmin, loading: adminLoading } = useIsAdmin(user?.uid);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !adminLoading && user && isAdmin) {
    window.location.replace('/admin');
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await adminSignIn(email, password);
      window.location.replace('/admin');
    } catch (err: any) {
      setError(err?.message || 'Unable to sign in. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section id="admin-login" variant="muted">
      <div className="max-w-md mx-auto space-y-6">
        <SectionHeading
          title="Admin sign-in"
          subtitle="Email and password required. Only approved admin accounts are allowed."
          align="left"
        />
        <Card className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-800">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-800">Password</label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </Card>
      </div>
    </Section>
  );
}
