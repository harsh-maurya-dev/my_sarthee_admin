"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
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

export function ResetPasswordForm() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!newPassword || !confirmPassword) {
      const msg = "Please fill in both password fields.";
      setErrorMessage(msg);
      swiftAlert.error({ title: "Form Incomplete", description: msg });
      return;
    }

    if (newPassword.length < 8) {
      const msg = "Password must be at least 8 characters long.";
      setErrorMessage(msg);
      swiftAlert.warning({ title: "Weak Password", description: msg });
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = "Passwords do not match. Please verify.";
      setErrorMessage(msg);
      swiftAlert.error({ title: "Mismatch Error", description: msg });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate password update API
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSuccess(true);
      swiftAlert.success({
        title: "Password Updated",
        description: "Your administrator security credentials have been updated.",
      });
    } catch (error) {
      const msg = "Failed to reset password. Please try again.";
      setErrorMessage(msg);
      swiftAlert.error({ title: "Reset Failed", description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-slate-200/80 dark:border-slate-800">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Reset Password
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Enter your new security credentials for your administrator account
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSuccess ? (
          <div className="space-y-4 text-center py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                Password Reset Successfully!
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your administrator password has been updated. You can now log in using your new credentials.
              </p>
            </div>
            <div className="pt-2">
              <Button
                asChild
                className="w-full h-10 bg-teal-600 text-white font-semibold hover:bg-teal-700 dark:bg-teal-500"
              >
                <Link href="/login">
                  Proceed to Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
                {errorMessage}
              </div>
            )}

            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-xs font-semibold">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-9 pr-9 h-10 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 pr-9 h-10 text-sm"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-teal-600 text-white font-semibold hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center pt-0 pb-6 border-t border-slate-100 dark:border-slate-800 mt-4">
        <Link
          href="/login"
          className="mt-3 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          Cancel and return to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
