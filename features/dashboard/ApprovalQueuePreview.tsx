"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { SectionCard } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApprovalPreview } from "@/services/api/payments";
import { useApiData } from "@/hooks/useApiData";
import { formatCurrency } from "@/lib/utils";

export function ApprovalQueuePreview() {
  const { can } = useAuth();
  const { data: batches, loading } = useApiData(fetchApprovalPreview, []);

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
        {loading && <Skeleton className="h-20 rounded-xl" />}
        {!loading &&
          (batches ?? []).map((batch) => (
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
        {!loading && (batches ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">No batches awaiting approval.</p>
        )}
      </div>
    </SectionCard>
  );
}
