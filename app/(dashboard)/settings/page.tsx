"use client";

import { useAuth } from "@/contexts/AuthContext";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { getRoleLabel } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { fetchCompanyProfile } from "@/services/api/settings";
import { useApiData } from "@/hooks/useApiData";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { data: company, loading } = useApiData(fetchCompanyProfile, []);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader title="Company" description="Your business on MassPay" />
      
      {loading ? (
        <Skeleton className="h-48 w-full rounded-xl" />
      ) : (
        <SectionCard title={company?.name ?? user?.companyName ?? "Company"}>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Company code</dt>
              <dd className="mt-1 text-lg font-bold text-primary">{company?.code ?? "—"}</dd>
              <p className="mt-1 text-xs text-muted-foreground">
                Give this to employees when they register.
              </p>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="mt-1 font-medium">{company?.phone ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="mt-1 font-medium">{company?.email ?? "—"}</dd>
            </div>
          </dl>
        </SectionCard>
      )}

      <SectionCard title="Your account">
        <p className="text-sm font-medium">{user?.name}</p>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
        <Badge variant="outline" className="mt-2">
          {user ? getRoleLabel(user.role) : ""}
        </Badge>
        <Button variant="outline" className="mt-4 w-full" onClick={logout}>
          Sign out
        </Button>
      </SectionCard>
    </div>
  );
}
