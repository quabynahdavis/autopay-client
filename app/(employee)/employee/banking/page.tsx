"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { fetchBankingInfo, updateBankingInfo } from "@/services/api/employees";
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
  const { data: banking, loading, refetch } = useApiData(
    () => fetchBankingInfo(employeeId),
    [employeeId]
  );
  
  const [method, setMethod] = useState<PaymentMethodType>("momo");
  const [momoNetwork, setMomoNetwork] = useState("");
  const [momoNumber, setMomoNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (banking) {
      setMethod(banking.preferredMethod || "momo");
      setMomoNetwork(banking.momoNetwork || "");
      setMomoNumber(banking.momoNumber || "");
      setBankName(banking.bankName || "");
      setBankAccountNumber(banking.bankAccountNumber || "");
    }
  }, [banking]);

  const handleSave = async () => {
    try {
      const payload = {
        preferredMethod: method,
        momoNetwork: (method === "momo" ? momoNetwork : undefined) as any,
        momoNumber: method === "momo" ? momoNumber : undefined,
        bankName: method === "bank" ? bankName : undefined,
        bankAccountNumber: method === "bank" ? bankAccountNumber : undefined,
        accountName: user?.name || undefined,
        momoRegisteredName: method === "momo" ? user?.name : undefined,
      };

      await updateBankingInfo(employeeId, payload);
      toast.success("Banking details updated successfully");
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update banking details");
    } finally {
      setOpen(false);
    }
  };

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
                  <Label htmlFor="momoNetwork">Network</Label>
                  <select
                    id="momoNetwork"
                    value={momoNetwork}
                    onChange={(e) => setMomoNetwork(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select network…</option>
                    <option value="MTN MoMo">MTN MoMo</option>
                    <option value="Vodafone Cash">Vodafone Cash</option>
                    <option value="AirtelTigo Money">AirtelTigo Money</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="momoNumber">Number</Label>
                  <Input
                    id="momoNumber"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    placeholder="e.g. 0244123456"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank</Label>
                  <Input
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. GCB Bank"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankAccountNumber">Account number</Label>
                  <Input
                    id="bankAccountNumber"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    placeholder="e.g. 1234567890"
                  />
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
            title="Save Details?"
            description="Are you sure you want to update your banking info?"
            confirmLabel="Save"
            onConfirm={handleSave}
          />
        </>
      )}
    </div>
  );
}
