"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import type { NavItem } from "@/constants/navigation";

interface SidebarItemProps {
  item: NavItem;
  onNavigate?: () => void;
}

export function SidebarItem({ item, onNavigate }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive =
    item.href === "/" || item.href === "/employee"
      ? pathname === item.href
      : pathname.startsWith(item.href);

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}

export function FilteredNavItems({ items }: { items: NavItem[] }) {
  const { can } = useAuth();
  return (
    <>
      {items
        .filter((item) => !item.permission || can(item.permission))
        .map((item) => (
          <SidebarItem key={item.href} item={item} />
        ))}
    </>
  );
}
