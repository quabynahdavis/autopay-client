import type { AuthUser } from "@/types/auth";
import type { Company, RegisterBusinessInput, RegisterEmployeeInput } from "@/types/company";

const USERS_KEY = "bulkpay_users";
const COMPANIES_KEY = "bulkpay_companies";

export const defaultCompany: Company = {
  id: "comp_acme",
  code: "ACME-GH",
  name: "Acme Corporation Ghana Ltd",
  phone: "+233 30 123 4567",
  email: "finance@acmecorp.com.gh",
  address: "14 Independence Avenue, Accra",
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getAllCompanies(): Company[] {
  const stored = readJson<Company[]>(COMPANIES_KEY, []);
  const hasDefault = stored.some((c) => c.id === defaultCompany.id);
  return hasDefault ? stored : [defaultCompany, ...stored];
}

export function getCompanyById(id: string): Company | undefined {
  return getAllCompanies().find((c) => c.id === id);
}

export function getCompanyByCode(code: string): Company | undefined {
  return getAllCompanies().find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase()
  );
}

export function saveCompany(company: Company) {
  const companies = getAllCompanies().filter((c) => c.id !== company.id);
  writeJson(COMPANIES_KEY, [...companies, company]);
}

export function getStoredUsers(): AuthUser[] {
  return readJson<AuthUser[]>(USERS_KEY, []);
}

export function saveStoredUser(user: AuthUser) {
  const users = getStoredUsers().filter((u) => u.email !== user.email);
  writeJson(USERS_KEY, [...users, user]);
}

export function registerBusiness(input: RegisterBusinessInput): {
  success: boolean;
  error?: string;
  user?: AuthUser;
} {
  const email = input.email.trim().toLowerCase();
  if (getStoredUsers().some((u) => u.email.toLowerCase() === email)) {
    return { success: false, error: "This email is already registered" };
  }

  const companyId = `comp_${Date.now()}`;
  const code = input.companyName
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)
    .toUpperCase()
    .padEnd(4, "X")
    .concat("-GH");

  const company: Company = {
    id: companyId,
    code,
    name: input.companyName.trim(),
    phone: input.phone.trim(),
    email,
    address: "Ghana",
  };

  saveCompany(company);

  const user: AuthUser = {
    id: `usr_${Date.now()}`,
    email,
    name: input.adminName.trim(),
    role: "company_admin",
    companyId: company.id,
    companyName: company.name,
  };

  saveStoredUser(user);
  saveStoredPassword(email, input.password);

  return { success: true, user };
}

export function registerEmployee(input: RegisterEmployeeInput): {
  success: boolean;
  error?: string;
  user?: AuthUser;
} {
  const company = getCompanyByCode(input.companyCode);
  if (!company) {
    return { success: false, error: "Company code not found. Ask your employer for the code." };
  }

  const email = input.email.trim().toLowerCase();
  if (getStoredUsers().some((u) => u.email.toLowerCase() === email)) {
    return { success: false, error: "This email is already registered" };
  }

  const employeeId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
  const [firstName, ...rest] = input.name.trim().split(" ");
  const lastName = rest.join(" ") || firstName;

  const user: AuthUser = {
    id: `usr_${Date.now()}`,
    email,
    name: input.name.trim(),
    role: "employee",
    companyId: company.id,
    companyName: company.name,
    employeeId,
  };

  saveStoredUser(user);
  saveStoredPassword(email, input.password);

  registerEmployeeProfile(user, company, firstName, lastName, input.phone);

  return { success: true, user };
}

const PASSWORDS_KEY = "bulkpay_passwords";

function saveStoredPassword(email: string, password: string) {
  const passwords = readJson<Record<string, string>>(PASSWORDS_KEY, {});
  passwords[email.toLowerCase()] = password;
  writeJson(PASSWORDS_KEY, passwords);
}

export function getStoredPassword(email: string): string | undefined {
  const passwords = readJson<Record<string, string>>(PASSWORDS_KEY, {});
  return passwords[email.toLowerCase()];
}

function registerEmployeeProfile(
  user: AuthUser,
  company: Company,
  firstName: string,
  lastName: string,
  phone: string
) {
  const key = "bulkpay_employee_profiles";
  const profiles = readJson<Record<string, unknown>>(key, {});
  profiles[user.employeeId!] = {
    employeeId: user.employeeId,
    userId: user.id,
    companyId: company.id,
    firstName,
    lastName,
    email: user.email,
    phone,
    residentialAddress: "",
    digitalAddress: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    emergencyRelationship: "",
    dateOfBirth: "",
    gender: "",
    nationality: "Ghanaian",
    maritalStatus: "",
    preferredLanguage: "English",
  };
  writeJson(key, profiles);
}

export function getRegisteredProfile(employeeId: string) {
  const profiles = readJson<Record<string, Record<string, string>>>(
    "bulkpay_employee_profiles",
    {}
  );
  return profiles[employeeId];
}
