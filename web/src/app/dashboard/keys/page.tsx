"use client";

import { useEffect, useState, useCallback } from "react";
import { Copy, Plus, Trash2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ApiKey } from "@/lib/types";
import { t, getClientLocale, type Locale } from "@/i18n";

export default function KeysPage() {
  const [locale] = useState<Locale>(getClientLocale);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch("/api/keys");
      const data = await res.json();
      if (res.ok) {
        setKeys(data.keys);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName || t(locale, "keys.createDialog.defaultName") }),
      });
      const data = await res.json();
      if (res.ok) {
        setCreatedKey(data.key);
        setNewKeyName("");
        fetchKeys();
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleRevokeConfirm() {
    if (!revokeTarget) return;
    const res = await fetch(`/api/keys/${revokeTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      fetchKeys();
    }
    setRevokeTarget(null);
  }

  function handleCopy() {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleCopyKey(id: string) {
    try {
      setCopiedKeyId(id);
      const res = await fetch(`/api/keys/${id}/reveal`);
      const data = await res.json();
      if (res.ok && data.key) {
        await navigator.clipboard.writeText(data.key);
        setTimeout(() => setCopiedKeyId(null), 2000);
      } else {
        setCopiedKeyId(null);
        alert(data.error || t(locale, "keys.error.cannotReveal"));
      }
    } catch {
      setCopiedKeyId(null);
      alert(t(locale, "keys.error.network"));
    }
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setCreatedKey(null);
      setCopied(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-950">{t(locale, "keys.title")}</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {t(locale, "keys.description")}
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              {t(locale, "keys.create")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            {!createdKey ? (
              <>
                <DialogHeader>
                  <DialogTitle>{t(locale, "keys.createDialog.title")}</DialogTitle>
                  <DialogDescription>
                    {t(locale, "keys.createDialog.description")}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Input
                    placeholder={t(locale, "keys.createDialog.placeholder")}
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleCreate} disabled={creating}>
                    {creating ? t(locale, "keys.createDialog.creating") : t(locale, "keys.createDialog.submit")}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>{t(locale, "keys.createdDialog.title")}</DialogTitle>
                  <DialogDescription>
                    {t(locale, "keys.createdDialog.description")}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <code className="block break-all rounded-md bg-zinc-100 px-3 py-2 text-xs font-mono">
                    {createdKey}
                  </code>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                    {copied ? t(locale, "keys.createdDialog.copied") : t(locale, "keys.createdDialog.copy")}
                  </Button>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => handleDialogClose(false)}>
                    {t(locale, "keys.createdDialog.close")}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t(locale, "keys.list.title")}</CardTitle>
          <CardDescription>
            {t(locale, "keys.list.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-4 text-center text-sm text-zinc-500">{t(locale, "keys.list.loading")}</p>
          ) : keys.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-zinc-500">
              <Key className="h-8 w-8" />
              <p className="text-sm">{t(locale, "keys.list.empty")}</p>
            </div>
          ) : (
            <div className="divide-y">
              {keys.map((k) => (
                <div
                  key={k.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{k.name}</span>
                      {k.revokedAt && (
                        <span className="rounded bg-red-50 px-1.5 py-0.5 text-xs text-red-600">
                          {t(locale, "keys.list.revoked")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <code>{k.keyPrefix}...</code>
                      <span>
                        {t(locale, "keys.list.createdAt")}{" "}
                        {new Date(k.createdAt).toLocaleDateString(locale)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!k.revokedAt && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleCopyKey(k.id)}
                        title={t(locale, "keys.list.copyTitle")}
                      >
                        {copiedKeyId === k.id ? (
                          <span className="text-xs text-green-600">{t(locale, "keys.list.copied")}</span>
                        ) : (
                          <Copy className="h-4 w-4 text-zinc-500" />
                        )}
                      </Button>
                    )}
                    {!k.revokedAt && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setRevokeTarget(k)}
                        title={t(locale, "keys.list.revokeTitle")}
                      >
                        <Trash2 className="h-4 w-4 text-zinc-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!revokeTarget} onOpenChange={(open) => !open && setRevokeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t(locale, "keys.revoke.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(locale, "keys.revoke.description")
                .replace("{name}", revokeTarget?.name ?? "")
                .replace("{prefix}", revokeTarget?.keyPrefix ?? "")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t(locale, "keys.revoke.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevokeConfirm} className="bg-red-600 hover:bg-red-700">
              {t(locale, "keys.revoke.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
