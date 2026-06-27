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
import { companyProfile } from "@/services/mock/settings";

const companySchema = z.object({
  name: z.string().min(1),
  tin: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
});

type CompanyForm = z.infer<typeof companySchema>;

export default function CompanySettingsPage() {
  const { register, handleSubmit } = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: companyProfile,
  });

  return (
    <SettingsLayout>
      <PageHeader
        title="Company"
        description="Manage your organization details"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Settings", href: "/settings" },
          { label: "Company" },
        ]}
      />
      <SectionCard title="Company Information">
        <form
          onSubmit={handleSubmit(() => toast.success("Company profile updated"))}
          className="max-w-lg space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Company name</Label>
            <Input id="name" {...register("name")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tin">TIN</Label>
            <Input id="tin" {...register("tin")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
          </div>
          <Button type="submit">Save changes</Button>
        </form>
      </SectionCard>
    </SettingsLayout>
  );
}
