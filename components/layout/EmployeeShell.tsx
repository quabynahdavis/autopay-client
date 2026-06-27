"use client";

import { useState } from "react";
import Link from "next/link";
import { employeeNavigation } from "@/constants/navigation";
import { FilteredNavItems } from "@/components/layout/SidebarItem";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth, useCompanyId } from "@/contexts/AuthContext";
import { getCompanyById } from "@/lib/auth-store";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { LogOut, Menu } from "lucide-react";

export function EmployeeShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const company = getCompanyById(useCompanyId());

  return (
    <RequireAuth portal="employee">
      <div className="flex min-h-screen bg-background">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card md:flex">
          <div className="border-b border-border p-5">
            <Link href="/employee"><p className="font-semibold">My Pay</p>
            <p className="truncate text-xs text-muted-foreground">{company?.name ?? user?.companyName}</p></Link>
          </div>
          <nav className="space-y-1 p-3">{employeeNavigation.map((item) => <FilteredNavItems key={item.href} items={[item]} />)}</nav>
        </aside>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent onClose={() => setMobileOpen(false)}>
            <nav className="space-y-1 p-3">{employeeNavigation.map((item) => (
              <div key={item.href} onClick={() => setMobileOpen(false)}><FilteredNavItems items={[item]} /></div>
            ))}</nav>
          </SheetContent>
        </Sheet>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></Button>
            <p className="ml-auto text-sm">{user?.name}</p>
            <Button variant="ghost" size="icon" onClick={logout}><LogOut className="h-5 w-5" /></Button>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
