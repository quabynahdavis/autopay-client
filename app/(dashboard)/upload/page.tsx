"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Download } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { UploadZone } from "@/components/shared/UploadZone";
import { PaymentsTable } from "@/features/payments/PaymentTable";
import { Button } from "@/components/ui/button";
import { createBatch } from "@/services/api/payments";
import { formatCurrency } from "@/lib/utils";
import type { Payment } from "@/types/payment";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// ── CSV parsing ──────────────────────────────────────────────────────────────

type CsvRow = {
  recipientName: string;
  accountNumber: string;
  paymentType: "bank" | "momo";
  bankOrProvider: string;
  amount: number;
};

function parseCSV(text: string): CsvRow[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));

  // Flexible header mapping
  const colIndex = (names: string[]) => {
    for (const name of names) {
      const i = headers.indexOf(name);
      if (i !== -1) return i;
    }
    return -1;
  };

  const nameCol = colIndex(["name", "recipient_name", "recipient"]);
  const accountCol = colIndex(["account_number", "account", "number"]);
  const typeCol = colIndex(["type", "payment_type"]);
  const providerCol = colIndex(["provider", "bank", "bank_or_provider", "bank/provider"]);
  const amountCol = colIndex(["amount", "amount_(ghs)", "amount_ghs"]);

  return lines.slice(1).map((line, i) => {
    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    const rawType = (typeCol >= 0 ? cols[typeCol] : "bank").toLowerCase();
    const paymentType: "bank" | "momo" = rawType.includes("momo") || rawType.includes("mobile") ? "momo" : "bank";

    return {
      recipientName: nameCol >= 0 ? cols[nameCol] : `Recipient ${i + 1}`,
      accountNumber: accountCol >= 0 ? cols[accountCol] : "",
      paymentType,
      bankOrProvider: providerCol >= 0 ? cols[providerCol] : "Unknown",
      amount: amountCol >= 0 ? parseFloat(cols[amountCol]) || 0 : 0,
    };
  });
}

function validateRow(row: CsvRow): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  if (!row.recipientName) errors.push("Missing name");
  if (row.paymentType === "bank" && !/^\d{10,16}$/.test(row.accountNumber)) {
    errors.push("Bank account must be 10–16 digits");
  } else if (row.paymentType === "momo" && !/^0\d{9}$/.test(row.accountNumber)) {
    errors.push("MoMo number must be 10 digits starting with 0");
  }
  if (!row.bankOrProvider) errors.push("Missing bank/provider");
  if (!row.amount || row.amount <= 0) errors.push("Invalid amount");
  return errors.length ? { valid: false, errors } : { valid: true };
}

function csvRowToPayment(row: CsvRow, idx: number): Payment {
  const validation = validateRow(row);
  return {
    id: `prev_${idx}`,
    recipientName: row.recipientName,
    accountNumber: row.accountNumber,
    paymentType: row.paymentType,
    bankOrProvider: row.bankOrProvider,
    amount: row.amount,
    currency: "GHS",
    status: "pending",
    validation,
    createdAt: new Date().toISOString(),
  };
}

// ── Sample CSV download ───────────────────────────────────────────────────────

const SAMPLE_CSV = `name,account_number,type,provider,amount
Kwame Asante,0244123456,momo,MTN MoMo,3500
Ama Serwaa,0555987654,momo,Vodafone Cash,4200
Golden Harvest Ltd,1234567890,bank,GCB Bank,85000
Kofi Mensah,0208765432,momo,MTN MoMo,2800
Abena Boateng,0302001234,bank,Ecobank Ghana,12000
`;

function downloadSampleCSV() {
  const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "masspay_sample.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function UploadBatchPage() {
  const { can } = useAuth();
  const router = useRouter();
  const [previewPayments, setPreviewPayments] = useState<Payment[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const totalAmount = previewPayments.reduce((sum, p) => sum + p.amount, 0);
  const bankCount = previewPayments.filter((p) => p.paymentType === "bank").length;
  const momoCount = previewPayments.filter((p) => p.paymentType === "momo").length;
  const errorCount = previewPayments.filter((p) => !p.validation?.valid).length;

  const handleFileSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCSV(text);
      if (rows.length === 0) {
        toast.error("Could not read file. Make sure it's a valid CSV with headers.");
        return;
      }
      const payments = rows.map(csvRowToPayment);
      setPreviewPayments(payments);
      toast.success(`Parsed ${payments.length} recipient(s) from file`);
    };
    reader.onerror = () => toast.error("Failed to read file");
    reader.readAsText(file);
  }, []);

  const handleSubmit = async () => {
    if (previewPayments.length === 0) return;
    setSubmitting(true);
    try {
      const validPayments = previewPayments.filter((p) => p.validation?.valid);
      if (validPayments.length === 0) {
        toast.error("No valid payments to submit. Fix the errors first.");
        return;
      }
      await createBatch(
        `Bulk Payment — ${new Date().toLocaleString("en-GB", { month: "long", year: "numeric" })}`,
        validPayments.map((p) => ({
          recipientName: p.recipientName,
          accountNumber: p.accountNumber,
          paymentType: p.paymentType,
          bankOrProvider: p.bankOrProvider,
          amount: p.amount,
        }))
      );
      toast.success("Batch submitted — awaiting approval");
      if (can("admin.approval")) {
        router.push("/approval");
      } else {
        setPreviewPayments([]);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit batch");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        title="Upload Batch"
        description="Upload a CSV file to process bulk payments"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Upload Batch" },
        ]}
        actions={
          <Button variant="outline" onClick={downloadSampleCSV}>
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        }
      />

      <SectionCard title="Upload File" description="CSV format: name, account_number, type, provider, amount">
        <UploadZone onFileSelect={handleFileSelect} />
      </SectionCard>

      {previewPayments.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Total Amount", value: formatCurrency(totalAmount) },
              { label: "Recipients", value: previewPayments.length },
              { label: "Bank Payments", value: bankCount },
              { label: "MoMo Payments", value: momoCount },
              { label: "Validation Errors", value: errorCount },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>

          {errorCount > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  {errorCount} validation {errorCount === 1 ? "error" : "errors"} found
                </p>
                <p className="text-sm text-amber-700">
                  Only valid recipients will be submitted. Fix errors and re-upload to include all.
                </p>
              </div>
            </div>
          )}

          <SectionCard
            title="Payment Preview"
            description="Review recipients before submitting for approval"
            action={
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={submitting || previewPayments.filter((p) => p.validation?.valid).length === 0}
              >
                {submitting ? "Submitting…" : "Submit for Approval"}
              </Button>
            }
          >
            <PaymentsTable data={previewPayments} />
          </SectionCard>
        </>
      )}
    </div>
  );
}
