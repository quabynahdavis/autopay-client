import type { Permission, UserRole } from "@/types/auth";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  company_admin: [
    "admin.dashboard",
    "admin.payments",
    "admin.upload",
    "admin.approval",
    "admin.reports",
    "admin.settings",
    "admin.employees",
  ],
  employee: [
    "employee.dashboard",
    "employee.profile",
    "employee.banking",
    "employee.payments",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
