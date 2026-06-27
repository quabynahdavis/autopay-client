"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminRole, isEmployeeRole } from "@/types/auth";
import type { Permission } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";

interface RequireAuthProps {
  children: React.ReactNode;
  portal: "admin" | "employee";
  permission?: Permission;
}

export function RequireAuth({ children, portal, permission }: RequireAuthProps) {
  const { user, isLoading, can } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (portal === "admin" && !isAdminRole(user.role)) {
      router.replace("/employee");
      return;
    }
    if (portal === "employee" && !isEmployeeRole(user.role)) {
      router.replace("/");
      return;
    }
    if (permission && !can(permission)) {
      router.replace(portal === "admin" ? "/" : "/employee");
    }
  }, [user, isLoading, portal, permission, can, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) return null;
  if (portal === "admin" && !isAdminRole(user.role)) return null;
  if (portal === "employee" && !isEmployeeRole(user.role)) return null;
  if (permission && !can(permission)) return null;

  return <>{children}</>;
}
