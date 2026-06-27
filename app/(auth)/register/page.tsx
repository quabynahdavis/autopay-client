"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

const businessSchema = z
  .object({
    companyName: z.string().min(2, "Enter your business name"),
    phone: z.string().min(10, "Enter a valid phone number"),
    adminName: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const employeeSchema = z
  .object({
    companyCode: z.string().min(3, "Enter your company code"),
    name: z.string().min(2, "Enter your full name"),
    phone: z.string().min(10, "Enter a valid phone number"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type BusinessForm = z.infer<typeof businessSchema>;
type EmployeeForm = z.infer<typeof employeeSchema>;

export default function RegisterPage() {
  const { registerBusiness, registerEmployee } = useAuth();
  const [tab, setTab] = useState("business");

  const businessForm = useForm<BusinessForm>({ resolver: zodResolver(businessSchema) });
  const employeeForm = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema),
  });

  const onBusiness = async ({ confirmPassword: _, ...data }: BusinessForm) => {
    const result = await registerBusiness(data);
    if (result.success) toast.success("Business registered! Welcome.");
    else toast.error(result.error);
  };

  const onEmployee = async ({ confirmPassword: _, ...data }: EmployeeForm) => {
    const result = await registerEmployee(data);
    if (result.success) toast.success("Account created! Welcome.");
    else toast.error(result.error);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Create account</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose how you will use MassPay
      </p>

      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="business">I run a business</TabsTrigger>
          <TabsTrigger value="employee">I am an employee</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Register your company and start paying your team.
          </p>
          <form onSubmit={businessForm.handleSubmit(onBusiness)} className="space-y-4">
            <Field label="Business name" error={businessForm.formState.errors.companyName?.message}>
              <Input placeholder="e.g. Acme Ghana Ltd" {...businessForm.register("companyName")} />
            </Field>
            <Field label="Business phone" error={businessForm.formState.errors.phone?.message}>
              <Input placeholder="024 123 4567" {...businessForm.register("phone")} />
            </Field>
            <Field label="Your full name" error={businessForm.formState.errors.adminName?.message}>
              <Input {...businessForm.register("adminName")} />
            </Field>
            <Field label="Email" error={businessForm.formState.errors.email?.message}>
              <Input type="email" {...businessForm.register("email")} />
            </Field>
            <Field label="Password" error={businessForm.formState.errors.password?.message}>
              <Input type="password" autoComplete="new-password" {...businessForm.register("password")} />
            </Field>
            <Field label="Confirm password" error={businessForm.formState.errors.confirmPassword?.message}>
              <Input type="password" autoComplete="new-password" {...businessForm.register("confirmPassword")} />
            </Field>
            <Button type="submit" className="w-full" disabled={businessForm.formState.isSubmitting}>
              Register business
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="employee" className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Join your company using the code from your employer.
          </p>
          <form onSubmit={employeeForm.handleSubmit(onEmployee)} className="space-y-4">
            <Field label="Company code" error={employeeForm.formState.errors.companyCode?.message}>
              <Input placeholder="e.g. ACME-GH" {...employeeForm.register("companyCode")} />
            </Field>
            <Field label="Your full name" error={employeeForm.formState.errors.name?.message}>
              <Input {...employeeForm.register("name")} />
            </Field>
            <Field label="Phone number" error={employeeForm.formState.errors.phone?.message}>
              <Input placeholder="024 123 4567" {...employeeForm.register("phone")} />
            </Field>
            <Field label="Email" error={employeeForm.formState.errors.email?.message}>
              <Input type="email" {...employeeForm.register("email")} />
            </Field>
            <Field label="Password" error={employeeForm.formState.errors.password?.message}>
              <Input type="password" autoComplete="new-password" {...employeeForm.register("password")} />
            </Field>
            <Field label="Confirm password" error={employeeForm.formState.errors.confirmPassword?.message}>
              <Input type="password" autoComplete="new-password" {...employeeForm.register("confirmPassword")} />
            </Field>
            <Button type="submit" className="w-full" disabled={employeeForm.formState.isSubmitting}>
              Register
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
