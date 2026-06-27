"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { fetchBankingInfo } from "@/services/api/employees";
import { useApiData } from "@/hooks/useApiData";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { PaymentMethodType } from "@/types/employee";

export default function EmployeeBankingPage() {
  const { user } = useAuth();
  const employeeId = user?.employeeId ?? "";
  const { data: banking, loading } = useApiData(
    () => fetchBankingInfo(employeeId),
    [employeeId]
  );
  const [method, setMethod] = useState<PaymentMethodType>("momo");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (banking?.preferredMethod) setMethod(banking.preferredMethod);
  }, [banking?.preferredMethod]);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader title="Bank Account" description="Where you get paid" />
      {loading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <>
          <SectionCard title="Payment method">
            <div className="flex gap-3">
              <Button
                variant={method === "momo" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setMethod("momo")}
              >
                MoMo
              </Button>
              <Button
                variant={method === "bank" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setMethod("bank")}
              >
                Bank
              </Button>
            </div>
          </SectionCard>
          <SectionCard title={method === "momo" ? "MoMo details" : "Bank details"}>
            {method === "momo" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Network</Label>
                  <Input defaultValue={banking?.momoNetwork ?? "MTN"} />
                </div>
                <div className="space-y-2">
                  <Label>Number</Label>
                  <Input defaultValue={banking?.momoNumber ?? ""} />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Bank</Label>
                  <Input defaultValue={banking?.bankName ?? "GCB Bank"} />
                </div>
                <div className="space-y-2">
                  <Label>Account number</Label>
                  <Input defaultValue={banking?.bankAccountNumber ?? ""} />
                </div>
              </div>
            )}
          </SectionCard>
          <Button className="w-full" onClick={() => setOpen(true)}>
            Save
          </Button>
          <ConfirmationDialog
            open={open}
            onOpenChange={setOpen}
            title="Save?"
            description="Finance will review before your next pay."
            confirmLabel="Submit"
            onConfirm={() => toast.success("Sent to finance")}
          />
        </>
      )}
    </div>
  );
}
