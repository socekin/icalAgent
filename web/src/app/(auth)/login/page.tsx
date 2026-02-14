"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { t, getClientLocale, type Locale } from "@/i18n";
import { createBrowserClient } from "@/lib/supabase-browser";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");

  const [locale] = useState<Locale>(getClientLocale);
  const [error] = useState(callbackError || "");
  const [loading, setLoading] = useState(false);

  async function handleGitHubLogin() {
    setLoading(true);
    const supabase = createBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t(locale, "auth.login.title")}</CardTitle>
        <CardDescription>{t(locale, "auth.login.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}
        <Button
          className="w-full"
          size="lg"
          onClick={handleGitHubLogin}
          disabled={loading}
        >
          <Github className="mr-2 h-5 w-5" />
          {loading ? t(locale, "auth.login.signingIn") : t(locale, "auth.login.withGitHub")}
        </Button>
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
