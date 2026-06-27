"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Smartphone,
  Building2,
  Upload,
  CheckCircle,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(user.role === "employee" ? "/employee" : "/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (user) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050810] text-white">
      {/* ── Ambient background orbs ─────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-16">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold shadow-lg shadow-violet-500/30">
            MP
          </div>
          <span className="text-lg font-bold tracking-tight">MassPay</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:brightness-110"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-20 text-center md:px-16 md:pt-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
          <Zap className="h-3.5 w-3.5" />
          Built for Ghanaian businesses
        </div>

        <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
          Send money to{" "}
          <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
            everyone
          </span>
          <br />
          all at once
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl">
          MassPay lets you process payroll, vendor payments, and bulk transfers in
          seconds — via bank transfer, Mobile Money, or credit card.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-violet-500/30 transition-all hover:gap-3 hover:shadow-violet-500/50 hover:brightness-110"
          >
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-medium text-white/80 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            Sign in to dashboard
          </Link>
        </div>

        {/* Stats row */}
        <div className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-6">
          {[
            { icon: DollarSign, value: "GHS 2.4B+", label: "Processed" },
            { icon: Users, value: "1,200+", label: "Businesses" },
            { icon: TrendingUp, value: "99.9%", label: "Uptime" },
          ].map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <Icon className="mx-auto mb-3 h-5 w-5 text-violet-400" />
              <p className="text-2xl font-bold text-white md:text-3xl">{value}</p>
              <p className="mt-1 text-sm text-white/50">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Payment types ───────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Every payment method,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              one platform
            </span>
          </h2>
          <p className="mt-4 text-white/50">
            Pay anyone, anywhere in Ghana with the method that works for them.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Building2,
              title: "Bank Transfer",
              description:
                "Send directly to GCB, Ecobank, Fidelity, Absa, Standard Chartered, and 10+ more Ghanaian banks.",
              color: "from-blue-500/20 to-blue-600/10",
              border: "border-blue-500/20",
              iconColor: "text-blue-400",
            },
            {
              icon: Smartphone,
              title: "Mobile Money",
              description:
                "Full support for MTN MoMo, Vodafone Cash, and AirtelTigo Money — the way Ghana moves money.",
              color: "from-yellow-500/20 to-yellow-600/10",
              border: "border-yellow-500/20",
              iconColor: "text-yellow-400",
            },
            {
              icon: CreditCard,
              title: "Credit & Debit Card",
              description:
                "Accept Visa, Mastercard, GH-Link, and AmEx. Secure, fast, and always available.",
              color: "from-violet-500/20 to-violet-600/10",
              border: "border-violet-500/20",
              iconColor: "text-violet-400",
            },
          ].map(({ icon: Icon, title, description, color, border, iconColor }) => (
            <div
              key={title}
              className={`group relative rounded-2xl border ${border} bg-gradient-to-b ${color} p-8 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-2xl`}
            >
              <div className={`mb-5 inline-flex rounded-xl bg-white/10 p-3 ${iconColor}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-16">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold leading-tight md:text-4xl">
              Built for finance teams
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                that move fast
              </span>
            </h2>
            <p className="mt-5 text-white/55 leading-relaxed">
              Upload a spreadsheet, review the recipients, get approval, and
              payments are out the door — in minutes, not days.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                { icon: Upload, text: "Upload CSV or Excel with hundreds of recipients" },
                { icon: CheckCircle, text: "Two-level approval workflow built in" },
                { icon: Shield, text: "Every action is logged in the audit trail" },
                { icon: Globe, text: "Company data is fully isolated — no mixing" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-violet-500/20 p-1.5">
                    <Icon className="h-4 w-4 text-violet-400" />
                  </div>
                  <span className="text-white/70">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mockup card */}
          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Batch Preview — June 2026
              </p>
              <div className="mt-4 space-y-3">
                {[
                  { name: "Kwame Asante", type: "MTN MoMo", amount: "GHS 3,500" },
                  { name: "Ama Serwaa", type: "Vodafone Cash", amount: "GHS 4,200" },
                  { name: "Golden Harvest Ltd", type: "GCB Bank", amount: "GHS 85,000" },
                  { name: "Kofi Mensah", type: "MTN MoMo", amount: "GHS 2,800" },
                  { name: "Abena Boateng", type: "Ecobank Ghana", amount: "GHS 12,000" },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{row.name}</p>
                      <p className="text-xs text-white/40">{row.type}</p>
                    </div>
                    <span className="text-sm font-semibold text-green-400">{row.amount}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between rounded-xl bg-violet-600/20 px-4 py-3">
                <span className="text-sm font-medium text-violet-300">Total</span>
                <span className="text-base font-bold text-white">GHS 107,500</span>
              </div>
            </div>
            {/* Glow */}
            <div aria-hidden className="absolute -inset-4 -z-10 rounded-3xl bg-violet-600/10 blur-2xl" />
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-24 md:px-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">How it works</h2>
          <p className="mt-4 text-white/50">Three steps. That&apos;s it.</p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Create your company",
              description:
                "Register your business and invite your finance team. Each company gets its own private workspace.",
            },
            {
              step: "02",
              title: "Upload recipients",
              description:
                "Drop in a CSV or add recipients manually. MassPay validates every entry before you confirm.",
            },
            {
              step: "03",
              title: "Approve & send",
              description:
                "Finance submits, admin approves. Payments process automatically and results appear in real time.",
            },
          ].map(({ step, title, description }) => (
            <div key={step} className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 text-xl font-extrabold text-violet-400">
                {step}
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center md:px-16">
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-b from-violet-600/20 to-indigo-600/10 p-12 backdrop-blur-sm">
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.15)_0%,_transparent_70%)]" />
          </div>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Ready to move money faster?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Join hundreds of Ghanaian businesses already using MassPay for
            payroll, vendor payments, and everything in between.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold shadow-2xl shadow-violet-500/30 transition-all hover:gap-3 hover:brightness-110"
            >
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-10 md:px-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-white/40 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
              MP
            </div>
            <span className="font-medium text-white/60">MassPay</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link href="/login" className="transition-colors hover:text-white/70">Sign in</Link>
            <Link href="/register" className="transition-colors hover:text-white/70">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
