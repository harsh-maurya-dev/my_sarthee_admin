"use client";

import { useState, useRef } from "react";
import {
  preferredSkillsets,
  Skillset,
  SkillsetDomain,
  MAX_SKILLS_PER_DOMAIN,
} from "../_data/preferred-skillsets";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Trash2,
  Stethoscope,
  HeartHandshake,
  Activity,
  Upload,
  X,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const domainIcons: Record<string, React.ElementType> = {
  Nursing: Stethoscope,
  Caregiver: HeartHandshake,
  Physiotherapist: Activity,
};

export function PreferredSkillsetsTab() {
  const [domains, setDomains] = useState<SkillsetDomain[]>(preferredSkillsets);
  const [activeDomain, setActiveDomain] = useState<string>("Nursing");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillDescription, setSkillDescription] = useState("");
  const [skillImage, setSkillImage] = useState("");
  const [skillImageFileName, setSkillImageFileName] = useState("");

  // Delete dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<Skillset | null>(null);

  const currentDomain = domains.find((d) => d.domain === activeDomain);
  const currentSkillCount = currentDomain?.skills.length ?? 0;
  const isAtMaxSkills = currentSkillCount >= MAX_SKILLS_PER_DOMAIN;

  // Handlers
  const handleOpenAdd = () => {
    if (isAtMaxSkills) {
      swiftAlert.error({
        title: "Limit Reached",
        description: `Maximum ${MAX_SKILLS_PER_DOMAIN} skills allowed per domain. Please delete an existing skill first.`,
      });
      return;
    }
    setSkillName("");
    setSkillDescription("");
    setSkillImage("");
    setSkillImageFileName("");
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      swiftAlert.error({
        title: "Invalid File",
        description: "Please upload an image file (PNG, JPG, SVG, etc.)",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      swiftAlert.error({
        title: "File Too Large",
        description: "Maximum file size is 2MB.",
      });
      return;
    }

    setSkillImageFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSkillImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSkillImage("");
    setSkillImageFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveSkill = () => {
    if (!skillName.trim()) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Skill name is required.",
      });
      return;
    }

    setDomains((prev) =>
      prev.map((d) => {
        if (d.domain !== activeDomain) return d;
        return {
          ...d,
          skills: [
            ...d.skills,
            {
              id: `${activeDomain.substring(0, 2).toUpperCase()}-${String(Math.floor(100 + Math.random() * 900))}`,
              name: skillName.trim(),
              description: skillDescription.trim(),
              image:
                skillImage ||
                "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=80&q=80",
              status: "Active" as const,
            },
          ],
        };
      })
    );

    swiftAlert.success({
      title: "Skill Added",
      description: `"${skillName}" has been added to ${activeDomain}.`,
    });
    setIsModalOpen(false);
  };

  const handleToggleSkillStatus = (skillId: string) => {
    setDomains((prev) =>
      prev.map((d) => {
        if (d.domain !== activeDomain) return d;
        return {
          ...d,
          skills: d.skills.map((s) => {
            if (s.id === skillId) {
              const next = s.status === "Active" ? "Inactive" : "Active";
              swiftAlert.success({
                title: "Skill Status Updated",
                description: `"${s.name}" is now ${next}.`,
              });
              return { ...s, status: next };
            }
            return s;
          }),
        };
      })
    );
  };

  const handleDeleteSkill = () => {
    if (!skillToDelete) return;
    setDomains((prev) =>
      prev.map((d) => {
        if (d.domain !== activeDomain) return d;
        return {
          ...d,
          skills: d.skills.filter((s) => s.id !== skillToDelete.id),
        };
      })
    );
    swiftAlert.success({
      title: "Skill Deleted",
      description: `"${skillToDelete.name}" has been removed.`,
    });
    setSkillToDelete(null);
    setIsDeleteOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Domain Sub-Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
        {domains.map((d) => {
          const DomainIcon = domainIcons[d.domain] || Stethoscope;
          const isActive = activeDomain === d.domain;
          return (
            <button
              key={d.domain}
              onClick={() => setActiveDomain(d.domain)}
              className={`flex items-center gap-2 pb-3 text-xs font-bold transition-all relative ${
                isActive
                  ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <DomainIcon className="h-4 w-4" />
              <span>{d.domain}</span>
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4"
              >
                {d.skills.length}/{MAX_SKILLS_PER_DOMAIN}
              </Badge>
            </button>
          );
        })}

        {/* Add Skill Button */}
        <div className="ml-auto pb-3">
          <Button
            size="sm"
            onClick={handleOpenAdd}
            disabled={isAtMaxSkills}
            className="h-8 gap-1.5 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Skill</span>
          </Button>
        </div>
      </div>

      {/* Max Skill Warning */}
      {isAtMaxSkills && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-2.5 text-xs text-amber-700 dark:text-amber-300 font-medium">
          ⚠️ Maximum {MAX_SKILLS_PER_DOMAIN} skills reached for {activeDomain}. Delete an existing skill to add a new one.
        </div>
      )}

      {/* Skillset Table Listing */}
      {currentDomain && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
              <TableRow>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground w-16">
                  #
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground w-16">
                  Image
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Skill Name
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Description
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground text-center w-32">
                  Status
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground text-center w-24">
                  Delete
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDomain.skills.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground text-xs font-medium"
                  >
                    No skills added for {activeDomain} yet.
                  </TableCell>
                </TableRow>
              ) : (
                currentDomain.skills.map((skill, index) => (
                  <TableRow
                    key={skill.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    {/* Index */}
                    <TableCell className="text-xs text-muted-foreground font-medium">
                      {index + 1}
                    </TableCell>

                    {/* Image */}
                    <TableCell>
                      <div className="h-9 w-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border shrink-0">
                        <img
                          src={skill.image}
                          alt={skill.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=80&q=80";
                          }}
                        />
                      </div>
                    </TableCell>

                    {/* Skill Name */}
                    <TableCell className="text-xs font-semibold text-foreground">
                      {skill.name}
                    </TableCell>

                    {/* Description */}
                    <TableCell className="text-xs text-muted-foreground">
                      {skill.description}
                    </TableCell>

                    {/* Status Toggle */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={skill.status === "Active"}
                          onCheckedChange={() =>
                            handleToggleSkillStatus(skill.id)
                          }
                          className="data-[state=checked]:bg-emerald-600 scale-90"
                        />
                        <Badge
                          className={
                            skill.status === "Active"
                              ? "bg-emerald-600 text-white font-semibold text-[9px]"
                              : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium text-[9px]"
                          }
                        >
                          {skill.status}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Delete Button */}
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSkillToDelete(skill);
                          setIsDeleteOpen(true);
                        }}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Table Footer */}
          <div className="p-3 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              <strong className="text-foreground">
                {currentDomain.skills.length}
              </strong>{" "}
              of{" "}
              <strong className="text-foreground">
                {MAX_SKILLS_PER_DOMAIN}
              </strong>{" "}
              skills used
            </span>
            <span className="font-medium text-teal-600 dark:text-teal-400">
              {activeDomain} Domain
            </span>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Add Skill to {activeDomain}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a new preferred skillset under the {activeDomain} domain.
              ({currentSkillCount}/{MAX_SKILLS_PER_DOMAIN} slots used)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Skill Name */}
            <div className="space-y-1.5">
              <Label htmlFor="skillName" className="text-xs font-semibold">
                Skill Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="skillName"
                placeholder="e.g. Wound Care, Mobility Support"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            {/* Short Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor="skillDescription"
                className="text-xs font-semibold"
              >
                Short Description
              </Label>
              <Input
                id="skillDescription"
                placeholder="e.g. Dressing, incision management"
                value={skillDescription}
                onChange={(e) => setSkillDescription(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            {/* Upload Image */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Upload Image</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-5 cursor-pointer transition-all hover:border-teal-400 hover:bg-teal-50/30 dark:hover:border-teal-600 dark:hover:bg-teal-950/20"
              >
                {skillImage ? (
                  <div className="relative">
                    <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
                      <img
                        src={skillImage}
                        alt="Skill preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=80&q=80";
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm hover:bg-rose-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {skillImageFileName && (
                      <p className="text-[10px] text-muted-foreground text-center mt-1.5 max-w-[100px] truncate">
                        {skillImageFileName}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-1.5 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40 transition-colors">
                      <Upload className="h-4 w-4 text-muted-foreground group-hover:text-teal-600 transition-colors" />
                    </div>
                    <p className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      Click to upload
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      PNG, JPG, SVG up to 2MB
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveSkill}
              className="h-9 text-xs bg-teal-600 text-white hover:bg-teal-700 font-semibold"
            >
              Add Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold">
              Delete Skill?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                &quot;{skillToDelete?.name}&quot;
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs h-9">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSkill}
              className="text-xs h-9 bg-rose-600 text-white hover:bg-rose-700 font-semibold"
            >
              Delete Skill
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
