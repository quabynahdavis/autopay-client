"use client";

import { useState } from "react";
import type { Batch } from "@/types/payment";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { ApprovalModal } from "@/features/approval/ApprovalModal";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchApprovals,
  fetchPendingBatches,
  approveRequest,
  rejectRequest,
} from "@/services/api/payments";
import { useApiData } from "@/hooks/useApiData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const paymentRequestTypes = ["bank_change", "momo_change", "batch"];

export default function ApprovalQueuePage() {
  return (
    <RequireAuth portal="admin" permission="admin.approval">
      <ApprovalQueueContent />
    </RequireAuth>
  );
}

function ApprovalQueueContent() {
  const {
    data: pendingBatches,
    loading: batchesLoading,
    refetch: refetchBatches,
  } = useApiData(fetchPendingBatches, []);
  const {
    data: approvalRequests,
    loading: requestsLoading,
    refetch: refetchRequests,
  } = useApiData(() => fetchApprovals("pending"), []);

  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [modalMode, setModalMode] = useState<"approve" | "reject" | "view">("view");
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (batch: Batch, mode: "approve" | "reject" | "view") => {
    setSelectedBatch(batch);
    setModalMode(mode);
    setModalOpen(true);
  };

  const paymentApprovalRequests = (approvalRequests ?? []).filter((r) =>
    paymentRequestTypes.includes(r.type)
  );
  const pendingPaymentChanges = paymentApprovalRequests.filter((r) => r.status === "pending");

  const handleRequestAction = async (id: string, action: "approve" | "reject") => {
    try {
      if (action === "approve") await approveRequest(id);
      else await rejectRequest(id);
      toast.success(`Payout change ${action === "approve" ? "approved" : "rejected"}`);
      await refetchRequests();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        title="Payment Approvals"
        description="Review and approve payment batches and payout detail changes"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Approvals" },
        ]}
      />

      <SectionCard
        title="Pending Payment Batches"
        description={`${pendingBatches?.length ?? 0} batches awaiting approval`}
      >
        {batchesLoading ? (
          <Skeleton className="h-48 w-full rounded-xl" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(pendingBatches ?? []).map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.id}</TableCell>
                    <TableCell>{batch.name}</TableCell>
                    <TableCell>{batch.requestedBy}</TableCell>
                    <TableCell>{formatDate(batch.createdAt)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(batch.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{batch.recipientCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openModal(batch, "view")}>
                          View
                        </Button>
                        <Button size="sm" onClick={() => openModal(batch, "approve")}>
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => openModal(batch, "reject")}>
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Payout Detail Changes"
        description={`${pendingPaymentChanges.length} bank/MoMo changes pending verification`}
      >
        {requestsLoading ? (
          <Skeleton className="h-48 w-full rounded-xl" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentApprovalRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {req.type === "bank_change" ? "Bank Change" : "MoMo Change"}
                    </Badge>
                  </TableCell>
                  <TableCell>{req.requestedBy}</TableCell>
                  <TableCell>{req.employeeId ?? "—"}</TableCell>
                  <TableCell>{formatDate(req.date)}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {req.details}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {req.status === "pending" ? (
                        <>
                          <Button size="sm" onClick={() => handleRequestAction(req.id, "approve")}>
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRequestAction(req.id, "reject")}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Badge variant="success">{req.status}</Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      <ApprovalModal
        batch={selectedBatch}
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        onComplete={refetchBatches}
      />
    </div>
  );
}
