export type AuditStatus = "success" | "failed" | "warning";

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  status: AuditStatus;
}
