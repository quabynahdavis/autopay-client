import { apiFetch } from "@/lib/api/client";
import type {
  EmployeeProfile,
  BankingInfo,
  SalaryPayment,
  EmployeeNotification,
  EmployeeDocument,
  ManagedEmployee,
  ApprovalRequest,
} from "@/types/employee";

export function fetchEmployees() {
  return apiFetch<ManagedEmployee[]>("/employees");
}

export function fetchEmployeeProfile(employeeId: string) {
  return apiFetch<EmployeeProfile>(`/employees/${employeeId}/profile`);
}

export function updateEmployeeProfile(
  employeeId: string,
  data: Partial<EmployeeProfile>
) {
  return apiFetch<EmployeeProfile>(`/employees/${employeeId}/profile`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function fetchBankingInfo(employeeId: string) {
  return apiFetch<BankingInfo>(`/employees/${employeeId}/banking`);
}

export function fetchSalaryPayments(employeeId: string) {
  return apiFetch<SalaryPayment[]>(`/employees/${employeeId}/salary-payments`);
}

export function fetchNotifications(employeeId: string) {
  return apiFetch<EmployeeNotification[]>(`/employees/${employeeId}/notifications`);
}

export function fetchDocuments(employeeId: string) {
  return apiFetch<EmployeeDocument[]>(`/employees/${employeeId}/documents`);
}

export function fetchPaymentApprovals() {
  return apiFetch<ApprovalRequest[]>("/approvals?status=pending");
}
