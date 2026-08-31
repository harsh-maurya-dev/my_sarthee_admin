"use client";

import { useState } from "react";
import {
  initialPatients360,
  CommunicationTouchpoint,
} from "@/lib/admin-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquareText,
  Send,
  Phone,
  Bell,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Users,
  HeartPulse,
  Sparkles,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function CommunicationHubPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatients360[0].id);
  const [channel, setChannel] = useState<"WhatsApp" | "SMS" | "Push Notification">("WhatsApp");
  const [touchpointType, setTouchpointType] = useState<string>("Booking confirmation sent");
  const [messageContent, setMessageContent] = useState("");

  const selectedPatient = initialPatients360.find((p) => p.id === selectedPatientId) || initialPatients360[0];

  const handleSendManualMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    swiftAlert.success({
      title: `${channel} Sent Successfully`,
      description: `Dispatched to ${selectedPatient.primaryContactName} (${selectedPatient.primaryContactPhone}).`,
    });

    setMessageContent("");
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Family & Customer Communication Hub
            </h1>
            <Badge className="bg-[#01265D] text-white font-semibold text-xs">
              WhatsApp & SMS Gateway
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Omnichannel customer communication logs and automated lifecycle triggers (Confirmations, Check-ins, Reminders, Feedback).
          </p>
        </div>
      </div>

      {/* Grid: Left Patient Selector & Dispatcher, Right Touchpoint Log */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Instant Family Dispatcher */}
        <div className="lg:col-span-5 rounded-2xl border bg-card p-5.5 shadow-xs space-y-5">
          <div className="border-b pb-3">
            <h2 className="text-sm font-extrabold text-foreground">Direct Family Messaging Dispatcher</h2>
            <p className="text-xs text-muted-foreground">Trigger manual or template-based communications</p>
          </div>

          <form onSubmit={handleSendManualMessage} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Select Patient / Family:</label>
              <Select value={selectedPatientId} onValueChange={(val) => val && setSelectedPatientId(val)}>
                <SelectTrigger className="w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {initialPatients360.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.fullName} ({p.patientId}) – {p.primaryContactName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Delivery Channel:</label>
              <div className="grid grid-cols-3 gap-2">
                {["WhatsApp", "SMS", "Push Notification"].map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannel(ch as any)}
                    className={`rounded-lg py-2 text-xs font-bold transition-all border ${
                      channel === ch
                        ? "bg-[#01265D] text-white border-blue-200 shadow-xs"
                        : "bg-slate-50 text-muted-foreground hover:bg-slate-100 dark:bg-slate-900"
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Lifecycle Trigger Event:</label>
              <Select value={touchpointType} onValueChange={(val) => val && setTouchpointType(val)}>
                <SelectTrigger className="w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Booking confirmation sent">Booking confirmation sent</SelectItem>
                  <SelectItem value="Caregiver assigned">Caregiver assigned</SelectItem>
                  <SelectItem value="Care started">Care started</SelectItem>
                  <SelectItem value="Visit completed">Visit completed</SelectItem>
                  <SelectItem value="Care plan changed">Care plan changed</SelectItem>
                  <SelectItem value="Payment reminder sent">Payment reminder sent</SelectItem>
                  <SelectItem value="Feedback requested">Feedback requested</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Message Body / Template:</label>
              <Textarea
                placeholder="Enter custom text or leave for template auto-population..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="text-xs min-h-[90px]"
              />
            </div>

            <Button type="submit" className="w-full bg-[#01265D] hover:bg-[#0a3375] text-white font-bold text-xs gap-1.5 shadow-sm">
              <Send className="h-3.5 w-3.5" />
              Dispatch {channel} to {selectedPatient.primaryContactPhone}
            </Button>
          </form>
        </div>

        {/* Right Column: Communication Touchpoints History */}
        <div className="lg:col-span-7 rounded-2xl border bg-card p-5.5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-foreground">
                Touchpoint Audit History for {selectedPatient.fullName}
              </h2>
              <p className="text-xs text-muted-foreground">
                Primary: {selectedPatient.primaryContactName} ({selectedPatient.primaryContactPhone})
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono font-bold">
              {selectedPatient.patientId}
            </Badge>
          </div>

          <div className="space-y-3">
            {selectedPatient.communicationHistory.map((comm) => (
              <div
                key={comm.id}
                className="rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40 p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        comm.channel === "WhatsApp"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-sky-100 text-sky-800"
                      }
                    >
                      {comm.channel}
                    </Badge>
                    <span className="text-xs font-bold text-foreground">{comm.type}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{comm.timestamp}</span>
                </div>

                <p className="text-xs text-muted-foreground leading-snug">{comm.summary}</p>

                <div className="pt-1 flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Sender: {comm.sender}</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {comm.deliveryStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
