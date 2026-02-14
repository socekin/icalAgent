"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { t, getClientLocale, type Locale } from "@/i18n";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [locale] = useState<Locale>(getClientLocale);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, turnstileToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t(locale, "auth.login.failed"));
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError(t(locale, "auth.login.networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t(locale, "auth.login.title")}</CardTitle>
        <CardDescription>{t(locale, "auth.login.description")}</CardDescription>
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
              {t(locale, "auth.login.email")}
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
              {t(locale, "auth.login.password")}
            </label>
            <Input
              id="password"
              type="password"
              placeholder={t(locale, "auth.login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? t(locale, "auth.login.submitting") : t(locale, "auth.login.submit")}
          </Button>
          <p className="text-center text-sm text-zinc-600">
            {t(locale, "auth.login.noAccount")}
            <Link href="/register" className="font-medium text-zinc-900 underline underline-offset-4">
              {t(locale, "auth.login.register")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  const [locale] = useState<Locale>(getClientLocale);

  return (
    <div className="flex min-h-dvh w-full items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild className="text-zinc-500 hover:text-zinc-900">
            <Link href="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              {t(locale, "auth.login.backHome")}
            </Link>
          </Button>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
