"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, BriefcaseBusiness, ImagePlus, Loader2, UserRound, X, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signUpSchema, type SignUpFormValues } from "@/lib/validations/auth";
import { authService } from "@/service/auth.service";
import { cn } from "@/lib/utils";

type Role = "USER" | "ORGANIZER";

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("USER");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { role: "USER", name: "", email: "", password: "", businessName: "", phoneNumber: "" },
  });

  const password = form.watch("password");
  const passwordStrength = !password ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Medium", "Strong"];
  const strengthColor = ["", "bg-destructive", "bg-warning", "bg-success"];

  const handleRoleSelect = (role: Role) => { setSelectedRole(role); form.setValue("role", role, { shouldValidate: true }); };

  async function onSubmit(values: SignUpFormValues) {
    try {
      setIsLoading(true);
      await authService.signUpWithImage({
        name: values.name, email: values.email, password: values.password,
        role: values.role, businessName: values.businessName, phoneNumber: values.phoneNumber,
        imageFile: profileImage ?? undefined,
      });
      toast.success("Account created!");
      router.push(values.role === "ORGANIZER" ? "/organizer" : "/");
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Create account</h1>
        <p className="text-sm text-text-tertiary">Join the platform to start booking or managing venues.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-foreground/70">I want to join as</Label>
          <div className="grid grid-cols-2 gap-3">
            {([{ role: "USER", icon: UserRound, label: "Athlete" }, { role: "ORGANIZER", icon: BriefcaseBusiness, label: "Organizer" }] as const).map(({ role, icon: Icon, label }) => (
              <button key={role} type="button" onClick={() => handleRoleSelect(role)}
                className={cn("flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all", selectedRole === role ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30")}>
                <Icon className={cn("h-6 w-6", selectedRole === role ? "text-primary" : "text-text-tertiary")} />
                <span className={cn("font-label text-xs font-semibold", selectedRole === role ? "text-primary" : "text-foreground")}>{label}</span>
              </button>
            ))}
          </div>
          {form.formState.errors.role?.message && <p className="text-xs text-destructive">{form.formState.errors.role.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="su-name" className="text-xs font-medium text-foreground/70">Full Name</Label>
          <Input id="su-name" placeholder="Your name" {...form.register("name")}
            className={form.formState.errors.name ? "border-destructive" : ""} disabled={isLoading} />
          {form.formState.errors.name?.message && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="su-email" className="text-xs font-medium text-foreground/70">Email</Label>
          <Input id="su-email" type="email" placeholder="name@example.com" {...form.register("email")}
            className={form.formState.errors.email ? "border-destructive" : ""} disabled={isLoading} />
          {form.formState.errors.email?.message && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="su-password" className="text-xs font-medium text-foreground/70">Password</Label>
          <div className="relative">
            <Input id="su-password" type={showPassword ? "text" : "password"} placeholder="Create a password" {...form.register("password")}
              className={`pr-10 ${form.formState.errors.password ? "border-destructive" : ""}`} disabled={isLoading} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary" tabIndex={-1}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {password.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-surface-2 overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", strengthColor[passwordStrength])} style={{ width: `${(passwordStrength / 3) * 100}%` }} />
              </div>
              <span className="text-[10px] text-text-tertiary">{strengthLabel[passwordStrength]}</span>
            </div>
          )}
          {form.formState.errors.password?.message && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground/70">Profile Picture (optional)</Label>
          <input id="profileImage" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only"
            onChange={(e) => setProfileImage(e.target.files?.[0] ?? null)} disabled={isLoading} />
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 p-3">
            <label htmlFor="profileImage" className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-2 transition-colors">
              <ImagePlus className="h-3.5 w-3.5" />Browse
            </label>
            <p className="flex-1 truncate text-sm text-text-tertiary">{profileImage ? profileImage.name : "No file selected"}</p>
            {profileImage && (
              <button type="button" onClick={() => setProfileImage(null)} className="text-text-tertiary hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-[11px] text-text-tertiary">JPG, PNG, or WEBP up to 5MB.</p>
        </div>

        {selectedRole === "ORGANIZER" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 overflow-hidden">
            <div className="space-y-1.5">
              <Label htmlFor="su-business" className="text-xs font-medium text-foreground/70">Business Name</Label>
              <Input id="su-business" placeholder="Your business name" {...form.register("businessName")}
                className={form.formState.errors.businessName ? "border-destructive" : ""} disabled={isLoading} />
              {form.formState.errors.businessName?.message && <p className="text-xs text-destructive">{form.formState.errors.businessName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="su-phone" className="text-xs font-medium text-foreground/70">Phone Number</Label>
              <Input id="su-phone" placeholder="+1 (555) 000-0000" {...form.register("phoneNumber")}
                className={form.formState.errors.phoneNumber ? "border-destructive" : ""} disabled={isLoading} />
              {form.formState.errors.phoneNumber?.message && <p className="text-xs text-destructive">{form.formState.errors.phoneNumber.message}</p>}
            </div>
          </motion.div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full h-11">
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : <><span>Create Account</span><ArrowRight className="ml-2 h-4 w-4" /></>}
        </Button>

        <p className="text-center text-xs text-text-tertiary">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-primary hover:text-primary-hover transition-colors">Sign in</Link>
        </p>
      </form>
    </motion.div>
  );
}
