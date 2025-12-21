import { ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { useAuthUser, useIsAdmin, adminSignOut } from '../../lib/adminAuth';

type Props = {
  children: ReactNode;
};

export default function AdminRoute({ children }: Props) {
  const { user, loading } = useAuthUser();
  const { isAdmin, loading: adminLoading } = useIsAdmin(user?.uid);

  if (loading || adminLoading) {
    return (
      <Section variant="muted">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <Card>
            <p className="text-slate-700">Checking access…</p>
          </Card>
        </div>
      </Section>
    );
  }

  if (!user) {
    window.location.replace('/admin/login');
    return null;
  }

  if (!isAdmin) {
    return (
      <Section variant="muted">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <Card className="space-y-3">
            <p className="text-slate-800 font-semibold">Access denied</p>
            <p className="text-sm text-slate-700">You do not have admin access for this account.</p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                adminSignOut().finally(() => window.location.replace('/admin/login'));
              }}
            >
              Sign out
            </Button>
          </Card>
        </div>
      </Section>
    );
  }

  return <>{children}</>;
}
