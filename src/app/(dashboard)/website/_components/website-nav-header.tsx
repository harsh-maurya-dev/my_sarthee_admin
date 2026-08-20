"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  Briefcase,
  BookOpen,
  UserPlus,
  FileUser,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function WebsiteNavHeader() {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Overview",
      href: "/website",
      icon: Globe,
      exact: true,
    },
    {
      title: "Job Management",
      href: "/website/careers/jobs",
      icon: UserPlus,
    },
    {
      title: "Application Management",
      href: "/website/careers/applications",
      icon: FileUser,
    },
    {
      title: "Service Management",
      href: "/website/services",
      icon: Briefcase,
    },
    {
      title: "Enquiry Management",
      href: "/website/enquiries",
      icon: MessageSquare,
    },
    {
      title: "Blog/News Management",
      href: "/website/blogs",
      icon: BookOpen,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || (item.href !== "/website" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
              isActive
                ? "bg-teal-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/60"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
