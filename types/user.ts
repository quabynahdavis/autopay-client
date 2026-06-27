import type { UserRole } from "@/types/auth";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "invited" | "inactive";
  lastActive: string;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed?: string;
  status: "active" | "revoked";
}
