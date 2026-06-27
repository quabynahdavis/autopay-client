import type { AuthUser, LoginCredentials } from "@/types/auth";
import { defaultCompany } from "@/lib/auth-store";
import { getStoredPassword, getStoredUsers } from "@/lib/auth-store";

const DEMO_PASSWORD = "password123";

export const mockUsers: (AuthUser & { password: string })[] = [
  {
    id: "usr_1",
    email: "james.adom@acmecorp.com.gh",
    password: DEMO_PASSWORD,
    name: "James Adom",
    role: "company_admin",
    companyId: defaultCompany.id,
    companyName: defaultCompany.name,
  },
  {
    id: "usr_3",
    email: "sarah.osei@acmecorp.com.gh",
    password: DEMO_PASSWORD,
    name: "Sarah Osei",
    role: "finance_officer",
    companyId: defaultCompany.id,
    companyName: defaultCompany.name,
  },
  {
    id: "usr_6",
    email: "kwame.asante@acmecorp.com.gh",
    password: DEMO_PASSWORD,
    name: "Kwame Asante",
    role: "employee",
    companyId: defaultCompany.id,
    companyName: defaultCompany.name,
    employeeId: "EMP-1042",
  },
  {
    id: "usr_7",
    email: "ama.serwaa@acmecorp.com.gh",
    password: DEMO_PASSWORD,
    name: "Ama Serwaa",
    role: "employee",
    companyId: defaultCompany.id,
    companyName: defaultCompany.name,
    employeeId: "EMP-1087",
  },
];

export function getAllUsers(): AuthUser[] {
  const mock = mockUsers.map(({ password: _, ...u }) => u);
  const stored = getStoredUsers();
  const emails = new Set(mock.map((u) => u.email.toLowerCase()));
  return [...mock, ...stored.filter((u) => !emails.has(u.email.toLowerCase()))];
}

export function authenticate(credentials: LoginCredentials): AuthUser | null {
  const email = credentials.email.trim().toLowerCase();

  const mock = mockUsers.find(
    (u) => u.email.toLowerCase() === email && u.password === credentials.password
  );
  if (mock) {
    const { password: _, ...authUser } = mock;
    return authUser;
  }

  const stored = getStoredUsers().find((u) => u.email.toLowerCase() === email);
  if (!stored) return null;

  const password = getStoredPassword(email);
  if (password !== credentials.password) return null;

  return stored;
}

export function getUserByEmployeeId(employeeId: string): AuthUser | undefined {
  return getAllUsers().find((u) => u.employeeId === employeeId);
}

export function getCompanyEmployees(companyId: string): AuthUser[] {
  return getAllUsers().filter((u) => u.companyId === companyId && u.role === "employee");
}
