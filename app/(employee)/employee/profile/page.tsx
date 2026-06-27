"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getEmployeeProfile } from "@/services/mock/employees";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmployeeProfilePage() {
  const { user } = useAuth();
  const employeeId = user?.employeeId ?? "EMP-1042";
  const profile = getEmployeeProfile(employeeId);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: profile?.firstName ?? user?.name?.split(" ")[0] ?? "",
      lastName: profile?.lastName ?? "",
      phone: profile?.phone ?? "",
      email: profile?.email ?? user?.email ?? "",
    },
  });

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader title="My Details" description={user?.companyName} />
      <SectionCard title="Personal info">
        <form onSubmit={handleSubmit(() => toast.success("Saved"))} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>First name</Label><Input {...register("firstName")} /></div>
            <div className="space-y-2"><Label>Last name</Label><Input {...register("lastName")} /></div>
          </div>
          <div className="space-y-2"><Label>Phone</Label><Input {...register("phone")} /></div>
          <div className="space-y-2"><Label>Email</Label><Input readOnly className="bg-muted" {...register("email")} /></div>
          <p className="text-xs text-muted-foreground">ID: {employeeId}</p>
          <Button type="submit">Save</Button>
        </form>
      </SectionCard>
    </div>
  );
}
