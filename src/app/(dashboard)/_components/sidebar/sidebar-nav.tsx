"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  HeartPulse,
  Sparkles,
  Calendar,
  Eye,
  FileText,
  ShieldCheck,
  TrendingUp,
  Target,
  Bell,
  CreditCard,
  Receipt,
  Image,
  Send,
  Globe,
  FileCode,
  BriefcaseBusiness,
  FileSearch,
  BookOpen,
  UserCog,
  ChevronDown,
  ChevronRight,
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
  subItems?: SubNavItem[];
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  subItems?: SubNavItem[];
}

export interface NavGroup {
  // groupName: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    // groupName: "Main Operations",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Patient Management", href: "/patients", icon: Users },
      { title: "Service Management", href: "/services", icon: Briefcase },
      { title: "Care giver Management", href: "/caregivers", icon: HeartPulse },
    ],
  },
  {
    // groupName: "Clinical & Care",
    items: [
      { title: "Smart Assignment", href: "/smart-assignment", icon: Sparkles },
      { title: "Scheduling", href: "/scheduling", icon: Calendar },
      { title: "Visit Monitoring", href: "/visit-monitoring", icon: Eye },
      { title: "Health Report", href: "/health-report", icon: FileText },
      { title: "Quality Management", href: "/quality-management", icon: ShieldCheck },
    ],
  },
  {
    // groupName: "Finance & CRM",
    items: [
      { title: "Revenue & Report Management", href: "/revenue-reports", icon: TrendingUp },
      { title: "CRM & Lead Management", href: "/crm-leads", icon: Target },
      { title: "Transaction Management", href: "/transactions", icon: CreditCard },
      { title: "Payout Management", href: "/payouts", icon: Receipt },
    ],
  },
  {
    // groupName: "Notifications & Banners",
    items: [
      { title: "Notification", href: "/notifications", icon: Bell },
      { title: "Static Banner Management", href: "/banners", icon: Image },
      { title: "Push Notification Management", href: "/push-notifications", icon: Send },
    ],
  },
  {
    // groupName: "Website & Content",
    items: [
      {
        title: "Website Management",
        href: "/website",
        icon: Globe,
        subItems: [
          {
            title: "Careers Management",
            href: "/website/careers",
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
      {
        title: "CMS Management",
        href: "/cms",
        icon: FileCode,
        subItems: [
          { title: "Why MySarthee", href: "/cms?tab=why-mysarthee" },
          { title: "Join as Caregiver", href: "/cms?tab=join-as-caregiver" },
          { title: "Contact Us", href: "/cms?tab=contact-us" },
          { title: "Privacy Policy", href: "/cms?tab=privacy-policy" },
          { title: "Terms & Conditions", href: "/cms?tab=terms-conditions" },
          { title: "About Us", href: "/cms?tab=about-us" },
          { title: "FAQs", href: "/cms?tab=faqs" },
        ],
      },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>("Website Management");
  const [openCareers, setOpenCareers] = useState<boolean>(true);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu((prev) => (prev === title ? null : title));
  };

  return (
    <nav className="flex-1 space-y-4 px-3 py-2 ">
      {navGroups.map((group, idx) => (
        <div key={idx} className="space-y-1">
          {/* {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1">
              {group.groupName}
            </p>
          )} */}
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const hasChildren = Boolean(item.subItems && item.subItems.length > 0);
              const isSubOpen = openSubmenu === item.title;
              const isActive =
                pathname === item.href ||
                (item.href === "/dashboard" && (pathname === "/" || pathname === "/crm")) ||
                (hasChildren && pathname.startsWith(item.href));

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
                        <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-teal-600 dark:text-teal-400" : "text-muted-foreground/80")} />
                        <span className="truncate">{item.title}</span>
                      </div>
                      {isSubOpen ? (
                        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      )}
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
                        <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-teal-600 dark:text-teal-400" : "text-muted-foreground/80 group-hover:text-foreground")} />
                        {!isCollapsed && <span className="truncate">{item.title}</span>}
                      </div>
                    </Link>
                  )}

                  {/* Render Submenu items */}
                  {hasChildren && !isCollapsed && isSubOpen && (
                    <div className="ml-4 pl-2 border-l border-slate-200 dark:border-slate-800 my-1 space-y-0.5">
                      {item.subItems?.map((sub) => {
                        const hasNested = Boolean(sub.subItems && sub.subItems.length > 0);
                        const isChildActive = pathname.startsWith(sub.href);

                        if (hasNested) {
                          return (
                            <div key={sub.title} className="space-y-0.5">
                              <button
                                onClick={() => setOpenCareers((prev) => !prev)}
                                className={cn(
                                  "w-full flex items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-slate-100/50 dark:hover:bg-slate-800/40",
                                  isChildActive && "text-teal-700 font-semibold dark:text-teal-300"
                                )}
                              >
                                <span className="truncate">{sub.title}</span>
                                {openCareers ? (
                                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                )}
                              </button>
                              {openCareers && (
                                <div className="ml-3 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-0.5">
                                  {sub.subItems?.map((nested) => (
                                    <Link
                                      key={nested.title}
                                      href={nested.href}
                                      className={cn(
                                        "block rounded-md px-2 py-1 text-[11px] font-normal transition-colors text-muted-foreground hover:text-foreground",
                                        pathname === nested.href && "text-teal-600 font-semibold dark:text-teal-400"
                                      )}
                                    >
                                      {nested.title}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            className={cn(
                              "block rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-slate-100/50 dark:hover:bg-slate-800/40",
                              pathname === sub.href && "text-teal-600 font-semibold dark:text-teal-400"
                            )}
                          >
                            {sub.title}
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
