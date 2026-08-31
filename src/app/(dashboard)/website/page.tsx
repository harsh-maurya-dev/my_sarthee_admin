"use client";

import { useState } from "react";
import Link from "next/link";
import { WebsiteNavHeader } from "./_components/website-nav-header";
import {
  Globe,
  Briefcase,
  BookOpen,
  UserPlus,
  FileUser,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
  Users,
  Eye,
  Plus,
  RefreshCw,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { swiftAlert } from "@/lib/swift-alert";

export default function WebsiteManagementOverviewPage() {
  const modules = [
    {
      id: "jobs",
      title: "Job Management",
      category: "Careers Management",
      description: "Create, edit, and manage public job profiles, locations, descriptions, and active/inactive status.",
      href: "/website/careers/jobs",
      icon: UserPlus,
      badge: "6 Active Roles",
      badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
      accentColor: "border-sky-500/20 bg-sky-50/20 dark:bg-sky-950/10",
      itemsCount: "6 Openings",
      actionText: "Manage Jobs",
    },
    {
      id: "applications",
      title: "Application Management",
      category: "Careers Management",
      description: "Review incoming candidate applications, download resumes, shortlist candidates, or reject with a reason.",
      href: "/website/careers/applications",
      icon: FileUser,
      badge: "12 New Applicants",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
      accentColor: "border-amber-500/20 bg-amber-50/20 dark:bg-amber-950/10",
      itemsCount: "18 Applicants",
      actionText: "Manage Applications",
    },
    {
      id: "services",
      title: "Service Management",
      category: "Core Offerings",
      description: "Manage clinical services displayed on the corporate website, image banners, descriptions, and enable/disable toggle.",
      href: "/website/services",
      icon: Briefcase,
      badge: "6 Active Services",
      badgeColor: "bg-blue-100 dark:bg-blue-950/60 text-[#01265D] dark:text-blue-200 dark:bg-blue-950 dark:text-blue-300",
      accentColor: "border-[#01265D]/20 bg-blue-50/20 dark:bg-blue-950/20 dark:bg-blue-950/10",
      itemsCount: "6 Live",
      actionText: "Manage Services",
    },
    {
      id: "enquiries",
      title: "Enquiry Management",
      category: "Inbound Leads",
      description: "View submitted website contact forms, filter by date range & status, search messages, update notes, and delete.",
      href: "/website/enquiries",
      icon: MessageSquare,
      badge: "14 Pending Leads",
      badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
      accentColor: "border-rose-500/20 bg-rose-50/20 dark:bg-rose-950/10",
      itemsCount: "24 Enquiries",
      actionText: "Manage Enquiries",
    },
    {
      id: "blogs",
      title: "Blog/News Management",
      category: "Content & Guides",
      description: "Publish healthcare blogs, news articles, featured images, and publish/unpublish posts.",
      href: "/website/blogs",
      icon: BookOpen,
      badge: "8 Published",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
      accentColor: "border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10",
      itemsCount: "10 Total",
      actionText: "Manage Blog/News",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
              <Globe className="h-7 w-7 text-[#01265D] dark:text-blue-400" />
              Website Management
            </h1>
            <Badge className="bg-[#01265D] text-white font-semibold text-xs">
              Live & Public
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Central command center to manage public services, post careers & review applications, publish blogs/news, and track website enquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              swiftAlert.success({
                title: "Cache Purged",
                description: "Website CDN cache refreshed. Public website updated with latest changes.",
              })
            }
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sync Web Cache</span>
          </Button>

          <Button
            size="sm"
            onClick={() => window.open("https://mysarthee.care", "_blank")}
            className="h-9 gap-1.5 bg-[#01265D] hover:bg-[#0a3375] text-white text-xs font-semibold shadow-xs"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Live Site</span>
          </Button>
        </div>
      </div>

      {/* Nav Header */}
      {/* <WebsiteNavHeader /> */}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Active Public Services</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">6 Services</h3>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              100% Online & Bookable
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/60 dark:bg-blue-950/60 text-[#01265D] dark:text-blue-400 flex items-center justify-center">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Published Blog/News</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">8 Articles</h3>
            <p className="text-[10px] text-[#01265D] dark:text-blue-400 font-semibold mt-0.5">
              45.2k Monthly Readers
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Active Job Postings</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">6 Openings</h3>
            <p className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold mt-0.5">
              18 Total Applicants
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
            <UserPlus className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Inbound Enquiries</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">24 Total</h3>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
              14 Pending Triage (96% SLA)
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground">Website Management Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className={`rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between ${mod.accentColor} bg-card`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-background border flex items-center justify-center shadow-2xs">
                      <Icon className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    {mod.category}
                  </span>
                  <h3 className="text-base font-bold text-foreground mt-0.5">{mod.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground font-mono">
                    {mod.itemsCount}
                  </span>
                  <Link href={mod.href}>
                    <Button
                      size="sm"
                      className="h-8 text-xs font-bold gap-1 bg-[#01265D] hover:bg-[#0a3375] text-white shadow-2xs"
                    >
                      <span>{mod.actionText}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
