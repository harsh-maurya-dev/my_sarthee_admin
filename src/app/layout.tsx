import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "MySarthee | HealthCare Admin & Management Portal",
  description: "Modern, scalable HealthCare Admin Panel built with Next.js App Router and Shadcn UI.",
  icons: {
    icon: "/logo/logo.svg",
    shortcut: "/logo/logo.svg",
    apple: "/logo/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <link rel="icon" href="/logo/logo.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-full flex flex-col bg-background dark:bg-slate-950 text-foreground tracking-tight">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster position="top-right" richColors />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
