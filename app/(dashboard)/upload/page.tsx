"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Eye } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { UploadZone } from "@/components/shared/UploadZone";
import { PaymentsTable } from "@/features/payments/PaymentTable";
import { Button } from "@/components/ui/button";
import { sampleBatchPayments } from "@/services/mock/payments";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function UploadBatchPage() {
  const { can } = useAuth();
  const [uploaded, setUploaded] = useState(false);

  const totalAmount = sampleBatchPayments.reduce((sum, p) => sum + p.amount, 0);
  const bankCount = sampleBatchPayments.filter((p) => p.paymentType === "bank").length;
  const momoCount = sampleBatchPayments.filter((p) => p.paymentType === "momo").length;
  const errors = sampleBatchPayments.filter((p) => !p.validation?.valid).length;

  const handleFileSelect = () => {
    setUploaded(true);
    toast.success("File uploaded successfully");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        title="Upload Batch"
        description="Upload a CSV or Excel file to process bulk payments"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Upload Batch" },
        ]}
      />

      <SectionCard title="Upload File">
        <UploadZone onFileSelect={handleFileSelect} />
      </SectionCard>

      {uploaded && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Total Amount", value: formatCurrency(totalAmount) },
              { label: "Recipients", value: sampleBatchPayments.length },
              { label: "Bank Payments", value: bankCount },
              { label: "MoMo Payments", value: momoCount },
              { label: "Validation Errors", value: errors },
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

          {errors > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  {errors} validation {errors === 1 ? "error" : "errors"} found
                </p>
                <p className="text-sm text-amber-700">
                  Fix errors before submitting, or proceed with valid recipients only.
                </p>
              </div>
            </div>
          )}

          <SectionCard
            title="Payment Preview"
            description="Review recipients before submitting for approval"
            action={
              can("admin.approval") ? (
                <Button size="lg" asChild>
                  <Link href="/approval">
                    <Eye className="h-4 w-4" />
                    Review & Approve
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() =>
                    toast.success("Batch submitted — Finance will review and approve")
                  }
                >
                  Submit for Approval
                </Button>
              )
            }
          >
            <PaymentsTable data={sampleBatchPayments} />
          </SectionCard>
        </>
      )}
    </div>
  );
}
