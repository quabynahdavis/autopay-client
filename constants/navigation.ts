import {
  CheckCircle,
  CreditCard,
  LayoutDashboard,
  Settings,
  Upload,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Permission } from "@/types/auth";
import { Home, Landmark, User, Wallet } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
}

export const adminNavigation: NavItem[] = [
  { label: "Home", href: "/", icon: LayoutDashboard, permission: "admin.dashboard" },
  { label: "Send Payment", href: "/upload", icon: Upload, permission: "admin.upload" },
  { label: "All Payments", href: "/payments", icon: CreditCard, permission: "admin.payments" },
  { label: "Approve", href: "/approval", icon: CheckCircle, permission: "admin.approval" },
  { label: "My Team", href: "/employees", icon: Users, permission: "admin.employees" },
  { label: "Reports", href: "/reports", icon: CreditCard, permission: "admin.reports" },
  { label: "Company", href: "/settings", icon: Settings, permission: "admin.settings" },
];

export const employeeNavigation: NavItem[] = [
  { label: "Home", href: "/employee", icon: Home, permission: "employee.dashboard" },
  { label: "My Pay", href: "/employee/payments", icon: Wallet, permission: "employee.payments" },
  { label: "Bank Account", href: "/employee/banking", icon: Landmark, permission: "employee.banking" },
  { label: "My Details", href: "/employee/profile", icon: User, permission: "employee.profile" },
];

export const mainNavigation = adminNavigation;
