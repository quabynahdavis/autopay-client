"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getEmployeeNotifications } from "@/services/mock/employees";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
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
  const employeeId = user?.employeeId ?? "EMP-1042";
  const notifications = getEmployeeNotifications(employeeId).filter((n) =>
    paymentNotificationTypes.includes(n.type)
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Notifications" description="Payment and payout updates" />

      <SectionCard title="All Notifications">
        <ul className="divide-y divide-border">
          {notifications.map((n) => (
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
      </SectionCard>
    </div>
  );
}
