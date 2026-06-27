import { apiFetch } from "@/lib/api/client";
import type { Payment, Batch } from "@/types/payment";
import type { ApprovalRequest } from "@/types/employee";

export interface DashboardStats {
  totalPayments: { count: number; amount: number };
  successful: number;
  pending: number;
  failed: number;
}

export interface ApprovalPreview {
  id: string;
  requestedBy: string;
  approver?: string;
  date: string;
  amount: number;
  recipientCount: number;
  status: string;
}

export interface ChartVolume {
  month: string;
  volume: number;
}

export interface DashboardActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: string;
}

export function fetchDashboardStats() {
  return apiFetch<DashboardStats>("/dashboard/stats");
}

export function fetchApprovalPreview() {
  return apiFetch<ApprovalPreview[]>("/dashboard/approval-preview");
}

export function fetchMonthlyVolume() {
  return apiFetch<ChartVolume[]>("/dashboard/charts/volume");
}

export function fetchRecentTransactions() {
  return apiFetch<Payment[]>("/dashboard/recent-transactions");
}

export function fetchPayments(status?: string) {
  const query = status ? `?status=${status}` : "";
  return apiFetch<Payment[]>(`/payments${query}`);
}

export function fetchPendingBatches() {
  return apiFetch<Batch[]>("/batches/pending");
}

export function fetchBatch(id: string) {
  return apiFetch<Batch>(`/batches/${id}`);
}

export function approveBatch(id: string, comment?: string) {
  return apiFetch<Batch>(`/batches/${id}/approve`, {
    method: "POST",
    body: JSON.stringify({ comment }),
  });
}

export function rejectBatch(id: string, comment?: string) {
  return apiFetch<Batch>(`/batches/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ comment }),
  });
}

export interface CreateBatchPayment {
  recipientName: string;
  accountNumber: string;
  paymentType: "bank" | "momo";
  bankOrProvider: string;
  amount: number;
}

export function createBatch(name: string, payments: CreateBatchPayment[]) {
  return apiFetch<Batch>("/batches", {
    method: "POST",
    body: JSON.stringify({ name, payments }),
  });
}

export function fetchRecipients() {
  return apiFetch<
    {
      id: string;
      name: string;
      accountNumber: string;
      type: string;
      provider: string;
      department: string;
    }[]
  >("/recipients");
}

export function fetchApprovals(status?: string) {
  const query = status ? `?status=${status}` : "";
  return apiFetch<ApprovalRequest[]>(`/approvals${query}`);
}

export function approveRequest(id: string) {
  return apiFetch<ApprovalRequest>(`/approvals/${id}/approve`, { method: "POST" });
}

export function rejectRequest(id: string) {
  return apiFetch<ApprovalRequest>(`/approvals/${id}/reject`, { method: "POST" });
}
