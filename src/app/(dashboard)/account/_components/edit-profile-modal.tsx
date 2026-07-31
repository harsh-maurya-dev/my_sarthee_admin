"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCog, Camera } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export interface AdminProfileData {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  roleTitle: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AdminProfileData;
  onSaveProfile: (updated: AdminProfileData) => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setPhone(profile.phone);
    setAvatarUrl(profile.avatarUrl);
  }, [profile, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Please enter Name and Email Address.",
      });
      return;
    }

    const updated: AdminProfileData = {
      ...profile,
      name,
      email,
      phone,
      avatarUrl,
    };

    onSaveProfile(updated);
    swiftAlert.success({
      title: "Profile Updated",
      description: "Admin profile details successfully saved.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <UserCog className="h-5 w-5 text-teal-600" />
            Edit Admin Profile
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Update administrator name, email ID, phone number & profile picture.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Avatar URL / Preview */}
          <div className="flex items-center gap-4 border-b pb-4">
            <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-teal-600 bg-slate-100 shrink-0">
              <img
                src={avatarUrl}
                alt={name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div className="space-y-1 flex-1">
              <Label className="text-xs font-semibold">Profile Picture URL</Label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="h-8 text-xs w-full"
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold">Full Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 text-xs w-full"
              required
            />
          </div>

          {/* Email ID & Phone Number */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Email Address *</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-xs w-full"
                required
              />
            </div>

            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Phone Number</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-9 text-xs w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-9 text-xs bg-teal-600 text-white hover:bg-teal-700 font-semibold">
              Save Profile Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
