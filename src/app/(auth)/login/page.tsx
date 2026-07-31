import { Metadata } from "next";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Admin Login | Shadcn UI Kit",
  description: "Sign in to access your administrative dashboard and services.",
};

export default function LoginPage() {
  return <LoginForm />;
}
