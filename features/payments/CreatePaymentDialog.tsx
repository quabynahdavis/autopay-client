"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CreditCard, Building2, Smartphone, Plus } from "lucide-react";
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
  "GCB Bank",
  "Ecobank Ghana",
  "Fidelity Bank",
  "Absa Bank",
  "Standard Chartered",
  "Stanbic Bank",
  "CalBank",
  "Zenith Bank",
  "UBA Ghana",
  "Republic Bank",
];

const MOMO_PROVIDERS = ["MTN MoMo", "Vodafone Cash", "AirtelTigo Money"];

const CARD_PROVIDERS = ["Visa", "Mastercard", "GH-Link", "AmEx"];

const schema = z.object({
  recipientName: z.string().min(2, "Name required"),
  paymentType: z.enum(["bank", "momo", "card"]),
  bankOrProvider: z.string().min(1, "Select a provider"),
  accountNumber: z.string().min(1, "Required"),
  amount: z.coerce.number().positive("Must be greater than 0"),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CreatePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

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
    label: "Credit / Debit Card",
    icon: CreditCard,
    accountLabel: "Card Number",
    accountPlaceholder: "16-digit card number",
    providers: CARD_PROVIDERS,
  },
} as const;

export function CreatePaymentDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreatePaymentDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { paymentType: "bank" },
  });

  const paymentType = watch("paymentType");
  const config = TYPE_CONFIG[paymentType];
  const Icon = config.icon;

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await createPayment({
        recipientName: data.recipientName,
        accountNumber: data.accountNumber.replace(/\s|-/g, ""),
        paymentType: data.paymentType,
        bankOrProvider: data.bankOrProvider,
        amount: data.amount,
        note: data.note,
      });
      toast.success(`Payment to ${data.recipientName} submitted — processing now`);
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTypeChange = (type: "bank" | "momo" | "card") => {
    setValue("paymentType", type);
    setValue("bankOrProvider", "");
    setValue("accountNumber", "");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Payment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Payment type selector */}
          <div className="space-y-2">
            <Label>Payment Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["bank", "momo", "card"] as const).map((type) => {
                const Ic = TYPE_CONFIG[type].icon;
                const active = paymentType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-colors ${
                      active
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
            <Label htmlFor="recipientName">Recipient Name</Label>
            <Input
              id="recipientName"
              placeholder="Full name or business name"
              {...register("recipientName")}
            />
            {errors.recipientName && (
              <p className="text-xs text-danger">{errors.recipientName.message}</p>
            )}
          </div>

          {/* Provider */}
          <div className="space-y-1.5">
            <Label htmlFor="bankOrProvider">
              {paymentType === "bank" ? "Bank" : paymentType === "momo" ? "Network" : "Card Network"}
            </Label>
            <select
              id="bankOrProvider"
              {...register("bankOrProvider")}
              className="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select {paymentType === "bank" ? "bank" : paymentType === "momo" ? "network" : "card network"}…</option>
              {config.providers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.bankOrProvider && (
              <p className="text-xs text-danger">{errors.bankOrProvider.message}</p>
            )}
          </div>

          {/* Account / card number */}
          <div className="space-y-1.5">
            <Label htmlFor="accountNumber">{config.accountLabel}</Label>
            <Input
              id="accountNumber"
              placeholder={config.accountPlaceholder}
              {...register("accountNumber")}
              inputMode="numeric"
            />
            {errors.accountNumber && (
              <p className="text-xs text-danger">{errors.accountNumber.message}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount (GHS)</Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-xs text-danger">{errors.amount.message}</p>
            )}
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label htmlFor="note">Note (optional)</Label>
            <Input id="note" placeholder="e.g. Invoice #1234" {...register("note")} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
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
