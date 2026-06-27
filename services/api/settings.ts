import { apiFetch } from "@/lib/api/client";
import type { TeamMember, ApiKey } from "@/types/user";
import type { AuditLog } from "@/types/audit";

export interface CompanyProfile {
  id: string;
  code: string;
  name: string;
  tin?: string;
  address: string;
  phone: string;
  email: string;
}

export interface ExportRecord {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  status: string;
}

export function fetchCompanyProfile() {
  return apiFetch<CompanyProfile>("/settings/company");
}

export function updateCompanyProfile(data: Partial<CompanyProfile>) {
  return apiFetch<CompanyProfile>("/settings/company", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function fetchTeamMembers() {
  return apiFetch<TeamMember[]>("/settings/team");
}

export function fetchApiKeys() {
  return apiFetch<ApiKey[]>("/settings/api-keys");
}

export function revokeApiKey(id: string) {
  return apiFetch<{ id: string; status: string }>(`/settings/api-keys/${id}/revoke`, {
    method: "POST",
  });
}

export function fetchAuditLogs() {
  return apiFetch<AuditLog[]>("/audit");
}

export function fetchExportHistory() {
  return apiFetch<ExportRecord[]>("/reports/exports");
}
