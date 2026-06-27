"use client";

import { useState } from "react";
import type { Batch } from "@/types/payment";
import { formatCurrency, formatDate } from "@/lib/utils";
import { batchStatusLabels } from "@/constants/status";
import { approveBatch, rejectBatch } from "@/services/api/payments";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ApprovalModalProps {
  batch: Batch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "approve" | "reject" | "view";
  onComplete?: () => void;
}

export function ApprovalModal({
  batch,
  open,
  onOpenChange,
  mode,
  onComplete,
}: ApprovalModalProps) {
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!batch) return null;

  const handleAction = async (action: "approve" | "reject") => {
    setSubmitting(true);
    try {
      if (action === "approve") await approveBatch(batch.id, notes || undefined);
      else await rejectBatch(batch.id, notes || undefined);
      toast.success(
        action === "approve"
          ? `Batch ${batch.id} approved successfully`
          : `Batch ${batch.id} rejected`
      );
      onOpenChange(false);
      setNotes("");
      await onComplete?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "view" ? "Batch Details" : mode === "approve" ? "Approve Batch" : "Reject Batch"}
          </DialogTitle>
          <DialogDescription>
            {batch.name} — {batch.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/50 p-4 text-sm">
            <div>
              <p className="text-muted-foreground">Requested by</p>
              <p className="font-medium">{batch.requestedBy}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Approver</p>
              <p className="font-medium">{batch.approver ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(batch.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge variant="warning">{batchStatusLabels[batch.status]}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Total amount</p>
              <p className="font-semibold">{formatCurrency(batch.totalAmount)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Recipients</p>
              <p className="font-medium">{batch.recipientCount}</p>
            </div>
          </div>

          {mode !== "view" && (
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Add approval notes..."
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            {mode === "view" ? "Close" : "Cancel"}
          </Button>
          {mode === "approve" && (
            <Button onClick={() => handleAction("approve")} disabled={submitting}>
              Approve Batch
            </Button>
          )}
          {mode === "reject" && (
            <Button variant="destructive" onClick={() => handleAction("reject")} disabled={submitting}>
              Reject Batch
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
