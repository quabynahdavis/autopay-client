import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-lg font-bold">
            MP
          </div>
          <h1 className="mt-12 text-3xl font-semibold leading-tight">
            Mass payments made simple for Ghanaian businesses
          </h1>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            Process payroll, vendor payments, and bulk transfers securely with
            bank and mobile money support.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/60">
          Trusted by finance teams across Ghana
        </p>
      </div>
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                MP
              </div>
              <span className="font-semibold">MassPay</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
