"use client";

import { toast } from "sonner";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { SettingsLayout } from "@/features/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const notifications = [
  { id: "batch_approved", label: "Batch approved", description: "When a batch you submitted is approved" },
  { id: "batch_rejected", label: "Batch rejected", description: "When a batch you submitted is rejected" },
  { id: "payment_failed", label: "Payment failed", description: "When an individual payment fails" },
  { id: "approval_required", label: "Approval required", description: "When a batch needs your approval" },
  { id: "weekly_summary", label: "Weekly summary", description: "Weekly payment activity digest" },
];

export default function NotificationsSettingsPage() {
  return (
    <SettingsLayout>
      <PageHeader
        title="Notifications"
        description="Configure how you receive alerts"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Settings", href: "/settings" },
          { label: "Notifications" },
        ]}
      />
      <SectionCard title="Email Notifications">
        <div className="space-y-6">
          {notifications.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4">
              <div>
                <Label htmlFor={item.id} className="text-sm font-medium">
                  {item.label}
                </Label>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <input
                id={item.id}
                type="checkbox"
                defaultChecked
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-ring"
              />
            </div>
          ))}
        </div>
        <Button className="mt-6" onClick={() => toast.success("Notification preferences saved")}>
          Save preferences
        </Button>
      </SectionCard>
    </SettingsLayout>
  );
}
