"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { AuthUser, LoginCredentials } from "@/types/auth";
import { getPostLoginRedirect, isAdminRole, isEmployeeRole } from "@/types/auth";
import type { RegisterBusinessInput, RegisterEmployeeInput } from "@/types/company";
import { authenticate } from "@/services/mock/users";
import {
  registerBusiness,
  registerEmployee,
} from "@/lib/auth-store";
import { hasPermission } from "@/constants/roles";
import type { Permission } from "@/types/auth";

const STORAGE_KEY = "bulkpay_auth_user";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  registerBusiness: (
    input: RegisterBusinessInput
  ) => Promise<{ success: boolean; error?: string }>;
  registerEmployee: (
    input: RegisterEmployeeInput
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  can: (permission: Permission) => boolean;
  isAdmin: boolean;
  isEmployee: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const persistUser = useCallback((authUser: AuthUser) => {
    setUser(authUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      await new Promise((r) => setTimeout(r, 300));
      const authUser = authenticate(credentials);
      if (!authUser) {
        return { success: false, error: "Wrong email or password. Try again." };
      }
      persistUser(authUser);
      router.push(getPostLoginRedirect(authUser.role));
      return { success: true };
    },
    [router, persistUser]
  );

  const handleRegisterBusiness = useCallback(
    async (input: RegisterBusinessInput) => {
      await new Promise((r) => setTimeout(r, 300));
      const result = registerBusiness(input);
      if (!result.success || !result.user) {
        return { success: false, error: result.error };
      }
      persistUser(result.user);
      router.push("/");
      return { success: true };
    },
    [router, persistUser]
  );

  const handleRegisterEmployee = useCallback(
    async (input: RegisterEmployeeInput) => {
      await new Promise((r) => setTimeout(r, 300));
      const result = registerEmployee(input);
      if (!result.success || !result.user) {
        return { success: false, error: result.error };
      }
      persistUser(result.user);
      router.push("/employee");
      return { success: true };
    },
    [router, persistUser]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push("/login");
  }, [router]);

  const can = useCallback(
    (permission: Permission) => (user ? hasPermission(user.role, permission) : false),
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      registerBusiness: handleRegisterBusiness,
      registerEmployee: handleRegisterEmployee,
      logout,
      can,
      isAdmin: user ? isAdminRole(user.role) : false,
      isEmployee: user ? isEmployeeRole(user.role) : false,
    }),
    [user, isLoading, login, handleRegisterBusiness, handleRegisterEmployee, logout, can]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useCompanyId(): string {
  const { user } = useAuth();
  return user?.companyId ?? "comp_acme";
}
