import { Metadata } from "next";
import { ForgotPasswordForm } from "./_components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | MySarthee Admin",
  description: "Request a password reset link for your MySarthee admin account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
