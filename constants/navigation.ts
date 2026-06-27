import {
  Bell,
  Building2,
  CheckCircle,
  CreditCard,
  Download,
  Key,
  LayoutDashboard,
  Lock,
  Settings,
  Upload,
  UserCircle,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Permission } from "@/types/auth";
import { Home, Landmark, User } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
}

export const adminNavigation: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard, permission: "admin.dashboard" },
  { label: "Send Payment", href: "/upload", icon: Upload, permission: "admin.upload" },
  { label: "All Payments", href: "/payments", icon: CreditCard, permission: "admin.payments" },
  { label: "Approve", href: "/approval", icon: CheckCircle, permission: "admin.approval" },
  { label: "My Team", href: "/employees", icon: Users, permission: "admin.employees" },
  { label: "Reports", href: "/reports", icon: CreditCard, permission: "admin.reports" },
  { label: "Company", href: "/settings", icon: Settings, permission: "admin.settings" },
];

export const reportNavigation: NavItem[] = [
  { label: "Overview", href: "/reports", icon: LayoutDashboard },
  { label: "Payroll", href: "/reports/payroll", icon: Wallet },
  { label: "Vendor Payments", href: "/reports/vendor", icon: CreditCard },
  { label: "Export History", href: "/reports/exports", icon: Download },
];

export const settingsNavigation: NavItem[] = [
  { label: "Company", href: "/settings", icon: Settings },
  { label: "Company Profile", href: "/settings/company", icon: Building2 },
  { label: "Team Members", href: "/settings/team", icon: Users },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
  { label: "Security", href: "/settings/security", icon: Lock },
  { label: "API Keys", href: "/settings/api-keys", icon: Key },
];

export const employeeNavigation: NavItem[] = [
  { label: "Home", href: "/employee", icon: Home, permission: "employee.dashboard" },
  { label: "My Pay", href: "/employee/payments", icon: Wallet, permission: "employee.payments" },
  { label: "Bank Account", href: "/employee/banking", icon: Landmark, permission: "employee.banking" },
  { label: "My Details", href: "/employee/profile", icon: User, permission: "employee.profile" },
];

export const mainNavigation = adminNavigation;
