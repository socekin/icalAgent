"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { t, getClientLocale, type Locale } from "@/i18n";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [locale] = useState<Locale>(getClientLocale);
  const [error, setError] = useState("");

  useEffect(() => {
    async function handleCallback() {
      // Parse tokens from URL hash fragment (#access_token=...&refresh_token=...)
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken) {
        setError(t(locale, "auth.callback.invalidLink"));
        return;
      }

      try {
        const res = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken, refreshToken }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || t(locale, "auth.callback.failed"));
          return;
        }

        router.push("/dashboard");
        router.refresh();
      } catch {
        setError(t(locale, "auth.callback.networkError"));
      }
    }

    handleCallback();
  }, [locale, router]);

  if (error) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t(locale, "auth.callback.errorTitle")}</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/login">{t(locale, "auth.callback.backToLogin")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        <div className="text-center">
          <p className="font-medium">{t(locale, "auth.callback.verifying")}</p>
          <p className="text-sm text-zinc-500">{t(locale, "auth.callback.pleaseWait")}</p>
        </div>
      </div>
    </div>
  );
}
