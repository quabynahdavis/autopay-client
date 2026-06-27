"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { SettingsLayout } from "@/features/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const securitySchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SecurityForm = z.infer<typeof securitySchema>;

export default function SecuritySettingsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SecurityForm>({ resolver: zodResolver(securitySchema) });

  return (
    <SettingsLayout>
      <PageHeader
        title="Security"
        description="Manage password and authentication settings"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" },
          { label: "Security" },
        ]}
      />
      <SectionCard title="Change Password">
        <form
          onSubmit={handleSubmit(() => toast.success("Password updated successfully"))}
          className="max-w-lg space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input id="currentPassword" type="password" {...register("currentPassword")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" type="password" {...register("newPassword")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <p className="text-xs text-danger">{errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit">Update password</Button>
        </form>
      </SectionCard>
      <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Authenticator app</p>
            <p className="text-sm text-muted-foreground">Not configured</p>
          </div>
          <Button variant="outline">Enable 2FA</Button>
        </div>
      </SectionCard>
    </SettingsLayout>
  );
}
