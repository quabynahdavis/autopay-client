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
import {
  fetchCurrentUser,
  loginApi,
  logoutApi,
  registerBusinessApi,
  registerEmployeeApi,
} from "@/services/api/auth";
import { hasPermission } from "@/constants/roles";
import type { Permission } from "@/types/auth";
import { USER_KEY, getToken } from "@/lib/api/client";

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

  const persistUser = useCallback((authUser: AuthUser) => {
    setUser(authUser);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
  }, []);

  useEffect(() => {
    async function restoreSession() {
      try {
        const stored = localStorage.getItem(USER_KEY);
        if (stored) setUser(JSON.parse(stored) as AuthUser);
        if (!getToken()) {
          setIsLoading(false);
          return;
        }
        const freshUser = await fetchCurrentUser();
        persistUser(freshUser);
      } catch {
        localStorage.removeItem(USER_KEY);
        logoutApi();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void restoreSession();
  }, [persistUser]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await loginApi(credentials);
        persistUser(result.user);
        router.push(getPostLoginRedirect(result.user.role));
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Wrong email or password. Try again.",
        };
      }
    },
    [router, persistUser]
  );

  const handleRegisterBusiness = useCallback(
    async (input: RegisterBusinessInput) => {
      try {
        const result = await registerBusinessApi(input);
        persistUser(result.user);
        router.push("/dashboard");
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Registration failed",
        };
      }
    },
    [router, persistUser]
  );

  const handleRegisterEmployee = useCallback(
    async (input: RegisterEmployeeInput) => {
      try {
        const result = await registerEmployeeApi(input);
        persistUser(result.user);
        router.push("/employee");
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Registration failed",
        };
      }
    },
    [router, persistUser]
  );

  const logout = useCallback(() => {
    setUser(null);
    logoutApi();
    localStorage.removeItem(USER_KEY);
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
