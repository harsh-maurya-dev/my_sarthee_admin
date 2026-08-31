"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AdminNotification, initialNotifications } from "./_data/notifications";
import { NotificationViewModal } from "./_components/notification-view-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Eye,
  Radio,
  Plus,
  ShieldCheck,
  CheckCheck,
  Send,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<"All" | "New Booking" | "Assignment Pending" | "Visit Alert" | "Complaint Alert">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedNotif, setSelectedNotif] = useState<AdminNotification | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Filtered
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        n.id.toLowerCase().includes(q) ||
        n.referenceId.toLowerCase().includes(q);

      const matchesTab = activeTab === "All" || n.category === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [notifications, searchQuery, activeTab]);

  const unreadCount = notifications.filter((n) => n.status === "Unread").length;
  const criticalCount = notifications.filter((n) => n.priority === "Critical" && n.status === "Unread").length;

  const handleOpenView = (notif: AdminNotification) => {
    setSelectedNotif(notif);
    setIsViewOpen(true);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "Read" } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, status: "Read" })));
    swiftAlert.success({
      title: "All Notifications Marked Read",
      description: "All inbox notification items marked as read.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <Bell className="h-7 w-7 text-[#01265D] dark:text-blue-400" />
            System Notification Console
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time alerts for New Bookings, Assignment Pending, Visit GPS Alerts, and Patient Complaints.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/push-notifications">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 text-xs font-semibold"
            >
              <Send className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
              <span>Compose Push Broadcast</span>
            </Button>
          </Link>
          {unreadCount > 0 && (
            <Button
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-9 gap-2 bg-[#01265D] text-white hover:bg-[#0a3375] text-xs font-semibold shadow-xs"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark All as Read</span>
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Unread Notifications</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1 flex items-center gap-2">
              {unreadCount}
              {unreadCount > 0 && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#01265D]"></span>
                </span>
              )}
            </h3>
            <p className="text-[10px] text-[#01265D] dark:text-blue-400 font-semibold mt-0.5">Awaiting Admin Action</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/60 dark:bg-blue-950 text-[#01265D] dark:text-blue-400 flex items-center justify-center">
            <Bell className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Critical Geofence Alerts</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{criticalCount}</h3>
            <p className="text-[10px] text-rose-600 font-semibold mt-0.5">Requires Immediate Attention</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Notifications Logged</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{notifications.length}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Live Stream Synchronized</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("All")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative shrink-0 ${
            activeTab === "All"
              ? "text-[#01265D] dark:text-blue-400 border-b-2 border-[#01265D] dark:border-blue-800"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>All Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab("New Booking")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative shrink-0 ${
            activeTab === "New Booking"
              ? "text-[#01265D] dark:text-blue-400 border-b-2 border-[#01265D] dark:border-blue-800"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>New Bookings</span>
        </button>

        <button
          onClick={() => setActiveTab("Assignment Pending")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative shrink-0 ${
            activeTab === "Assignment Pending"
              ? "text-[#01265D] dark:text-blue-400 border-b-2 border-[#01265D] dark:border-blue-800"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Assignment Pending</span>
        </button>

        <button
          onClick={() => setActiveTab("Visit Alert")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative shrink-0 ${
            activeTab === "Visit Alert"
              ? "text-[#01265D] dark:text-blue-400 border-b-2 border-[#01265D] dark:border-blue-800"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Radio className="h-4 w-4 text-rose-500" />
          <span>Visit Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab("Complaint Alert")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative shrink-0 ${
            activeTab === "Complaint Alert"
              ? "text-[#01265D] dark:text-blue-400 border-b-2 border-[#01265D] dark:border-blue-800"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span>Complaint Alerts</span>
        </button>
      </div>

      {/* Notifications List Console */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground border rounded-2xl bg-card">
            No notifications found matching your selection.
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isUnread = notif.status === "Unread";

            return (
              <div
                key={notif.id}
                onClick={() => handleOpenView(notif)}
                className={`rounded-2xl border p-4 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isUnread
                    ? "bg-blue-50 dark:bg-blue-950/40/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 ring-1 ring-[#01265D]/20 shadow-xs"
                    : "bg-card hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      notif.priority === "Critical"
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
                        : notif.priority === "Urgent"
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                        : "bg-blue-100 dark:bg-blue-950/60 text-[#01265D] dark:text-blue-400 dark:bg-blue-950 dark:text-blue-400"
                    }`}
                  >
                    {notif.priority === "Critical" ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <Bell className="h-5 w-5" />
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold text-sm ${isUnread ? "text-foreground" : "text-slate-700 dark:text-slate-300"}`}>
                        {notif.title}
                      </h4>
                      {isUnread && (
                        <span className="h-2 w-2 rounded-full bg-[#01265D] animate-pulse" />
                      )}
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {notif.category}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{notif.message}</p>

                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono pt-1">
                      <span>Ref: {notif.referenceId}</span>
                      <span>•</span>
                      <span>{notif.timestamp}</span>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenView(notif);
                  }}
                  className="h-8 text-xs gap-1 border-slate-200 shrink-0"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View</span>
                </Button>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <NotificationViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        notification={selectedNotif}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  );
}
