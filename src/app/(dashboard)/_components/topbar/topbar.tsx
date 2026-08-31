"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  Menu,
  Bell,
  Moon,
  Sun,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  Activity,
  CheckCircle2,
  Users2,
} from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { UserNav } from "./user-nav";
import { systemRoles, UserRole } from "@/lib/admin-data";
import { swiftAlert } from "@/lib/swift-alert";

export function Topbar() {
  const { toggleMobileSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [activeRole, setActiveRole] = useState<UserRole>("Super Admin");

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    swiftAlert.info({
      title: `Switched View: ${role}`,
      description: `Viewing operational permissions and dashboards configured for ${role}.`,
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/40 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left: Mobile Toggle & System Live Badge */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Mobile Menu</span>
        </Button>

      </div>

      {/* Right Actions: Role Selector, Critical Escalation Banner, Notifications, Theme, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher Preview */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 rounded-lg border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 text-xs font-semibold text-[#01265D] dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900/40/70 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
              <span className="hidden md:inline">Role:</span> {activeRole}
              <ChevronDown className="h-3 w-3 text-[#01265D] dark:text-blue-400/70 dark:text-blue-400/70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Switch Admin Role View
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {systemRoles.map((r) => (
              <DropdownMenuItem
                key={r.role}
                onClick={() => handleRoleChange(r.role)}
                className="flex items-start justify-between cursor-pointer py-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">{r.role}</span>
                    {activeRole === r.role && (
                      <CheckCircle2 className="h-3 w-3 text-[#01265D] dark:text-blue-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight line-clamp-1">
                    {r.description}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* Critical Escalations Quick Link */}
        {/* <Link href="/escalations">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 px-2.5"
          >
            <AlertTriangle className="h-3.5 w-3.5 animate-bounce" />
            <span className="hidden sm:inline">3 Critical Alerts</span>
          </Button>
        </Link> */}

        {/* Notifications */}
        <Link href="/notifications">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" />
            <span className="sr-only">Notifications</span>
          </Button>
        </Link>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle Theme</span>
        </Button>

        {/* User Profile */}
        <UserNav />
      </div>
    </header>
  );
}
