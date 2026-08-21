import { ReactNode } from 'react';
import { useAuthUser, useIsAdmin } from '../lib/adminAuth';

export default function AssessmentRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthUser();
  const { isAdmin, loading: adminLoading } = useIsAdmin(user?.uid);

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-brand-offWhite flex items-center justify-center">
        <p className="text-brand-slate text-sm">Checking access…</p>
      </div>
    );
  }

  if (!user) {
    window.location.replace(`/admin/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-brand-offWhite flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-[#e9eef5] shadow-sm p-6 max-w-sm w-full space-y-3">
          <p className="font-semibold text-brand-charcoal">Access denied</p>
          <p className="text-sm text-brand-slate">This account doesn't have assessment access.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
