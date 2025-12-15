"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Receipt,
  Store,
  Users,
  Brain,
  Globe2,
  AlertTriangle,
  LineChart as LineChartIcon,
  PackageSearch,
  UtensilsCrossed,
  Menu as MenuIcon,
  X,
  ChevronDown,
  BookOpen,
  ChevronLeft,
  Beaker,
} from "lucide-react";

type NavChild = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type NavItem = {
  label: string;
  href?: string;
  icon: React.ReactNode;
  group: "core" | "intelligence";
  children?: NavChild[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/overview",
    icon: <LayoutDashboard className="h-4 w-4" />,
    group: "core",
  },
  {
    label: "Invoices & ingestion",
    href: "/invoices",
    icon: <Receipt className="h-4 w-4" />,
    group: "core",
  },
  {
    label: "Suppliers & products",
    href: "/suppliers",
    icon: <Store className="h-4 w-4" />,
    group: "core",
    children: [
      {
        label: "Suppliers & contracts",
        href: "/suppliers",
        icon: <Store className="h-3.5 w-3.5" />,
      },
      {
        label: "Product universe",
        href: "/products",
        icon: <PackageSearch className="h-3.5 w-3.5" />,
      },
    ],
  },
  {
    label: "Menu & recipes",
    href: "/menu",
    icon: <UtensilsCrossed className="h-4 w-4" />,
    group: "core",
    children: [
      {
        label: "Menu overview",
        href: "/menu",
        icon: <UtensilsCrossed className="h-3.5 w-3.5" />,
      },
      {
        label: "Recipes workbench",
        href: "/menu/recipes",
        icon: <BookOpen className="h-3.5 w-3.5" />,
      },
    ],
  },
  {
    label: "R&D planner",
    href: "/rd",
    icon: <Beaker className="h-4 w-4" />,
    group: "core",
  },
  {
    label: "Competitors",
    href: "/competitors",
    icon: <Globe2 className="h-4 w-4" />,
    group: "intelligence",
  },
  {
    label: "Reputation",
    href: "/reputation",
    icon: <Users className="h-4 w-4" />,
    group: "intelligence",
  },
  {
    label: "Intelligence hub",
    href: "/intelligence",
    icon: <Brain className="h-4 w-4" />,
    group: "intelligence",
  },
  {
    label: "Control room",
    href: "/control-room",
    icon: <LineChartIcon className="h-4 w-4" />,
    group: "intelligence",
  },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex">
        {/* DESKTOP SIDEBAR (collapsible) */}
        {sidebarOpen && (
          <aside className="hidden lg:flex lg:flex-col lg:w-68 border-r border-slate-900 bg-slate-950/98 backdrop-blur-sm shadow-[0_0_60px_rgba(15,23,42,0.9)]">
            <SidebarHeader onCollapse={() => setSidebarOpen(false)} />
            <SidebarScrollArea pathname={pathname} />
            <SidebarFooter />
          </aside>
        )}

        {/* DESKTOP OPEN NAV BUTTON WHEN COLLAPSED */}
        {!sidebarOpen && (
          <button
            type="button"
            className="hidden lg:flex fixed left-3 top-4 z-30 items-center gap-1 rounded-xl border border-slate-700 bg-slate-950/95 px-2.5 py-1.5 text-[11px] text-slate-200 shadow-[0_0_40px_rgba(15,23,42,0.9)] hover:border-cyan-400 hover:text-cyan-200"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="h-4 w-4" />
            <span>Open navigation</span>
          </button>
        )}

        {/* MOBILE DRAWER SIDEBAR */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="relative w-64 border-r border-slate-900 bg-slate-950/98 backdrop-blur-sm shadow-[0_0_50px_rgba(15,23,42,0.9)]">
              <div className="flex items-center justify-between gap-2 px-5 py-4 border-b border-slate-900/80">
                <SidebarBrand />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:border-slate-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SidebarScrollArea
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
              <SidebarFooter />
            </div>
            <button
              type="button"
              className="flex-1 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
          </div>
        )}

        {/* MAIN AREA */}
        <main className="flex-1 min-h-screen">
          {/* TOP BAR for small viewports */}
          <header className="lg:hidden sticky top-0 z-20 border-b border-slate-900/80 bg-slate-950/95 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <SidebarBrand />
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-200"
              >
                <MenuIcon className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="px-3 py-4 md:px-6 md:py-6 lg:px-8 lg:py-7">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* SIDEBAR BUILDING BLOCKS */

