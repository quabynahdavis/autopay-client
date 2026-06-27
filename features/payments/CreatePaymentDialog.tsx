"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Building2, Smartphone } from "lucide-react";
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

// ── Provider lists ────────────────────────────────────────────────────────────

const BANK_PROVIDERS = [
  "GCB Bank", "Ecobank Ghana", "Fidelity Bank", "Absa Bank",
  "Standard Chartered", "Stanbic Bank", "CalBank", "Zenith Bank",
  "UBA Ghana", "Republic Bank",
];
const MOMO_PROVIDERS = ["MTN MoMo", "Vodafone Cash", "AirtelTigo Money"];
const CARD_PROVIDERS = ["Visa", "Mastercard", "GH-Link", "AmEx"];

const TYPE_CONFIG = {
  bank: {
    label: "Bank Transfer",
    icon: Building2,
    accountLabel: "Account Number",
    accountPlaceholder: "10–16 digit account number",
    providers: BANK_PROVIDERS,
  },
  momo: {
    label: "Mobile Money",
    icon: Smartphone,
    accountLabel: "MoMo Number",
    accountPlaceholder: "0xxxxxxxxx",
    providers: MOMO_PROVIDERS,
  },
  card: {
    label: "Card",
    icon: CreditCard,
    accountLabel: "Card Number",
    accountPlaceholder: "16-digit card number",
    providers: CARD_PROVIDERS,
  },
} as const;

type PayType = keyof typeof TYPE_CONFIG;

interface Fields {
  recipientName: string;
  paymentType: PayType;
  bankOrProvider: string;
  accountNumber: string;
  amount: string;
  note: string;
}

const EMPTY: Fields = {
  recipientName: "",
  paymentType: "bank",
  bankOrProvider: "",
  accountNumber: "",
  amount: "",
  note: "",
};

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
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof Fields, value: string) =>
    setFields((f) => ({ ...f, [key]: value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof Fields, string>> = {};
    if (!fields.recipientName.trim()) e.recipientName = "Name required";
    if (!fields.bankOrProvider) e.bankOrProvider = "Select a provider";
    if (!fields.accountNumber.trim()) {
      e.accountNumber = "Required";
    } else if (fields.paymentType === "bank" && !/^\d{10,16}$/.test(fields.accountNumber)) {
      e.accountNumber = "Must be 10–16 digits";
    } else if (fields.paymentType === "momo" && !/^0\d{9}$/.test(fields.accountNumber)) {
      e.accountNumber = "Must start with 0 and be 10 digits";
    } else if (fields.paymentType === "card" && !/^\d{16}$/.test(fields.accountNumber.replace(/\s|-/g, ""))) {
      e.accountNumber = "Must be 16 digits";
    }
    const amt = parseFloat(fields.amount);
    if (!fields.amount || isNaN(amt) || amt <= 0) e.amount = "Enter a valid amount";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createPayment({
        recipientName: fields.recipientName.trim(),
        accountNumber: fields.accountNumber.replace(/\s|-/g, ""),
        paymentType: fields.paymentType,
        bankOrProvider: fields.bankOrProvider,
        amount: parseFloat(fields.amount),
        note: fields.note || undefined,
      });
      toast.success(`Payment to ${fields.recipientName.trim()} submitted — processing now`);
      setFields(EMPTY);
      setErrors({});
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTypeChange = (type: PayType) => {
    setFields((f) => ({ ...f, paymentType: type, bankOrProvider: "", accountNumber: "" }));
    setErrors({});
  };

  const config = TYPE_CONFIG[fields.paymentType];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Payment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Payment type selector */}
          <div className="space-y-2">
            <Label>Payment Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["bank", "momo", "card"] as PayType[]).map((type) => {
                const Ic = TYPE_CONFIG[type].icon;
                const active = fields.paymentType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-colors ${active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50"
                      }`}
                  >
                    <Ic className="h-5 w-5" />
                    {TYPE_CONFIG[type].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recipient */}
          <div className="space-y-1.5">
            <Label htmlFor="cp-name">Recipient Name</Label>
            <Input
              id="cp-name"
              placeholder="Full name or business name"
              value={fields.recipientName}
              onChange={(e) => set("recipientName", e.target.value)}
            />
            {errors.recipientName && <p className="text-xs text-danger">{errors.recipientName}</p>}
          </div>

          {/* Provider */}
          <div className="space-y-1.5">
            <Label htmlFor="cp-provider">
              {fields.paymentType === "bank" ? "Bank" : fields.paymentType === "momo" ? "Network" : "Card Network"}
            </Label>
            <select
              id="cp-provider"
              value={fields.bankOrProvider}
              onChange={(e) => set("bankOrProvider", e.target.value)}
              className="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select…</option>
              {config.providers.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.bankOrProvider && <p className="text-xs text-danger">{errors.bankOrProvider}</p>}
          </div>

          {/* Account number */}
          <div className="space-y-1.5">
            <Label htmlFor="cp-account">{config.accountLabel}</Label>
            <Input
              id="cp-account"
              placeholder={config.accountPlaceholder}
              inputMode="numeric"
              value={fields.accountNumber}
              onChange={(e) => set("accountNumber", e.target.value)}
            />
            {errors.accountNumber && <p className="text-xs text-danger">{errors.accountNumber}</p>}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="cp-amount">Amount (GHS)</Label>
            <Input
              id="cp-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={fields.amount}
              onChange={(e) => set("amount", e.target.value)}
            />
            {errors.amount && <p className="text-xs text-danger">{errors.amount}</p>}
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label htmlFor="cp-note">Note (optional)</Label>
            <Input
              id="cp-note"
              placeholder="e.g. Invoice #1234"
              value={fields.note}
              onChange={(e) => set("note", e.target.value)}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
