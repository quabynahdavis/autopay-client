"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { adminNavigation } from "@/constants/navigation";
import { FilteredNavItems } from "@/components/layout/SidebarItem";
import { RequireAuth } from "@/components/auth/RequireAuth";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RequireAuth portal="admin">
      <div className="flex min-h-screen bg-background">
        <Sidebar className="hidden md:flex" />

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent onClose={() => setMobileOpen(false)}>
            <div className="flex h-16 items-center border-b border-border px-4">
              <p className="text-sm font-semibold">BulkPay GH — Admin</p>
            </div>
            <nav className="space-y-1 p-4">
              {adminNavigation.map((item) => (
                <div key={item.href} onClick={() => setMobileOpen(false)}>
                  <FilteredNavItems items={[item]} />
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
          <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground md:px-8">
            © 2026 BulkPay GH. All rights reserved.
          </footer>
        </div>
      </div>
    </RequireAuth>
  );
}
