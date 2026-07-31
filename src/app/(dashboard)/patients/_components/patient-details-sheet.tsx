"use client";

import { useState } from "react";
import { Patient, CarePlanTask, ServiceHistoryItem } from "../_data/patients";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Activity,
  Stethoscope,
  ClipboardList,
  History,
  FileCheck,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  ShieldAlert,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface PatientDetailsSheetProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePatient: (updatedPatient: Patient) => void;
}

export function PatientDetailsSheet({
  patient,
  isOpen,
  onClose,
  onUpdatePatient,
}: PatientDetailsSheetProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // New task state for Care Plan manager
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskFreq, setNewTaskFreq] = useState("Daily");
  const [newTaskTime, setNewTaskTime] = useState("09:00 AM");

  if (!patient) return null;

  // Toggle Care Plan task completion
  const handleToggleTask = (taskId: string) => {
    if (!patient.carePlan) return;
    const updatedTasks = patient.carePlan.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const updatedPatient: Patient = {
      ...patient,
      carePlan: {
        ...patient.carePlan,
        tasks: updatedTasks,
      },
    };
    onUpdatePatient(updatedPatient);
    swiftAlert.success({
      title: "Care Task Updated",
      description: "Task completion status updated.",
    });
  };

  // Add new task to Care Plan
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName) return;

    const newTask: CarePlanTask = {
      id: `task-${Date.now()}`,
      taskName: newTaskName,
      frequency: newTaskFreq,
      timeSlot: newTaskTime,
      completed: false,
    };

    const currentPlan = patient.carePlan || {
      id: `CP-${Date.now()}`,
      planTitle: `${patient.fullName}'s Care Plan`,
      goals: "Daily Health & Vital Monitoring",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-12-31",
      status: "Active",
      tasks: [],
    };

    const updatedPatient: Patient = {
      ...patient,
      carePlan: {
        ...currentPlan,
        tasks: [...currentPlan.tasks, newTask],
      },
    };

    onUpdatePatient(updatedPatient);
    setNewTaskName("");
    swiftAlert.success({
      title: "Care Plan Updated",
      description: `Added "${newTaskName}" to Care Plan.`,
    });
  };

  const getStatusBadge = (status: Patient["status"]) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-600 text-white">Active</Badge>;
      case "Inactive":
        return <Badge variant="secondary" className="bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Inactive</Badge>;
      case "Blocked":
        return <Badge variant="destructive" className="bg-rose-600 text-white">Blocked</Badge>;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* 70% Screen Width Sheet Content */}
      <SheetContent className="w-full sm:w-[70vw] sm:max-w-[70vw] lg:max-w-[70vw] p-0 flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <SheetHeader className="p-6 border-b bg-slate-50 dark:bg-slate-900/60 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusBadge(patient.status)}
              <span className="text-xs font-mono text-muted-foreground">{patient.id}</span>
            </div>
            <span className="text-xs font-medium text-teal-600 dark:text-teal-400">
              Registration Date: {patient.registrationDate}
            </span>
          </div>
          <div className="flex items-center gap-5 pt-3">
            <Avatar className="h-16 w-16 border-2 border-teal-600 shadow-sm">
              <AvatarImage
                src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`}
                alt={patient.fullName}
              />
              <AvatarFallback className="font-bold text-xl bg-teal-100 text-teal-800">
                {patient.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-2xl font-bold">{patient.fullName}</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-1">
                {patient.age} yrs · {patient.gender} · DOB: {patient.dateOfBirth} · Contact: {patient.phoneNumber}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 border-b bg-background">
            <TabsList className="h-12 bg-transparent p-0 gap-6">
              <TabsTrigger
                value="overview"
                className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 data-[state=active]:shadow-none rounded-none py-3 px-1"
              >
                Overview & Vitals
              </TabsTrigger>
              <TabsTrigger
                value="requirements"
                className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 data-[state=active]:shadow-none rounded-none py-3 px-1"
              >
                Care Requirement
              </TabsTrigger>
              <TabsTrigger
                value="careplan"
                className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 data-[state=active]:shadow-none rounded-none py-3 px-1"
              >
                Care Plan Manager
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 data-[state=active]:shadow-none rounded-none py-3 px-1"
              >
                Service History
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: OVERVIEW & VITALS */}
          <TabsContent value="overview" className="flex-1 overflow-y-auto p-6 space-y-6 m-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact & Location Card */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Contact Information
                </h3>
                <div className="space-y-3 rounded-xl border p-4 bg-card">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-teal-600 shrink-0" />
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Phone Number</span>
                      <span className="font-semibold text-foreground text-sm">{patient.phoneNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t">
                    <MapPin className="h-4 w-4 text-teal-600 shrink-0" />
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Address / Location</span>
                      <span className="font-semibold text-foreground text-sm">{patient.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Details Card */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Clinical Summary
                </h3>
                <div className="space-y-3 rounded-xl border p-4 bg-card text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Medical Condition:</span>
                    <span className="font-bold text-teal-700 dark:text-teal-400 text-sm">
                      {patient.medicalCondition}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-muted-foreground">Blood Group:</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {patient.bloodGroup || "O+"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-muted-foreground">Assigned Caregiver:</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
                      {patient.assignedCaregiver || "Dr. Sarah Jenkins"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-muted-foreground">Emergency Contact:</span>
                    <span className="font-medium text-foreground text-xs">
                      {patient.emergencyContact || "Not listed"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Telemetry Vitals Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Real-Time Patient Vitals</span>
                <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border p-4 bg-slate-50/60 dark:bg-slate-900/60 text-center space-y-1">
                  <Heart className="h-5 w-5 text-rose-500 mx-auto mb-1 animate-pulse" />
                  <span className="text-[11px] text-muted-foreground block">Heart Rate</span>
                  <span className="text-lg font-extrabold text-foreground">
                    {patient.vitals?.heartRate || "72 bpm"}
                  </span>
                </div>
                <div className="rounded-xl border p-4 bg-slate-50/60 dark:bg-slate-900/60 text-center space-y-1">
                  <Activity className="h-5 w-5 text-sky-500 mx-auto mb-1" />
                  <span className="text-[11px] text-muted-foreground block">Blood Pressure</span>
                  <span className="text-lg font-extrabold text-foreground">
                    {patient.vitals?.bloodPressure || "120/80 mmHg"}
                  </span>
                </div>
                <div className="rounded-xl border p-4 bg-slate-50/60 dark:bg-slate-900/60 text-center space-y-1">
                  <ShieldAlert className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                  <span className="text-[11px] text-muted-foreground block">Oxygen (SpO2)</span>
                  <span className="text-lg font-extrabold text-foreground">
                    {patient.vitals?.oxygenLevel || "98%"}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: CARE REQUIREMENT */}
          <TabsContent value="requirements" className="flex-1 overflow-y-auto p-6 space-y-4 m-0">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-teal-600" />
                Submitted Care Requirements
              </h3>
              <Badge variant="outline" className="text-xs">User Submitted</Badge>
            </div>

            {patient.careRequirements ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border p-4 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Health & Diagnosis Summary
                  </span>
                  <p className="text-foreground text-xs leading-relaxed">
                    {patient.careRequirements.healthCondition}
                  </p>
                </div>

                <div className="rounded-xl border p-4 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Mobility & Physical Assistance
                  </span>
                  <p className="text-foreground text-xs leading-relaxed">
                    {patient.careRequirements.mobilityNeeds}
                  </p>
                </div>

                <div className="rounded-xl border p-4 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Dietary Requirements
                  </span>
                  <p className="text-foreground text-xs leading-relaxed">
                    {patient.careRequirements.dietaryRequirements}
                  </p>
                </div>

                <div className="rounded-xl border p-4 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Medication Support
                  </span>
                  <p className="text-foreground text-xs leading-relaxed">
                    {patient.careRequirements.medicationAssistance}
                  </p>
                </div>

                <div className="md:col-span-2 rounded-xl border border-teal-200/80 bg-teal-50/40 dark:bg-teal-950/20 p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-900 dark:text-teal-200">
                    Special Medical Instructions
                  </span>
                  <p className="text-foreground text-xs leading-relaxed">
                    {patient.careRequirements.specialInstructions}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-xs">
                No care requirements submitted for this patient yet.
              </div>
            )}
          </TabsContent>

          {/* TAB 3: CARE PLAN MANAGER */}
          <TabsContent value="careplan" className="flex-1 overflow-y-auto p-6 space-y-6 m-0">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-teal-600" />
                  Manage Patient Care Plan
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Create, assign, and track patient care plan tasks.
                </p>
              </div>
              {patient.carePlan && (
                <Badge className="bg-teal-600 text-white text-xs">
                  {patient.carePlan.status} Plan
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tasks List */}
              <div className="lg:col-span-2 space-y-4">
                {patient.carePlan ? (
                  <div className="space-y-4">
                    <div className="rounded-xl border p-4 bg-slate-50/80 dark:bg-slate-900/50 space-y-2 text-xs">
                      <h4 className="font-bold text-foreground text-sm">
                        {patient.carePlan.planTitle}
                      </h4>
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">Goals:</strong> {patient.carePlan.goals}
                      </p>
                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-2 border-t">
                        <span>Start: {patient.carePlan.startDate}</span>
                        <span>Target End: {patient.carePlan.endDate}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Care Tasks & Schedule
                      </h4>
                      <div className="space-y-2">
                        {patient.carePlan.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between rounded-xl border p-3.5 bg-card hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={task.id}
                                checked={task.completed}
                                onCheckedChange={() => handleToggleTask(task.id)}
                              />
                              <label
                                htmlFor={task.id}
                                className={`text-xs font-semibold cursor-pointer ${
                                  task.completed ? "line-through text-muted-foreground" : "text-foreground"
                                }`}
                              >
                                {task.taskName}
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px]">
                                {task.frequency}
                              </Badge>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {task.timeSlot}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-xs">
                    No care plan currently active for this patient.
                  </div>
                )}
              </div>

              {/* Add New Task Sidebar Form */}
              <form onSubmit={handleAddTask} className="rounded-xl border p-4 bg-slate-50 dark:bg-slate-900/60 space-y-3 h-fit">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5 text-teal-600" />
                  Add Task to Care Plan
                </h4>
                <div className="space-y-2.5">
                  <Input
                    placeholder="Task Name (e.g. Blood Sugar Check)"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    className="h-8 text-xs bg-background"
                    required
                  />
                  <Input
                    placeholder="Frequency (Daily, 3x/Week)"
                    value={newTaskFreq}
                    onChange={(e) => setNewTaskFreq(e.target.value)}
                    className="h-8 text-xs bg-background"
                  />
                  <Input
                    placeholder="Time Slot (09:00 AM)"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="h-8 text-xs bg-background"
                  />
                  <Button type="submit" size="sm" className="w-full h-8 text-xs bg-teal-600 text-white font-semibold">
                    Add Care Task
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>

          {/* TAB 4: SERVICE HISTORY */}
          <TabsContent value="history" className="flex-1 overflow-y-auto p-6 space-y-4 m-0">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-teal-600" />
                Patient Service History
              </h3>
              <span className="text-xs text-muted-foreground font-medium">
                {patient.serviceHistory?.length || 0} Total Records
              </span>
            </div>

            {patient.serviceHistory && patient.serviceHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patient.serviceHistory.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border p-4 bg-card space-y-2 hover:shadow-xs transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        {item.serviceName}
                      </span>
                      <Badge className="bg-emerald-600 text-white text-[10px]">
                        {item.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-teal-600" />
                        <span>Date: {item.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
                        <span>Caregiver: {item.caregiverName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-teal-600" />
                        <span>Duration: {item.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-foreground">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Cost: {item.cost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-xs font-medium">
                No past service history logs found for this patient.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
