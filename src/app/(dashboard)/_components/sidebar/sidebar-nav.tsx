"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  HeartPulse,
  HeartHandshake,
  AlertOctagon,
  MessageSquareText,
  BadgePercent,
  Building2,
  BarChart3,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Sparkles,
  FileCode,
  Globe,
  Briefcase,
  BellRing,
  CalendarClock,
  FileCheck,
  CheckSquare,
  ShieldCheck,
  Timer,
  UserCheck,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/sidebar-context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface SubNavItem {
  title: string;
  href: string;
  badge?: string;
  badgeColor?: string;
  subItems?: SubNavItem[];
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  subItems?: SubNavItem[];
}

export interface NavGroup {
  groupName?: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    groupName: "Main Operations",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Patients",
        href: "/patients",
        icon: Users,
      },
      {
        title: "Bookings",
        href: "/bookings",
        icon: CalendarCheck2,
      },
      {
        title: "Care Professionals",
        href: "/caregivers",
        icon: HeartPulse,
      },
      {
        title: "Scheduling",
        href: "/scheduling",
        icon: CalendarClock,
        badge: "Daily Shifts",
        badgeColor: "bg-blue-100 text-[#01265D] dark:bg-blue-950 dark:text-blue-300",
      },
      // {
      //   title: "Care Professional Onboarding",
      //   href: "/care-professional-onboarding",
      //   icon: UserCheck,
      //   badge: "Stages",
      //   badgeColor: "bg-blue-100 text-[#01265D] dark:bg-blue-950 dark:text-blue-300",
      //   subItems: [
      //     { title: "Application", href: "/care-professional-onboarding?tab=application" },
      //     { title: "Verified", href: "/care-professional-onboarding?tab=verified" },
      //     { title: "Eligible for Assignment", href: "/care-professional-onboarding?tab=eligible" },
      //   ],
      // },
      {
        title: "Smart Allocation",
        href: "/smart-assignment",
        icon: Sparkles,
        badge: "AI Match",
        badgeColor: "bg-blue-100 text-[#01265D] dark:bg-blue-950 dark:text-blue-300",
      },
      {
        title: "Service Management",
        href: "/service-management",
        icon: Briefcase,
      },
      {
        title: "Estimated Timelines",
        href: "/estimated-timelines",
        icon: Timer,
        badge: "SLA",
        badgeColor: "bg-blue-100 text-[#01265D] dark:bg-blue-950 dark:text-blue-300",
      },
      {
        title: "Onboarding Documents",
        href: "/onboarding-documents",
        icon: FileCheck,
      },
      {
        title: "Checklist Templates",
        href: "/checklist-templates",
        icon: CheckSquare,
      },
    ],
  },
  {
    groupName: "Clinical & Quality",
    items: [
      // {
      //   title: "Care Plan Management",
      //   href: "/care-management",
      //   icon: HeartHandshake,
      // },
      {
        title: "Escalations",
        href: "/escalations",
        icon: AlertOctagon,
      },
      {
        title: "Quality Assurance",
        href: "/quality-management",
        icon: ShieldCheck,
      },
      {
        title: "Communication",
        href: "/communication",
        icon: MessageSquareText,
      },
      {
        title: "Push Notifications",
        href: "/push-notifications",
        icon: BellRing,
        badge: "Mobile",
        badgeColor: "bg-blue-100 text-[#01265D] dark:bg-blue-950 dark:text-blue-300",
      },
    ],
  },
  {
    groupName: "Finance & Growth",
    items: [
      {
        title: "Payments & Billing",
        href: "/payments",
        icon: BadgePercent,
        // badge: "₹2.45L Pending",
        // badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
        subItems: [
          { title: "Revenue Dashboard", href: "/payments?tab=revenue" },
          { title: "Earning System", href: "/earning-system" },
          { title: "Caregiver Payouts", href: "/payouts" },
          { title: "Transactions Log", href: "/transactions" },
        ],
      },
      {
        title: "Cancellation & Refund",
        href: "/cancellations-refunds",
        icon: RotateCcw,
        // badge: "Requests",
        badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
        subItems: [
          { title: "Cancellation Requests", href: "/cancellations-refunds?tab=cancellations" },
          { title: "Rescheduling Requests", href: "/cancellations-refunds?tab=rescheduling" },
          { title: "Refund Processing", href: "/cancellations-refunds?tab=refunds" },
        ],
      },
      {
        title: "Partners & Referrals",
        href: "/partners",
        icon: Building2
        // subItems: [
        //   { title: "All Partners", href: "/partners" },
        //   { title: "Hospital Referrals", href: "/partners?type=Hospital" },
        //   { title: "Doctor Network", href: "/partners?type=Doctor" },
        //   { title: "Insurance & Corporate", href: "/partners?type=Insurance" },
        // ],
      },
      {
        title: "Reports & Analytics",
        href: "/revenue-reports",
        icon: BarChart3,
      },
      {
        title: "Settings & Roles",
        href: "/settings",
        icon: SlidersHorizontal
        // subItems: [
        //   { title: "Users & Roles", href: "/settings?tab=roles" },
        //   { title: "Service Catalogue", href: "/settings?tab=services" },
        //   { title: "Pricing Rules", href: "/settings?tab=pricing" },
        //   { title: "Coverage Locations", href: "/settings?tab=locations" },
        //   { title: "Audit Logs", href: "/settings?tab=audit" },
        // ],
      },
    ],
  },
  {
    groupName: "Content & Web",
    items: [
      {
        title: "CMS Management",
        href: "/cms",
        icon: FileCode,
      },
      {
        title: "Website Management",
        href: "/website/services",
        icon: Globe,
        subItems: [
          {
            title: "Careers Management",
            href: "/website/careers/jobs",
            subItems: [
              { title: "Job Management", href: "/website/careers/jobs" },
              { title: "Application Management", href: "/website/careers/applications" },
            ],
          },
          { title: "Service Management", href: "/website/services" },
          { title: "Enquiry Management", href: "/website/enquiries" },
          { title: "Blog/News Management", href: "/website/blogs" },
        ],
      },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu((prev) => (prev === title ? null : title));
  };

  const toggleNestedSubmenu = (title: string) => {
    setOpenNestedSubmenu((prev) => (prev === title ? null : title));
  };

  return (
    <nav className="flex-1 space-y-4 px-3 py-2">
      {navGroups.map((group, idx) => (
        <div key={idx} className="space-y-1">
          {!isCollapsed && group.groupName && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1">
              {group.groupName}
            </p>
          )}
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const hasChildren = Boolean(item.subItems && item.subItems.length > 0);
              const isChildOrNestedActive =
                item.subItems?.some(
                  (sub) =>
                    pathname === sub.href.split("?")[0] ||
                    sub.subItems?.some((n) => pathname === n.href.split("?")[0])
                ) ?? false;
              const isActive =
                pathname === item.href ||
                (item.href === "/dashboard" && pathname === "/") ||
                (item.href !== "/dashboard" && (pathname.startsWith(item.href) || isChildOrNestedActive));
              const isSubOpen = openSubmenu === item.title || (isActive && openSubmenu === null);

              const mainLink = (
                <div key={item.title}>
                  {hasChildren && !isCollapsed ? (
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={cn(
                        "w-full group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                        isActive
                          ? "bg-blue-50/90 font-semibold text-[#01265D] dark:bg-blue-950/70 dark:text-blue-200"
                          : "text-muted-foreground hover:bg-slate-100/70 hover:text-foreground dark:hover:bg-slate-800/60"
                      )}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive
                              ? "text-[#01265D] dark:text-blue-400"
                              : "text-muted-foreground/80 group-hover:text-foreground"
                          )}
                        />
                        <span className="truncate">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span
                            className={cn(
                              "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                              item.badgeColor || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isSubOpen ? (
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                        isActive
                          ? "bg-blue-50/90 font-semibold text-[#01265D] dark:bg-blue-950/70 dark:text-blue-200"
                          : "text-muted-foreground hover:bg-slate-100/70 hover:text-foreground dark:hover:bg-slate-800/60",
                        isCollapsed && "justify-center px-2 py-2.5"
                      )}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive
                              ? "text-[#01265D] dark:text-blue-400"
                              : "text-muted-foreground/80 group-hover:text-foreground"
                          )}
                        />
                        {!isCollapsed && <span className="truncate">{item.title}</span>}
                      </div>
                      {!isCollapsed && item.badge && (
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                            item.badgeColor || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Render Submenu items */}
                  {hasChildren && !isCollapsed && isSubOpen && (
                    <div className="ml-4 pl-2 border-l border-slate-200 dark:border-slate-800 my-1 space-y-0.5">
                      {item.subItems?.map((sub) => {
                        const hasNested = Boolean(sub.subItems && sub.subItems.length > 0);
                        const isNestedChildActive = sub.subItems?.some(
                          (nested) => pathname === nested.href.split("?")[0]
                        );
                        const isNestedOpen =
                          openNestedSubmenu === sub.title ||
                          (isNestedChildActive && openNestedSubmenu === null);

                        if (hasNested) {
                          return (
                            <div key={sub.title} className="space-y-0.5">
                              <button
                                onClick={() => toggleNestedSubmenu(sub.title)}
                                className={cn(
                                  "w-full flex items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors",
                                  isNestedChildActive
                                    ? "text-[#01265D] font-bold dark:text-blue-200"
                                    : "text-muted-foreground hover:text-foreground hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
                                )}
                              >
                                <span className="truncate">{sub.title}</span>
                                {isNestedOpen ? (
                                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                )}
                              </button>

                              {isNestedOpen && (
                                <div className="ml-3 pl-2 border-l border-slate-200 dark:border-slate-800 my-0.5 space-y-0.5">
                                  {sub.subItems?.map((nested) => {
                                    const isChildActive = pathname === nested.href.split("?")[0];
                                    return (
                                      <Link
                                        key={nested.title}
                                        href={nested.href}
                                        className={cn(
                                          "flex items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-slate-100/50 dark:hover:bg-slate-800/40",
                                          isChildActive && "text-[#01265D] font-semibold dark:text-blue-400"
                                        )}
                                      >
                                        <span className="truncate">{nested.title}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        }

                        const isChildActive = pathname === sub.href.split("?")[0];
                        return (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            className={cn(
                              "flex items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-slate-100/50 dark:hover:bg-slate-800/40",
                              isChildActive && "text-[#01265D] font-semibold dark:text-blue-400"
                            )}
                          >
                            <span className="truncate">{sub.title}</span>
                            {sub.badge && (
                              <span
                                className={cn(
                                  "text-[9px] font-bold px-1 py-0.2 rounded",
                                  sub.badgeColor || "bg-slate-100 text-slate-700"
                                )}
                              >
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.title}>
                    <TooltipTrigger>{mainLink}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium text-xs">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return mainLink;
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
