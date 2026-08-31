"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { swiftAlert } from "@/lib/swift-alert";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      // Simulate sending password reset email
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
      swiftAlert.success({
        title: "Reset Link Dispatched",
        description: `Instructions sent to ${email}`,
      });
    } catch (error) {
      swiftAlert.error({
        title: "Dispatch Error",
        description: "Failed to send reset link. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-slate-200/80 dark:border-slate-800">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Forgot Password
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Enter your registered administrator email to receive a password reset link
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSubmitted ? (
          <div className="space-y-4 text-center py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                Reset Link Sent
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We have dispatched a password reset link to{" "}
                <span className="font-semibold text-foreground">{email}</span>.
                Please check your inbox.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/reset-password"
                className="inline-flex w-full h-10 items-center justify-center rounded-lg bg-[#01265D] text-white font-semibold text-sm hover:bg-[#0a3375] dark:bg-[#01265D]"
              >
                Simulate Opening Reset Link
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold">
                Registered Email ID
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@healthpulse.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-10 text-sm"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-[#01265D] text-white font-semibold hover:bg-[#0a3375] dark:bg-[#01265D] dark:hover:bg-[#01265D] mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                <>
                  Send Reset Link
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center pt-0 pb-6 border-t border-slate-100 dark:border-slate-800 mt-4">
        <Link
          href="/login"
          className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
