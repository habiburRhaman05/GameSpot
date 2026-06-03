"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Camera, Save, RotateCcw, Activity, CalendarDays } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { organizerService } from "@/service/organizer.service";
import { userService } from "@/service/user.service";
import { DashboardErrorBoundary } from "./DashboardErrorBoundary";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/placeholders";
import type {
  ChangeOrganizerField,
  ChangeProfileField,
  OrganizerFormState,
  ProfileFormState,
  ProfileMode,
} from "./profile-settings/types";

const normalizeNullableString = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

interface ProfileSettingsPageProps {
  mode: ProfileMode;
  headerTitle?: string;
  headerDescription?: string;
}

export function ProfileSettingsPage({
  mode,
  headerTitle,
  headerDescription,
}: ProfileSettingsPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const [profileDraft, setProfileDraft] = useState<ProfileFormState | null>(null);
  const [organizerDraft, setOrganizerDraft] = useState<OrganizerFormState | null>(null);

  const userQuery = useQuery({
    queryKey: ["profile-user", mode],
    queryFn: () => userService.getProfile(),
    staleTime: 30_000,
  });

  const userData = userQuery.data?.data;
  const shouldLoadOrganizerProfile = mode === "ORGANIZER" || userData?.role === "ORGANIZER";

  const organizerQuery = useQuery({
    queryKey: ["profile-organizer", mode],
    queryFn: () => organizerService.getProfile(),
    staleTime: 30_000,
    enabled: shouldLoadOrganizerProfile,
  });

  const organizerData = organizerQuery.data?.data;
  const effectiveMode: ProfileMode = mode === "ORGANIZER" ? "ORGANIZER" : (userData?.role ?? mode);

  const initialProfileForm = useMemo<ProfileFormState>(
    () => ({
      name: userData?.name ?? "",
      phone: userData?.phone ?? "",
    }),
    [userData?.name, userData?.phone],
  );

  const initialOrganizerForm = useMemo<OrganizerFormState>(
    () => ({
      businessName: organizerData?.businessName ?? "",
      website: organizerData?.website ?? "",
      phoneNumber: organizerData?.phoneNumber ?? "",
      address: organizerData?.address ?? "",
      bio: organizerData?.bio ?? "",
    }),
    [organizerData?.address, organizerData?.bio, organizerData?.businessName, organizerData?.phoneNumber, organizerData?.website],
  );

  const profileForm = profileDraft ?? initialProfileForm;
  const organizerForm = organizerDraft ?? initialOrganizerForm;

  const updateUserMutation = useMutation({
    mutationFn: (payload: Parameters<typeof userService.updateProfile>[0]) => userService.updateProfile(payload),
  });

  const updateOrganizerMutation = useMutation({
    mutationFn: (payload: Parameters<typeof organizerService.updateProfile>[0]) => organizerService.updateProfile(payload),
  });

  const createOrganizerMutation = useMutation({
    mutationFn: (payload: Parameters<typeof organizerService.createProfile>[0]) => organizerService.createProfile(payload),
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: async () => {
      toast.success("Profile image updated");
      await queryClient.invalidateQueries({ queryKey: ["profile-user"] });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to upload avatar");
    },
  });

  const isSaving =
    updateUserMutation.isPending ||
    createOrganizerMutation.isPending ||
    updateOrganizerMutation.isPending ||
    uploadAvatarMutation.isPending;

  const roleLabel = useMemo(() => {
    if (effectiveMode === "ORGANIZER") return "Organizer";
    if (effectiveMode === "ADMIN") return "Admin";
    return "User";
  }, [effectiveMode]);

  const bookingCount = userData?._count?.bookings ?? 0;
  const venueCount = organizerData?._count?.courts ?? 0;

  const handleDiscard = () => {
    setProfileDraft(null);
    setOrganizerDraft(null);
    toast.success("Changes discarded");
  };

  const handleSave = async () => {
    if (!profileForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (effectiveMode === "ORGANIZER" && !organizerForm.businessName.trim()) {
      toast.error("Business name is required");
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        name: profileForm.name.trim(),
        phone: normalizeNullableString(profileForm.phone),
      });

      if (effectiveMode === "ORGANIZER") {
        if (organizerData?.id) {
          await updateOrganizerMutation.mutateAsync({
            businessName: organizerForm.businessName.trim(),
            website: normalizeNullableString(organizerForm.website),
            phoneNumber: normalizeNullableString(organizerForm.phoneNumber),
            address: normalizeNullableString(organizerForm.address),
            bio: normalizeNullableString(organizerForm.bio),
          });
        } else {
          await createOrganizerMutation.mutateAsync({
            businessName: organizerForm.businessName.trim(),
            website: normalizeNullableString(organizerForm.website) ?? undefined,
            phoneNumber: normalizeNullableString(organizerForm.phoneNumber) ?? undefined,
            address: normalizeNullableString(organizerForm.address) ?? undefined,
            bio: normalizeNullableString(organizerForm.bio) ?? undefined,
          });
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["profile-user"] });
      if (effectiveMode === "ORGANIZER") {
        await queryClient.invalidateQueries({ queryKey: ["profile-organizer"] });
      }

      if (effectiveMode === "ORGANIZER" && !organizerData?.id) {
        toast.success("Organizer profile created successfully");
        router.push("/organizer/settings");
        router.refresh();
        return;
      }

      toast.success("Profile settings saved");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings");
    }
  };

  const handleUploadAvatar = async (file?: File) => {
    if (!file) return;
    await uploadAvatarMutation.mutateAsync(file);
  };

  const handleProfileFieldChange: ChangeProfileField = (key, value) => {
    setProfileDraft({ ...profileForm, [key]: value });
  };

  const handleOrganizerFieldChange: ChangeOrganizerField = (key, value) => {
    setOrganizerDraft({ ...organizerForm, [key]: value });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      handleUploadAvatar(file);
    }
  };

  if (userQuery.isLoading || (effectiveMode === "ORGANIZER" && organizerQuery.isLoading)) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner label="Loading profile..." />
      </div>
    );
  }

  if (!userData) {
    return (
      <Card className="rounded-xl border border-border bg-card">
        <CardContent className="p-6 text-sm text-destructive">
          Failed to load profile. Please refresh and try again.
        </CardContent>
      </Card>
    );
  }

  const hasUnsavedChanges = profileDraft !== null || organizerDraft !== null;

  return (
    <DashboardErrorBoundary fallbackTitle="Profile Error" fallbackMessage="Failed to load profile data. Please try again.">
    <div className="space-y-6">
      {/* Header with save toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5"
      >
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            {headerTitle ?? "Profile Settings"}
          </h1>
          <p className="mt-1 text-sm text-text-tertiary">
            {headerDescription ?? "Manage your account and profile information."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDiscard}
              disabled={isSaving}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Discard
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
          >
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Main column - Forms */}
        <div className="space-y-6 xl:col-span-8">
          {/* Profile form */}
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-primary" />
                <div>
                  <h2 className="font-label text-sm font-semibold text-foreground">Personal Information</h2>
                  <p className="text-xs text-text-tertiary">Update your display name and contact details.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="settings-name" className="text-xs font-medium text-foreground/80">Full Name</Label>
                  <Input
                    id="settings-name"
                    value={profileForm.name}
                    onChange={(e) => handleProfileFieldChange("name", e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="settings-email" className="text-xs font-medium text-foreground/80">Email</Label>
                  <Input
                    id="settings-email"
                    value={userData.email}
                    readOnly
                    className="bg-surface-2/50 text-text-tertiary cursor-not-allowed"
                  />
                  <p className="text-[10px] text-text-tertiary">Email cannot be changed.</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="settings-phone" className="text-xs font-medium text-foreground/80">Phone</Label>
                  <Input
                    id="settings-phone"
                    value={profileForm.phone}
                    onChange={(e) => handleProfileFieldChange("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organizer form */}
          {effectiveMode === "ORGANIZER" && (
            <Card className="rounded-xl border border-border bg-card">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full bg-accent" />
                  <div>
                    <h2 className="font-label text-sm font-semibold text-foreground">Organizer Profile</h2>
                    <p className="text-xs text-text-tertiary">Your business details visible to customers.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="settings-business" className="text-xs font-medium text-foreground/80">Business Name</Label>
                    <Input
                      id="settings-business"
                      value={organizerForm.businessName}
                      onChange={(e) => handleOrganizerFieldChange("businessName", e.target.value)}
                      placeholder="Your business name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="settings-org-phone" className="text-xs font-medium text-foreground/80">Business Phone</Label>
                    <Input
                      id="settings-org-phone"
                      value={organizerForm.phoneNumber}
                      onChange={(e) => handleOrganizerFieldChange("phoneNumber", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="settings-website" className="text-xs font-medium text-foreground/80">Website</Label>
                    <Input
                      id="settings-website"
                      value={organizerForm.website}
                      onChange={(e) => handleOrganizerFieldChange("website", e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="settings-address" className="text-xs font-medium text-foreground/80">Business Address</Label>
                    <Input
                      id="settings-address"
                      value={organizerForm.address}
                      onChange={(e) => handleOrganizerFieldChange("address", e.target.value)}
                      placeholder="123 Main St, City"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="settings-bio" className="text-xs font-medium text-foreground/80">Bio</Label>
                    <textarea
                      id="settings-bio"
                      value={organizerForm.bio}
                      onChange={(e) => handleOrganizerFieldChange("bio", e.target.value)}
                      rows={4}
                      placeholder="Tell customers about your venues..."
                      className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-foreground placeholder:text-text-tertiary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Avatar & Stats */}
        <div className="space-y-6 xl:col-span-4">
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-primary" />
                <h2 className="font-label text-sm font-semibold text-foreground">Profile Picture</h2>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-6 transition-all",
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-surface-2/30",
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(e) => handleUploadAvatar(e.target.files?.[0])}
                  disabled={uploadAvatarMutation.isPending}
                />
                <Avatar className="h-20 w-20 ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
                  <AvatarImage src={userData.avatarUrl ?? undefined} alt={userData.name} />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {getInitials(userData.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-primary">
                    <Camera className="h-4 w-4" />
                    {uploadAvatarMutation.isPending ? "Uploading..." : "Change Photo"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-tertiary">
                    Drag & drop or click to browse
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-accent" />
                <h2 className="font-label text-sm font-semibold text-foreground">Account Info</h2>
              </div>
              <Separator />
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary">Role</span>
                  <span className="font-medium text-foreground">{roleLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary">Bookings</span>
                  <span className="font-medium text-foreground">{bookingCount}</span>
                </div>
                {effectiveMode === "ORGANIZER" && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">Venues</span>
                    <span className="font-medium text-foreground">{venueCount}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </DashboardErrorBoundary>
  );
}
