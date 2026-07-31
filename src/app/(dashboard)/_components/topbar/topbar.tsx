"use client";

import { useTheme } from "next-themes";
import { Menu, Search, Bell, Moon, Sun, Palette, Command, PanelLeft } from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserNav } from "./user-nav";

export function Topbar() {
  const { toggleMobileSidebar, toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between  bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left: Menu Toggles & Search Bar */}
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

        {/* <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={toggleSidebar}
        >
          <PanelLeft className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button> */}

        {/* Global Search Bar */}
        {/* <div className="relative w-48 sm:w-64 md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-slate-100/80 pl-9 pr-12 text-sm border-0 focus-visible:ring-1 focus-visible:ring-ring dark:bg-slate-800/60"
          />
          <div className="absolute right-2.5 top-2.5 flex items-center gap-0.5 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-xs">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div> */}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* <Button
          variant="ghost"
          size="sm"
          className="hidden sm:inline-flex text-xs font-semibold text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/40"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
          HealthCare Live
        </Button> */}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle Theme</span>
        </Button>

        {/* Customization / Palette */}
        {/* <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Customization</span>
        </Button> */}

        {/* User Navigation Dropdown */}
        <UserNav />
      </div>
    </header>
  );
}
