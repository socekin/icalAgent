"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { t, getClientLocale, type Locale } from "@/i18n";

export default function RegisterPage() {
  const router = useRouter();

  const [locale] = useState<Locale>(getClientLocale);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t(locale, "auth.register.passwordMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t(locale, "auth.register.passwordTooShort"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, turnstileToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t(locale, "auth.register.failed"));
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(t(locale, "auth.register.networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t(locale, "auth.register.title")}</CardTitle>
        <CardDescription>{t(locale, "auth.register.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t(locale, "auth.register.email")}
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t(locale, "auth.register.password")}
            </label>
            <Input
              id="password"
              type="password"
              placeholder={t(locale, "auth.register.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              {t(locale, "auth.register.confirmPassword")}
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t(locale, "auth.register.confirmPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onSuccess={setTurnstileToken}
            onError={() => setTurnstileToken("")}
            onExpire={() => setTurnstileToken("")}
            options={{ theme: "light", size: "normal", language: locale === "zh-CN" ? "zh-cn" : "en" }}
          />
          <Button type="submit" className="w-full" disabled={loading || !turnstileToken}>
            {loading ? t(locale, "auth.register.submitting") : t(locale, "auth.register.submit")}
          </Button>
          <p className="text-center text-sm text-zinc-600">
            {t(locale, "auth.register.hasAccount")}
            <Link href="/login" className="font-medium text-zinc-900 underline underline-offset-4">
              {t(locale, "auth.register.login")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
