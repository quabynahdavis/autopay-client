import type { AuthUser, LoginCredentials } from "@/types/auth";
import type { RegisterBusinessInput, RegisterEmployeeInput } from "@/types/company";
import { apiFetch, setToken, clearToken } from "@/lib/api/client";

interface AuthResponse {
  token: string;
  user: AuthUser;
  redirect: string;
}

export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  setToken(result.token);
  return result;
}

export async function registerBusinessApi(
  input: RegisterBusinessInput
): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>("/auth/register/business", {
    method: "POST",
    body: JSON.stringify(input),
  });
  setToken(result.token);
  return result;
}

export async function registerEmployeeApi(
  input: RegisterEmployeeInput
): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>("/auth/register/employee", {
    method: "POST",
    body: JSON.stringify(input),
  });
  setToken(result.token);
  return result;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const result = await apiFetch<{ user: AuthUser }>("/auth/me");
  return result.user;
}

export function logoutApi() {
  clearToken();
}
