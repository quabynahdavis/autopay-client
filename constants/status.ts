import type { BatchStatus, PaymentStatus } from "@/types/payment";

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  success: "Success",
  pending: "Pending",
  failed: "Failed",
  processing: "Processing",
  retry: "Retry",
};

export const batchStatusLabels: Record<BatchStatus, string> = {
  draft: "Draft",
  pending_approval: "Pending Approval",
  approved: "Approved",
  rejected: "Rejected",
  processing: "Processing",
  completed: "Completed",
};

export const ghanaBanks = [
  "GCB Bank",
  "Ecobank Ghana",
  "Stanbic Bank",
  "Absa Bank",
  "Fidelity Bank",
  "Zenith Bank",
];

export const momoProviders = ["MTN MoMo", "Vodafone Cash", "AirtelTigo Money"];
