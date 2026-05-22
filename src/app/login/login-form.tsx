"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (!result?.ok) {
        setError("Username atau password salah.");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label
          htmlFor="username"
          className="text-xs uppercase tracking-[0.2em] text-teal-700"
        >
          Username
        </Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          className="h-11 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
          placeholder="admin"
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-xs uppercase tracking-[0.2em] text-teal-700"
        >
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="h-11 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
          placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
        />
      </div>
      {error && (
        <div className="animate-fade-in rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={busy}
        className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-brand-gradient text-base font-semibold text-white shadow-lg shadow-teal-500/30 transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        <span className="animate-shimmer absolute inset-0" />
        {busy ? (
          <Loader2 className="relative h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
        )}
        <span className="relative">Masuk</span>
      </button>
    </form>
  );
}