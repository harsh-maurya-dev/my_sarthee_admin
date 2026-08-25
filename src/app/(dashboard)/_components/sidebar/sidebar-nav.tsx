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
        icon: Users
        // badge: "142 Active"
        // subItems: [
        //   { title: "All Patients", href: "/patients" },
        //   { title: "Active Care", href: "/patients?tab=Active" },
        //   { title: "Completed Care", href: "/patients?tab=Completed" },
        //   { title: "High Risk Triage", href: "/patients?tab=Risk" },
        // ],
      },
      {
        title: "Bookings",
        href: "/bookings",
        icon: CalendarCheck2
        // badge: "7 Pending",
        // badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
        // subItems: [
        //   { title: "All Bookings", href: "/bookings" },
        //   { title: "New Bookings", href: "/bookings?tab=New" },
        //   { title: "Pending Assignment", href: "/bookings?tab=Pending Assignment" },
        //   { title: "Upcoming", href: "/bookings?tab=Upcoming" },
        //   { title: "Ongoing", href: "/bookings?tab=Ongoing" },
        //   { title: "Completed", href: "/bookings?tab=Completed" },
        //   { title: "Cancelled", href: "/bookings?tab=Cancelled" },
        // ],
      },
      {
        title: "Care Professionals",
        href: "/caregivers",
        icon: HeartPulse
        // subItems: [
        //   { title: "All Professionals", href: "/caregivers" },
        //   { title: "Nurses", href: "/caregivers?type=Nurse" },
        //   { title: "Caregivers", href: "/caregivers?type=Caregiver" },
        //   { title: "Physiotherapists", href: "/caregivers?type=Physiotherapist" },
        //   { title: "Availability Dashboard", href: "/caregivers?tab=availability" },
        // ],
      },
      {
        title: "Smart Assignment",
        href: "/smart-assignment",
        icon: Sparkles,
        badge: "AI Match",
        badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
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
        badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
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
      //   title: "Care Management",
      //   href: "/care-management",
      //   icon: HeartHandshake,
      //   // subItems: [
      //   //   { title: "Care Plans", href: "/care-management?tab=care-plans" },
      //   //   { title: "Today's Care Stream", href: "/care-management?tab=todays-care" },
      //   //   { title: "Visit Monitoring", href: "/care-management?tab=visits" },
      //   //   { title: "Care Progress", href: "/care-management?tab=progress" },
      //   // ],
      // },
      {
        title: "Escalations",
        href: "/escalations",
        icon: AlertOctagon
        // badge: "3 Critical",
        // badgeColor: "bg-rose-500 text-white animate-pulse",
        // subItems: [
        //   { title: "Critical Escalations", href: "/escalations?tab=Critical" },
        //   { title: "High Priority", href: "/escalations?tab=High" },
        //   { title: "Medium / Routine", href: "/escalations?tab=Medium" },
        //   { title: "Resolved Cases", href: "/escalations?tab=Resolved" },
        // ],
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
        badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
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
          // { title: "Invoices & Balance", href: "/payments?tab=invoices" },
          { title: "Transactions Log", href: "/transactions" },
          { title: "Caregiver Payouts", href: "/payouts" },
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
                          ? "bg-teal-50 font-semibold text-teal-950 dark:bg-teal-950/80 dark:text-teal-200"
                          : "text-muted-foreground hover:bg-slate-100/70 hover:text-foreground dark:hover:bg-slate-800/60"
                      )}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive
                              ? "text-teal-600 dark:text-teal-400"
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
                          ? "bg-teal-50 font-semibold text-teal-950 dark:bg-teal-950/80 dark:text-teal-200"
                          : "text-muted-foreground hover:bg-slate-100/70 hover:text-foreground dark:hover:bg-slate-800/60",
                        isCollapsed && "justify-center px-2 py-2.5"
                      )}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive
                              ? "text-teal-600 dark:text-teal-400"
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
                                    ? "text-teal-900 font-bold dark:text-teal-200"
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
                                          isChildActive && "text-teal-600 font-semibold dark:text-teal-400"
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
                              isChildActive && "text-teal-600 font-semibold dark:text-teal-400"
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
