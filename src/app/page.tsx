import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  Video,
  FileText,
  FlaskConical,
  Pill,
  Calendar,
  CreditCard,
  Ambulance,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Users,
  Activity,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "MySarthee | Enterprise HealthCare Services & Admin Portal",
  description: "Explore all healthcare services offered by MySarthee, including EHR, Telehealth, Diagnostics, and Admin Management.",
};

const healthcareServices = [
  {
    title: "Telehealth & Virtual Consultations",
    description: "High-definition video consultations, real-time doctor queuing, and instant digital prescription dispatching.",
    icon: Video,
    badge: "24/7 Available",
  },
  {
    title: "Electronic Health Records (EHR)",
    description: "HIPAA-compliant centralized patient medical histories, clinical notes, lab results, and ICD-10 diagnostic coding.",
    icon: FileText,
    badge: "HIPAA Certified",
  },
  {
    title: "Pathology & Lab Diagnostics",
    description: "Automated specimen tracking, digital lab report generation, and direct patient portal result delivery.",
    icon: FlaskConical,
    badge: "Automated Workflow",
  },
  {
    title: "Pharmacy & Inventory Suite",
    description: "Real-time pharmaceutical stock monitoring, batch expiration tracking, e-prescriptions, and automated reordering.",
    icon: Pill,
    badge: "Smart Inventory",
  },
  {
    title: "Patient Appointment Scheduling",
    description: "Multi-specialty doctor booking engine with automated SMS/email appointment reminders and queue management.",
    icon: Calendar,
    badge: "Patient-Centric",
  },
  {
    title: "Medical Billing & Revenue Cycle",
    description: "Streamlined insurance claims management, automated copay invoicing, and financial revenue analytics.",
    icon: CreditCard,
    badge: "Financial Control",
  },
  {
    title: "Emergency & Critical Triage",
    description: "Instant ambulance GPS dispatch tracking, emergency room occupancy monitoring, and real-time vital alerts.",
    icon: Ambulance,
    badge: "Real-time Triage",
  },
  {
    title: "Clinical Staff & Roster Management",
    description: "Doctor shift scheduling, credential verification, department duty rosters, and clinical performance tracking.",
    icon: Stethoscope,
    badge: "Operations",
  },
];

const metrics = [
  { value: "99.99%", label: "System Reliability & Uptime", icon: Activity },
  { value: "2.8M+", label: "Patient Records Secured", icon: Users },
  { value: "180+", label: "Hospital & Clinic Networks", icon: Building2 },
  { value: "100%", label: "HIPAA & ISO 27001 Compliant", icon: ShieldCheck },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-foreground selection:bg-[#01265D] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 p-1 shadow-md group-hover:scale-105 transition-transform">
              <Image
                src="/logo/logo.svg"
                alt="MySarthee Logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-[#01265D] dark:text-white">
                MySarthee
              </span>
              <span className="text-[10px] font-semibold text-[#01265D]/80 dark:text-blue-400 -mt-1">
                HealthCare Portal
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#services" className="hover:text-[#01265D] dark:hover:text-blue-400 transition-colors">
              Healthcare Services
            </a>
            <a href="#solutions" className="hover:text-[#01265D] dark:hover:text-blue-400 transition-colors">
              Enterprise Solutions
            </a>
            <a href="#compliance" className="hover:text-[#01265D] dark:hover:text-blue-400 transition-colors">
              Compliance & Security
            </a>
          </nav>

          {/* Admin Login CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex h-9 px-4 items-center justify-center rounded-lg bg-[#01265D] text-white text-xs font-semibold hover:bg-[#0a3375] shadow-xs gap-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-[#01265D] dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300 mb-6">
            <Image src="/logo/logo.svg" alt="MySarthee" width={16} height={16} className="h-4 w-4" unoptimized />
            <span>Next-Gen Enterprise HealthCare Platform</span>
          </div>

          <h1 className="max-w-4xl mx-auto text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-[1.15]">
            Unified Healthcare Operations & Intelligent Patient Care Services
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
            MySarthee provides a comprehensive ecosystem for healthcare providers, administrators, and clinical staff to deliver superior care and streamline administrative operations.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex h-11 px-6 items-center justify-center rounded-lg bg-[#01265D] text-white text-sm font-semibold hover:bg-[#0a3375] shadow-md shadow-[#01265D]/20 gap-2 w-full sm:w-auto"
            >
              <span>Access Admin Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#services"
              className="inline-flex h-11 px-6 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-800 text-sm font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-900 w-full sm:w-auto"
            >
              <span>Explore Healthcare Services</span>
            </a>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="border-y bg-background py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {metrics.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-center p-3">
                  <Icon className="h-6 w-6 text-[#01265D] dark:text-blue-400 mb-2" />
                  <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {item.value}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 font-medium">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Offered Services Section */}
      <section id="services" className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Comprehensive HealthCare Services Offered
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Explore the full suite of clinical, diagnostic, and administrative healthcare solutions available across our network.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {healthcareServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <Card
                  key={idx}
                  className="group relative overflow-hidden transition-all duration-300 hover:border-[#01265D]/50 hover:shadow-lg hover:-translate-y-1 bg-card border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
                >
                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#01265D] dark:bg-blue-950/80 dark:text-blue-300 group-hover:bg-[#01265D] group-hover:text-white transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-muted-foreground">
                        {service.badge}
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance & Security Banner */}
      <section id="compliance" className="bg-[#01265D] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Enterprise Standards & Security
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Built to Meet Global Medical Compliance Requirements
              </h3>
              <p className="text-sm text-blue-100/80 leading-relaxed">
                MySarthee ensures strict adherence to HIPAA, GDPR medical privacy standards, end-to-end data encryption, and role-based access control for administrative users.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 shrink-0">
              <div className="flex items-center gap-2 rounded-xl bg-[#0a3375]/90 px-4 py-3 border border-blue-400/30">
                <CheckCircle2 className="h-5 w-5 text-amber-400" />
                <span className="text-xs font-semibold">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-[#0a3375]/90 px-4 py-3 border border-blue-400/30">
                <CheckCircle2 className="h-5 w-5 text-amber-400" />
                <span className="text-xs font-semibold">256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-[#0a3375]/90 px-4 py-3 border border-blue-400/30">
                <CheckCircle2 className="h-5 w-5 text-amber-400" />
                <span className="text-xs font-semibold">HL7 / FHIR Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t bg-background py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 p-1">
                <Image src="/logo/logo.svg" alt="MySarthee Logo" width={24} height={24} className="h-5 w-5" unoptimized />
              </div>
              <span className="font-extrabold text-sm text-foreground">
                MySarthee HealthCare Solutions
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link href="/login" className="hover:text-foreground font-semibold text-[#01265D] dark:text-blue-400">
                Admin Portal Login
              </Link>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MySarthee Enterprise. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
