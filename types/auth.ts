export type UserRole = "company_admin" | "finance_officer" | "employee";

export type Permission =
  | "admin.dashboard"
  | "admin.payments"
  | "admin.upload"
  | "admin.approval"
  | "admin.reports"
  | "admin.settings"
  | "admin.employees"
  | "employee.dashboard"
  | "employee.profile"
  | "employee.banking"
  | "employee.payments";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  companyName?: string;
  employeeId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const ADMIN_ROLES: UserRole[] = ["company_admin", "finance_officer"];

export const EMPLOYEE_ROLES: UserRole[] = ["employee"];

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

export function isEmployeeRole(role: UserRole): boolean {
  return role === "employee";
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    company_admin: "Company Admin",
    finance_officer: "Finance Officer",
    employee: "Employee",
  };
  return labels[role];
}

export function getPostLoginRedirect(role: UserRole): string {
  return role === "employee" ? "/employee" : "/dashboard";
}