function SidebarBrand() {
  return (
    <>
      <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-cyan-400/10 border border-cyan-400/40 shadow-[0_0_36px_rgba(34,211,238,0.55)]">
        <Brain className="h-4 w-4 text-cyan-300" />
      </div>
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-300">
          ODYAN
        </p>
        <p className="text-[11px] text-slate-500">
          AI restaurant intelligence
        </p>
      </div>
    </>
  );
}

function SidebarHeader({ onCollapse }: { onCollapse?: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-900/80 bg-gradient-to-r from-slate-950 to-slate-950/90">
      <div className="flex items-center gap-2">
        <SidebarBrand />
      </div>
      {onCollapse && (
        <button
          type="button"
          onClick={onCollapse}
          className="hidden lg:inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:border-cyan-400 hover:text-cyan-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function SidebarScrollArea({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto custom-scroll px-3 py-4 space-y-6">
      <nav className="space-y-3">
        <p className="px-2 text-[10px] font-medium tracking-[0.16em] text-slate-500 uppercase">
          Core operations
        </p>
        <div className="space-y-1">
          {NAV_ITEMS.filter((i) => i.group === "core").map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      <nav className="space-y-3">
        <p className="px-2 text-[10px] font-medium tracking-[0.16em] text-slate-500 uppercase">
          Intelligence layer
        </p>
        <div className="space-y-1">
          {NAV_ITEMS.filter((i) => i.group === "intelligence").map(
            (item) => (
              <SidebarItem
                key={item.label}
                item={item}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            )
          )}
        </div>
      </nav>

      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 space-y-2 text-[11px] shadow-[0_0_32px_rgba(15,23,42,0.9)]">
        <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">
          <AlertTriangle className="h-3 w-3 text-amber-300" />
          Live risk snapshot
        </p>
        <p className="text-slate-300">
          3 suppliers drifting above band, 2 delivery menus with GP risk, and 1 contract renewal in the next 30 days.
        </p>
        <Link
          href="/overview"
          className="inline-flex items-center gap-1 text-[10px] text-cyan-300 hover:text-cyan-100"
          onClick={onNavigate}
        >
          Open today&apos;s brief
        </Link>
      </div>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="border-t border-slate-900/80 px-4 py-3 text-[10px] text-slate-500 bg-slate-950">
      <p>Account: Demo group · EL&N mock</p>
      <p>Data confidence: 87 percent (mock)</p>
    </div>
  );
}

/* NAV ITEM WITH OPTIONAL CHILDREN */

function SidebarItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const hasChildren = !!item.children && item.children.length > 0;

  const isChildActive =
    hasChildren &&
    item.children!.some((child) => pathname.startsWith(child.href));

  const isActive =
    (!!item.href && pathname.startsWith(item.href)) || isChildActive;

  const [open, setOpen] = useState<boolean>(isActive);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const baseLink = item.href ?? "#";

  return (
    <div className="space-y-1">
      <Link
        href={baseLink}
        className={`group flex items-center gap-2 rounded-2xl px-2.5 py-1.5 text-xs transition ${
          isActive
            ? "bg-slate-900/95 border border-cyan-400/70 text-slate-50 shadow-[0_0_40px_rgba(34,211,238,0.4)]"
            : "border border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900/70"
        }`}
        onClick={onNavigate}
      >
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-xl border ${
            isActive
              ? "border-cyan-400/70 bg-cyan-400/10 text-cyan-200"
              : "border-slate-700 bg-slate-900 text-slate-400 group-hover:border-cyan-400/60 group-hover:text-cyan-200"
          }`}
        >
          {item.icon}
        </span>
        <span className="flex-1 truncate">{item.label}</span>
        {hasChildren && (
          <button
            type="button"
            className="ml-1 flex h-5 w-5 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500"
            onClick={handleToggle}
          >
            <ChevronDown
              className={`h-3 w-3 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </Link>

      {hasChildren && open && (
        <div className="ml-8 space-y-1">
          {item.children!.map((child) => {
            const childActive = pathname.startsWith(child.href);
            return (
              <Link
                key={child.href}
                href={child.href}
                className={`group flex items-center gap-2 rounded-2xl px-2.5 py-1.5 text-[11px] transition ${
                  childActive
                    ? "bg-slate-900/95 border border-cyan-400/70 text-slate-50"
                    : "border border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900/70"
                }`}
                onClick={onNavigate}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-lg border ${
                    childActive
                      ? "border-cyan-400/70 bg-cyan-400/10 text-cyan-200"
                      : "border-slate-700 bg-slate-900 text-slate-400 group-hover:border-cyan-400/60 group-hover:text-cyan-200"
                  }`}
                >
                  {child.icon}
                </span>
                <span className="truncate">{child.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
