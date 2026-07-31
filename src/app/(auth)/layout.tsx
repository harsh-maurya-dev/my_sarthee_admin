import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      {/* Background Subtle Gradient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Brand Header */}
      <Link href="/" className="relative z-10 mb-8 flex items-center gap-3 group">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border p-1.5 shadow-md group-hover:scale-105 transition-transform">
          <Image
            src="/logo/logo.svg"
            alt="MySarthee Logo"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-2xl tracking-tight text-foreground">
            MySarthee
          </span>
          <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
            HealthCare Admin Portal
          </span>
        </div>
      </Link>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>

      {/* Footer copyright */}
      <div className="relative z-10 mt-8 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MySarthee Enterprise. All rights reserved.</p>
      </div>
    </div>
  );
}
