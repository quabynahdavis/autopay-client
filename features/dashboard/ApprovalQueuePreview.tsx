"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { SectionCard } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { approvalPreview } from "@/services/mock/payments";
import { formatCurrency } from "@/lib/utils";

export function ApprovalQueuePreview() {
  const { can } = useAuth();

  if (!can("admin.approval")) return null;

  return (
    <SectionCard
      title="Approval Queue"
      description="Batches awaiting finance review"
      action={
        <Button variant="outline" size="sm" asChild>
          <Link href="/approval">View all</Link>
        </Button>
      }
    >
      <div className="space-y-3">
        {approvalPreview.map((batch) => (
          <div
            key={batch.id}
            className="flex items-center justify-between rounded-xl border border-border p-4"
          >
            <div>
              <p className="text-sm font-medium">{batch.id}</p>
              <p className="text-xs text-muted-foreground">
                {batch.requestedBy} · {batch.recipientCount} recipients
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{formatCurrency(batch.amount)}</p>
              <Badge variant="warning" className="mt-1">
                Pending
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
