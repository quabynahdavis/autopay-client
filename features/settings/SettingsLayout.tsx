"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { settingsNavigation } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Settings navigation">
      {settingsNavigation.map((item) => {
        const isActive =
          item.href === "/settings"
            ? pathname === "/settings"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <SettingsNav />
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
