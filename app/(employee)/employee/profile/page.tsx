"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { fetchEmployeeProfile, updateEmployeeProfile } from "@/services/api/employees";
import { useApiData } from "@/hooks/useApiData";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeeProfilePage() {
  const { user } = useAuth();
  const employeeId = user?.employeeId ?? "";
  const { data: profile, loading } = useApiData(
    () => fetchEmployeeProfile(employeeId),
    [employeeId]
  );

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        email: profile.email,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: {
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    try {
      await updateEmployeeProfile(employeeId, data);
      toast.success("Saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader title="My Details" description={user?.companyName} />
      <SectionCard title="Personal info">
        {loading ? (
          <Skeleton className="h-48 w-full rounded-xl" />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>First name</Label>
                <Input {...register("firstName")} />
              </div>
              <div className="space-y-2">
                <Label>Last name</Label>
                <Input {...register("lastName")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input readOnly className="bg-muted" {...register("email")} />
            </div>
            <p className="text-xs text-muted-foreground">ID: {employeeId}</p>
            <Button type="submit">Save</Button>
          </form>
        )}
      </SectionCard>
    </div>
  );
}
