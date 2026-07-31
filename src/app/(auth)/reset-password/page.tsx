import { Metadata } from "next";
import { ResetPasswordForm } from "./_components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | MySarthee Admin",
  description: "Set a new password for your MySarthee administrator account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
