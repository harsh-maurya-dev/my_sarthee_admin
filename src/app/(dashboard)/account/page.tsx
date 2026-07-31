"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditProfileModal, AdminProfileData } from "./_components/edit-profile-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Lock,
  LogOut,
  Edit,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  UserCheck,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function AccountPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<AdminProfileData>({
    name: "Alexander Mercer",
    email: "admin@mysarthee.health",
    phone: "+1 (555) 019-2831",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    roleTitle: "Super Administrator",
  });

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Please fill in Current, New, and Confirm password fields.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      swiftAlert.error({
        title: "Password Mismatch",
        description: "New Password and Confirm Password do not match.",
      });
      return;
    }

    if (newPassword.length < 6) {
      swiftAlert.error({
        title: "Weak Password",
        description: "New Password must be at least 6 characters long.",
      });
      return;
    }

    swiftAlert.success({
      title: "Password Changed",
      description: "Your account password has been updated securely.",
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out from MySarthee Admin?")) {
      swiftAlert.info({
        title: "Signed Out",
        description: "You have been logged out of your session.",
      });
      router.push("/");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <UserCheck className="h-7 w-7 text-teal-600" />
            Account & Profile Settings
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your admin profile details, security credentials, and system authentication.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="h-9 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 font-semibold gap-1.5"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Logout</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* MY PROFILE CARD */}
        <Card className="md:col-span-1 border rounded-2xl shadow-xs space-y-4">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto relative h-24 w-24 rounded-full overflow-hidden border-4 border-teal-600 shadow-md">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardTitle className="text-lg font-extrabold mt-3">{profile.name}</CardTitle>
            <CardDescription className="text-xs">
              <Badge variant="outline" className="bg-teal-50 text-teal-900 border-teal-300 font-bold mt-1">
                {profile.roleTitle}
              </Badge>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 text-xs border-t pt-4">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Mail className="h-4 w-4 text-teal-600 shrink-0" />
              <span className="truncate text-foreground font-mono">{profile.email}</span>
            </div>

            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Phone className="h-4 w-4 text-teal-600 shrink-0" />
              <span className="text-foreground font-mono">{profile.phone}</span>
            </div>

            <div className="flex items-center gap-2.5 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-emerald-600 font-semibold">2FA Multi-Factor Active</span>
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditProfileOpen(true)}
              className="w-full text-xs h-9 gap-1.5 border-slate-200"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Profile Details</span>
            </Button>
          </CardFooter>
        </Card>

        {/* SETTING: CHANGE PASSWORD CARD */}
        <Card className="md:col-span-2 border rounded-2xl shadow-xs">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-teal-600" />
              Account Security & Password Settings
            </CardTitle>
            <CardDescription className="text-xs">
              Update your account password to maintain security.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5 w-full">
                <Label className="text-xs font-semibold">Current Password *</Label>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-9 text-xs w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 w-full">
                  <Label className="text-xs font-semibold">New Password *</Label>
                  <Input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-9 text-xs w-full"
                    required
                  />
                </div>

                <div className="space-y-1.5 w-full">
                  <Label className="text-xs font-semibold">Confirm New Password *</Label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-9 text-xs w-full"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <Button type="submit" size="sm" className="h-9 gap-1.5 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Update Password</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSaveProfile={setProfile}
      />
    </div>
  );
}
