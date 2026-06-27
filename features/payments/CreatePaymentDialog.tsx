"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CreditCard, Building2, Smartphone, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPayment } from "@/services/api/payments";
import { fetchEmployees, fetchBankingInfo } from "@/services/api/employees";
import type { ManagedEmployee, BankingInfo } from "@/types/employee";

interface CreatePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreatePaymentDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreatePaymentDialogProps) {
  const [employees, setEmployees] = useState<ManagedEmployee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [banking, setBanking] = useState<BankingInfo | null>(null);
  const [loadingBanking, setLoadingBanking] = useState(false);

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ employee?: string; amount?: string }>({});

  // Fetch employees when the dialog opens
  useEffect(() => {
    if (open) {
      setLoadingEmployees(true);
      fetchEmployees()
        .then((data) => {
          setEmployees(data || []);
        })
        .catch((err) => {
          console.error("Failed to load employees", err);
          toast.error("Could not load employee directory");
        })
        .finally(() => {
          setLoadingEmployees(false);
        });
    } else {
      // Reset state
      setSelectedEmployeeId("");
      setBanking(null);
      setAmount("");
      setNote("");
      setErrors({});
    }
  }, [open]);

  // Fetch banking info when an employee is selected
  useEffect(() => {
    if (selectedEmployeeId) {
      setLoadingBanking(true);
      fetchBankingInfo(selectedEmployeeId)
        .then((info) => {
          setBanking(info);
        })
        .catch((err) => {
          console.error("Failed to load banking details", err);
          toast.error("Could not retrieve employee banking details");
          setBanking(null);
        })
        .finally(() => {
          setLoadingBanking(false);
        });
    } else {
      setBanking(null);
    }
  }, [selectedEmployeeId]);

  const validate = (): boolean => {
    const e: { employee?: string; amount?: string } = {};
    if (!selectedEmployeeId) e.employee = "Please select an employee";
    
    if (selectedEmployeeId && !banking) {
      e.employee = "Retrieving banking details...";
    } else if (banking) {
      if (banking.preferredMethod === "bank" && (!banking.bankAccountNumber || !banking.bankName)) {
        e.employee = "Employee has not set up their bank details";
      } else if (banking.preferredMethod === "momo" && (!banking.momoNumber || !banking.momoNetwork)) {
        e.employee = "Employee has not set up their MoMo details";
      }
    }

    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) e.amount = "Enter a valid amount";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    if (!banking) return;

    setSubmitting(true);
    try {
      const selectedEmp = employees.find((emp) => emp.employeeId === selectedEmployeeId);
      if (!selectedEmp) throw new Error("Selected employee not found");

      const paymentType = banking.preferredMethod;
      const bankOrProvider = paymentType === "bank" ? banking.bankName! : banking.momoNetwork!;
      const accountNumber = paymentType === "bank" ? banking.bankAccountNumber! : banking.momoNumber!;

      await createPayment({
        recipientName: selectedEmp.name,
        accountNumber: accountNumber.replace(/\s|-/g, ""),
        paymentType,
        bankOrProvider,
        amount: parseFloat(amount),
        note: note || undefined,
      });

      toast.success(`Payment to ${selectedEmp.name} submitted successfully`);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Payment to Employee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Employee selector */}
          <div className="space-y-1.5">
            <Label htmlFor="employee-select">Select Employee</Label>
            {loadingEmployees ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Loading employee list…
              </div>
            ) : (
              <select
                id="employee-select"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Choose employee…</option>
                {employees.map((emp) => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    {emp.name} ({emp.department})
                  </option>
                ))}
              </select>
            )}
            {errors.employee && <p className="text-xs text-danger">{errors.employee}</p>}
          </div>

          {/* Real-time banking details grab from employee info */}
          {selectedEmployeeId && (
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Verified Payment Channel
              </Label>
              {loadingBanking ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Grabbing employee account info…
                </div>
              ) : banking ? (
                <div className="mt-2 flex items-center gap-3">
                  {banking.preferredMethod === "bank" ? (
                    <>
                      <Building2 className="h-8 w-8 text-primary bg-primary/10 rounded-lg p-1.5" />
                      <div>
                        <p className="text-sm font-semibold">{banking.bankName}</p>
                        <p className="text-xs text-muted-foreground">
                          Account: {banking.bankAccountNumber}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Smartphone className="h-8 w-8 text-primary bg-primary/10 rounded-lg p-1.5" />
                      <div>
                        <p className="text-sm font-semibold">{banking.momoNetwork}</p>
                        <p className="text-xs text-muted-foreground">
                          MoMo No: {banking.momoNumber}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm text-danger mt-1">
                  This employee has not updated their banking/momo details yet.
                </p>
              )}
            </div>
          )}

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="payment-amount">Amount (GHS)</Label>
            <Input
              id="payment-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!banking}
            />
            {errors.amount && <p className="text-xs text-danger">{errors.amount}</p>}
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label htmlFor="payment-note">Note (optional)</Label>
            <Input
              id="payment-note"
              placeholder="e.g. June Payroll Bonus"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={!banking}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting || !banking}>
              {submitting ? "Sending…" : "Send Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
