import type { ApiKey, TeamMember } from "@/types/user";

export const teamMembers: TeamMember[] = [
  {
    id: "tm_1",
    name: "James Adom",
    email: "james.adom@acmecorp.com.gh",
    role: "company_admin",
    status: "active",
    lastActive: "2026-06-27T09:15:00Z",
  },

  {
    id: "tm_3",
    name: "Ama Osei",
    email: "admin@acmecorp.com.gh",
    role: "company_admin",
    status: "active",
    lastActive: "2026-06-26T14:00:00Z",
  },
];

export const apiKeys: ApiKey[] = [
  {
    id: "key_1",
    name: "Production API",
    prefix: "bp_live_****7f2a",
    createdAt: "2026-01-15T10:00:00Z",
    lastUsed: "2026-06-27T08:00:00Z",
    status: "active",
  },
  {
    id: "key_2",
    name: "Staging API",
    prefix: "bp_test_****9c1b",
    createdAt: "2026-03-01T14:00:00Z",
    lastUsed: "2026-06-26T16:30:00Z",
    status: "active",
  },
  {
    id: "key_3",
    name: "Legacy Integration",
    prefix: "bp_live_****3d8e",
    createdAt: "2025-08-20T09:00:00Z",
    status: "revoked",
  },
];

export const companyProfile = {
  name: "Acme Corporation Ghana Ltd",
  tin: "C0001234567",
  address: "14 Independence Avenue, Accra, Ghana",
  phone: "+233 30 123 4567",
  email: "finance@acmecorp.com.gh",
};

export const exportHistory = [
  {
    id: "exp_1",
    name: "Payroll Report — June 2026",
    type: "PDF",
    date: "2026-06-26T16:00:00Z",
    size: "2.4 MB",
    status: "completed" as const,
  },
  {
    id: "exp_2",
    name: "Vendor Payments — Q2 2026",
    type: "Excel",
    date: "2026-06-25T11:00:00Z",
    size: "856 KB",
    status: "completed" as const,
  },
  {
    id: "exp_3",
    name: "Monthly Summary — May 2026",
    type: "CSV",
    date: "2026-06-01T09:00:00Z",
    size: "124 KB",
    status: "completed" as const,
  },
];
