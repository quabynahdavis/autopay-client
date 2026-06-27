"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    const result = await login(data);
    if (result.success) toast.success("Welcome!");
    else toast.error(result.error);
  };

  const fillDemo = (email: string) => {
    setValue("email", email);
    setValue("password", "password123");
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pay and get paid — simple and secure
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot?
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
          {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : "Sign in"}
        </Button>
      </form>

      <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Try demo accounts (password: password123)</p>
        <ul className="mt-2 space-y-1">
          <li>
            <button type="button" onClick={() => fillDemo("admin@acme.com.gh")} className="text-primary hover:underline text-left">
              Admin — admin@acme.com.gh
            </button>
          </li>
          <li>
            <button type="button" onClick={() => fillDemo("finance@acme.com.gh")} className="text-primary hover:underline text-left">
              Finance — finance@acme.com.gh
            </button>
          </li>
          <li>
            <button type="button" onClick={() => fillDemo("kwame@acme.com.gh")} className="text-primary hover:underline text-left">
              Employee — kwame@acme.com.gh
            </button>
          </li>
        </ul>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
