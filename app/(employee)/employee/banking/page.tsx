"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getBankingInfo } from "@/services/mock/employees";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PaymentMethodType } from "@/types/employee";

export default function EmployeeBankingPage() {
  const { user } = useAuth();
  const banking = getBankingInfo(user?.employeeId ?? "EMP-1042");
  const [method, setMethod] = useState<PaymentMethodType>(banking?.preferredMethod ?? "momo");
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader title="Bank Account" description="Where you get paid" />
      <SectionCard title="Payment method">
        <div className="flex gap-3">
          <Button variant={method === "momo" ? "default" : "outline"} className="flex-1" onClick={() => setMethod("momo")}>MoMo</Button>
          <Button variant={method === "bank" ? "default" : "outline"} className="flex-1" onClick={() => setMethod("bank")}>Bank</Button>
        </div>
      </SectionCard>
      <SectionCard title={method === "momo" ? "MoMo details" : "Bank details"}>
        {method === "momo" ? (
          <div className="space-y-4">
            <div className="space-y-2"><Label>Network</Label><Input defaultValue={banking?.momoNetwork ?? "MTN"} /></div>
            <div className="space-y-2"><Label>Number</Label><Input defaultValue={banking?.momoNumber ?? ""} /></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2"><Label>Bank</Label><Input defaultValue={banking?.bankName ?? "GCB Bank"} /></div>
            <div className="space-y-2"><Label>Account number</Label><Input defaultValue={banking?.bankAccountNumber ?? ""} /></div>
          </div>
        )}
      </SectionCard>
      <Button className="w-full" onClick={() => setOpen(true)}>Save</Button>
      <ConfirmationDialog open={open} onOpenChange={setOpen} title="Save?" description="Finance will review before your next pay."
        confirmLabel="Submit" onConfirm={() => toast.success("Sent to finance")} />
    </div>
  );
}
