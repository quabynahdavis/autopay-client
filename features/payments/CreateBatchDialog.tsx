"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
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
import { createBatch } from "@/services/api/payments";
import { fetchEmployees, fetchBankingInfo } from "@/services/api/employees";
import type { ManagedEmployee, BankingInfo } from "@/types/employee";

interface CreateBatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateBatchDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateBatchDialogProps) {
  const [employees, setEmployees] = useState<ManagedEmployee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [bankingData, setBankingData] = useState<Record<string, BankingInfo>>({});
  
  // Selection and amounts
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  
  const [batchName, setBatchName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch employees when dialog opens
  useEffect(() => {
    if (open) {
      setLoadingEmployees(true);
      fetchEmployees()
        .then(async (data) => {
          const emps = data || [];
          setEmployees(emps);
          
          // Pre-fetch banking info for all employees
          const bankingPromises = emps.map(emp => 
            fetchBankingInfo(emp.employeeId)
              .then(info => ({ id: emp.employeeId, info }))
              .catch(() => ({ id: emp.employeeId, info: null }))
          );
          
          const results = await Promise.all(bankingPromises);
          const bankingMap: Record<string, BankingInfo> = {};
          results.forEach(res => {
            if (res.info) bankingMap[res.id] = res.info;
          });
          setBankingData(bankingMap);
        })
        .catch((err) => {
          console.error("Failed to load employees", err);
          toast.error("Could not load employee directory");
        })
        .finally(() => {
          setLoadingEmployees(false);
        });
    } else {
      // Reset state on close
      setSelectedIds(new Set());
      setAmounts({});
      setBatchName("");
    }
  }, [open]);

  const toggleEmployee = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
      const newAmounts = { ...amounts };
      delete newAmounts[id];
      setAmounts(newAmounts);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleAmountChange = (id: string, val: string) => {
    setAmounts(prev => ({ ...prev, [id]: val }));
  };

  const selectedEmployees = useMemo(() => {
    return employees.filter(emp => selectedIds.has(emp.employeeId));
  }, [employees, selectedIds]);

  const totalAmount = useMemo(() => {
    return selectedEmployees.reduce((sum, emp) => {
      const amt = parseFloat(amounts[emp.employeeId] || "0");
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);
  }, [selectedEmployees, amounts]);

  const validate = () => {
    if (!batchName.trim()) {
      toast.error("Please enter a batch name");
      return false;
    }
    if (selectedIds.size === 0) {
      toast.error("Please select at least one employee");
      return false;
    }

    for (const emp of selectedEmployees) {
      const banking = bankingData[emp.employeeId];
      if (!banking) {
        toast.error(`${emp.name} has no verified banking details`);
        return false;
      }
      
      const amtStr = amounts[emp.employeeId];
      const amt = parseFloat(amtStr);
      if (!amtStr || isNaN(amt) || amt <= 0) {
        toast.error(`Please enter a valid amount for ${emp.name}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payments = selectedEmployees.map(emp => {
        const banking = bankingData[emp.employeeId];
        const paymentType = banking.preferredMethod;
        const bankOrProvider = paymentType === "bank" ? banking.bankName! : banking.momoNetwork!;
        const accountNumber = paymentType === "bank" ? banking.bankAccountNumber! : banking.momoNumber!;
        
        return {
          recipientName: emp.name,
          accountNumber: accountNumber.replace(/\s|-/g, ""),
          paymentType,
          bankOrProvider,
          amount: parseFloat(amounts[emp.employeeId]),
        };
      });

      await createBatch(batchName, payments);
      
      toast.success("Batch submitted for approval!");
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit batch");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Payment Batch</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden space-y-4">
          <div className="space-y-1.5 shrink-0 pt-4">
            <Label htmlFor="batch-name">Batch Name</Label>
            <Input
              id="batch-name"
              placeholder="e.g. June 2026 Payroll"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 pb-2 space-y-3">
            <Label>Select Employees</Label>
            
            {loadingEmployees ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                Loading employee directory...
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-xl">
                No active employees found.
              </div>
            ) : (
              <div className="border border-border rounded-xl divide-y divide-border">
                {employees.map(emp => {
                  const isSelected = selectedIds.has(emp.employeeId);
                  const banking = bankingData[emp.employeeId];
                  const hasBanking = !!banking;
                  
                  return (
                    <div key={emp.employeeId} className={`p-3 flex items-center gap-4 transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'}`}>
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 shrink-0 rounded border-input text-primary focus:ring-primary"
                        checked={isSelected}
                        onChange={() => toggleEmployee(emp.employeeId)}
                        disabled={!hasBanking}
                      />
                      
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">{emp.department}</p>
                      </div>
                      
                      <div className="w-48">
                        {!hasBanking ? (
                          <span className="text-xs text-danger flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> No Account setup
                          </span>
                        ) : banking.preferredMethod === "bank" ? (
                          <div className="text-xs">
                            <p className="font-medium text-foreground">{banking.bankName}</p>
                            <p className="text-muted-foreground">Acc: {banking.bankAccountNumber}</p>
                          </div>
                        ) : (
                          <div className="text-xs">
                            <p className="font-medium text-foreground">{banking.momoNetwork}</p>
                            <p className="text-muted-foreground">MoMo: {banking.momoNumber}</p>
                          </div>
                        )}
                      </div>

                      <div className="w-32">
                        <Input 
                          type="number"
                          placeholder="Amount (GHS)"
                          className="h-8 text-sm"
                          value={amounts[emp.employeeId] || ""}
                          onChange={(e) => handleAmountChange(emp.employeeId, e.target.value)}
                          disabled={!isSelected}
                          min="0.01"
                          step="0.01"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="shrink-0 flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm">
              <p className="text-muted-foreground">Selected: <span className="font-medium text-foreground">{selectedIds.size}</span></p>
              <p className="text-muted-foreground">Total Amount: <span className="font-semibold text-foreground text-base">GHS {totalAmount.toFixed(2)}</span></p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={submitting || selectedIds.size === 0 || !batchName.trim()}>
                {submitting ? "Submitting..." : "Submit for Approval"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
