"use client";

import Link from "next/link";
import { adminNavigation } from "@/constants/navigation";
import { FilteredNavItems } from "@/components/layout/SidebarItem";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const { user } = useAuth();

  return (
    <aside
      className={cn(
        "flex w-64 shrink-0 flex-col border-r border-border bg-card",
        className
      )}
      aria-label="Admin navigation"
    >
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            MP
          </div>
          <div>
            <p className="text-sm font-semibold">MassPay</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.companyName ?? "Company"}
            </p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {adminNavigation.map((item) => (
          <div key={item.href} onClick={onNavigate}>
            <FilteredNavItems items={[item]} />
          </div>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <p className="truncate text-xs text-muted-foreground">{user?.companyName}</p>
      </div>
    </aside>
  );
}
