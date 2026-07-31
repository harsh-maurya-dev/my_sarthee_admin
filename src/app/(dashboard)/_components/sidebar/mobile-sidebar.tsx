"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { swiftAlert } from "@/lib/swift-alert";

export function MobileSidebar() {
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const router = useRouter();

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out from MySarthee Admin?")) {
      setIsMobileOpen(false);
      swiftAlert.info({
        title: "Signed Out",
        description: "You have been logged out of your session.",
      });
      router.push("/");
    }
  };

  return (
    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        {/* Brand Header */}
        <SheetHeader className="h-16 px-4 flex justify-center border-b text-left">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 border p-1 shadow-xs">
                <Image
                  src="/logo/logo.svg"
                  alt="MySarthee Logo"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-foreground">
                  MySarthee
                </span>
                <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 -mt-0.5">
                  Admin Portal
                </span>
              </div>
            </Link>
        </SheetHeader>

        {/* Nav List */}
        <ScrollArea className="flex-1">
          <SidebarNav />
        </ScrollArea>

        {/* Footer Logout */}
        <div className="p-3 border-t">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center justify-start text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold gap-2.5 h-9 px-3"
          >
            <LogOut className="h-4 w-4 shrink-0 text-rose-600" />
            <span>Logout</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
