import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@components/auth/AuthForm";
import { LogoWordmark } from "@/app/components/Logo";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Single soft brand glow behind the card */}
      <div
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoWordmark size={40} />
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Sign in to continue your practice</p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <AuthForm initialMode="login" successRedirectTo="/" />
        </div>

        <div className="mt-6 text-center text-sm">
          <Link
            href="/welcome"
            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
