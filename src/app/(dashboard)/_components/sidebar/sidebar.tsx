"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PanelLeftClose, PanelLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/sidebar-context";
import { SidebarNav } from "./sidebar-nav";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { swiftAlert } from "@/lib/swift-alert";

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const router = useRouter();

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out from MySarthee Admin?")) {
      swiftAlert.info({
        title: "Signed Out",
        description: "You have been logged out of your session.",
      });
      router.push("/");
    }
  };

  return (
    <aside
      className={cn(
        "relative h-screen flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out hidden md:flex sticky top-0",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 py-4 items-center justify-between px-4 border-b h-[70px]">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 border p-1 shadow-xs">
            <Image
              src="/logo/logo.svg"
              alt="MySarthee Logo"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
              priority
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-extrabold text-base tracking-tight truncate text-foreground">
                MySarthee
              </span>
              <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 truncate -mt-0.5">
                Admin Portal
              </span>
            </div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      {/* Nav List */}
      <ScrollArea className="flex-1 h-[calc(100ch_-70px)] overflow-y-auto">
        <SidebarNav />
      </ScrollArea>

      {/* Footer Logout */}
      <div className="p-3 border-t">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center justify-start text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold gap-2.5 h-9 px-3",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0 text-rose-600" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
