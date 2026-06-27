"use client";

import { useAuth } from "@/contexts/AuthContext";
import { fetchNotifications } from "@/services/api/employees";
import { useApiData } from "@/hooks/useApiData";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

const paymentNotificationTypes = [
  "salary_paid",
  "payment_failed",
  "profile_updated",
  "announcement",
  "system",
];

export default function EmployeeNotificationsPage() {
  const { user } = useAuth();
  const employeeId = user?.employeeId ?? "";
  const { data: notifications, loading } = useApiData(
    () => fetchNotifications(employeeId),
    [employeeId]
  );

  const filtered = (notifications ?? []).filter((n) =>
    paymentNotificationTypes.includes(n.type)
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Notifications" description="Payment and payout updates" />

      <SectionCard title="All Notifications">
        {loading ? (
          <Skeleton className="h-48 w-full rounded-xl" />
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((n) => (
              <li
                key={n.id}
                className={`flex gap-4 py-4 first:pt-0 last:pb-0 ${!n.read ? "bg-primary/5 -mx-6 px-6 rounded-lg" : ""}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    {!n.read && <Badge variant="default">New</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{formatDate(n.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
