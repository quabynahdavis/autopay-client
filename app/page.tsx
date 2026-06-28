"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

  if (isLoading) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050810] text-white">
      {/* ── Ambient background orbs ─────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[100px]" 
        />
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex items-center justify-between px-6 py-5 md:px-16"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold shadow-lg shadow-violet-500/30">
            MP
          </div>
          <span className="text-lg font-bold tracking-tight">MassPay</span>
        </div>
        <div className="flex items-center gap-3">
          {!user ? (
            <>
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
            </>
          ) : (
            <Link
              href={user.role === "employee" ? "/employee" : "/dashboard"}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:brightness-110"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </motion.nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-20 text-center md:px-16 md:pt-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
            <Zap className="h-3.5 w-3.5" />
            Built for Ghanaian businesses
          </motion.div>

          <motion.h1 variants={itemVariants} className="mt-6 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            Send money to{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              everyone
            </span>
            <br />
            all at once
          </motion.h1>

          <motion.p variants={itemVariants} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl">
            MassPay lets you process payroll, vendor payments, and bulk transfers in
            seconds — via bank transfer, Mobile Money, or credit card.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {!user ? (
              <>
                <Link
                  href="/register"
                  className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-violet-500/30 transition-all hover:shadow-violet-500/50 hover:brightness-110"
                >
                  Start for free
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-medium text-white/80 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  Sign in to dashboard
                </Link>
              </>
            ) : (
              <Link
                href={user.role === "employee" ? "/employee" : "/dashboard"}
                className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-violet-500/30 transition-all hover:shadow-violet-500/50 hover:brightness-110"
              >
                Go to Dashboard
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Link>
            )}
          </motion.div>

          {/* Stats row */}
          <motion.div 
            variants={containerVariants}
            className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-6 w-full"
          >
            {[
              { icon: DollarSign, value: "GHS 2.4B+", label: "Processed" },
              { icon: Users, value: "1,200+", label: "Businesses" },
              { icon: TrendingUp, value: "99.9%", label: "Uptime" },
            ].map(({ icon: Icon, value, label }) => (
              <motion.div
                key={label}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <Icon className="mx-auto mb-3 h-5 w-5 text-violet-400" />
                <p className="text-2xl font-bold text-white md:text-3xl">{value}</p>
                <p className="mt-1 text-sm text-white/50">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Payment types ───────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Every payment method,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              one platform
            </span>
          </h2>
          <p className="mt-4 text-white/50">
            Pay anyone, anywhere in Ghana with the method that works for them.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
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
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              key={title}
              className={`group relative rounded-2xl border ${border} bg-gradient-to-b ${color} p-8 backdrop-blur-sm transition-all hover:shadow-2xl`}
            >
              <div className={`mb-5 inline-flex rounded-xl bg-white/10 p-3 ${iconColor}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-16 overflow-hidden">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
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
              ].map(({ icon: Icon, text }, i) => (
                <motion.li 
                  key={text} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.4 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 rounded-lg bg-violet-500/20 p-1.5">
                    <Icon className="h-4 w-4 text-violet-400" />
                  </div>
                  <span className="text-white/70">{text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Mockup card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative perspective-1000"
          >
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
                ].map((row, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.5 }}
                    key={row.name}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 hover:bg-white/10 transition-colors cursor-default"
                  >
                    <div>
                      <p className="text-sm font-medium">{row.name}</p>
                      <p className="text-xs text-white/40">{row.type}</p>
                    </div>
                    <span className="text-sm font-semibold text-green-400">{row.amount}</span>
                  </motion.div>
                ))}
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="mt-5 flex items-center justify-between rounded-xl bg-violet-600/20 px-4 py-3 border border-violet-500/20"
              >
                <span className="text-sm font-medium text-violet-300">Total</span>
                <span className="text-base font-bold text-white">GHS 107,500</span>
              </motion.div>
            </div>
            {/* Glow */}
            <div aria-hidden className="absolute -inset-4 -z-10 rounded-3xl bg-violet-600/10 blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-24 md:px-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">How it works</h2>
          <p className="mt-4 text-white/50">Three steps. That&apos;s it.</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-14 grid gap-8 md:grid-cols-3"
        >
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
            <motion.div variants={itemVariants} key={step} className="relative group">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 text-xl font-extrabold text-violet-400 transition-colors group-hover:bg-violet-500/20 group-hover:border-violet-500/50"
              >
                {step}
              </motion.div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center md:px-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-b from-violet-600/20 to-indigo-600/10 p-12 backdrop-blur-sm"
        >
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
            {!user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/register"
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold shadow-2xl shadow-violet-500/30 transition-all hover:brightness-110"
                  >
                    Create free account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/login"
                    className="rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white inline-block"
                  >
                    Already have an account?
                  </Link>
                </motion.div>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={user.role === "employee" ? "/employee" : "/dashboard"}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold shadow-2xl shadow-violet-500/30 transition-all hover:brightness-110"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
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
            {!user ? (
              <>
                <Link href="/login" className="transition-colors hover:text-white/70">Sign in</Link>
                <Link href="/register" className="transition-colors hover:text-white/70">Register</Link>
              </>
            ) : (
              <Link href={user.role === "employee" ? "/employee" : "/dashboard"} className="transition-colors hover:text-white/70">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
