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

export default function KeysPage() {
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
        body: JSON.stringify({ name: newKeyName || "默认密钥" }),
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
        alert(data.error || "无法获取密钥");
      }
    } catch {
      setCopiedKeyId(null);
      alert("网络错误");
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
          <h1 className="text-xl font-semibold text-zinc-950">API 密钥</h1>
          <p className="mt-1 text-sm text-zinc-600">
            管理用于 Skill 和 REST API 调用的密钥
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              创建密钥
            </Button>
          </DialogTrigger>
          <DialogContent>
            {!createdKey ? (
              <>
                <DialogHeader>
                  <DialogTitle>创建 API 密钥</DialogTitle>
                  <DialogDescription>
                    为密钥设置一个名称以便识别
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Input
                    placeholder="密钥名称（可选）"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleCreate} disabled={creating}>
                    {creating ? "创建中..." : "创建"}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>密钥已创建</DialogTitle>
                  <DialogDescription>
                    请立即复制密钥，关闭后将无法再次查看完整密钥。
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <code className="block break-all rounded-md bg-zinc-100 px-3 py-2 text-xs font-mono">
                    {createdKey}
                  </code>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                    {copied ? "已复制" : "复制密钥"}
                  </Button>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => handleDialogClose(false)}>
                    关闭
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">已创建的密钥</CardTitle>
          <CardDescription>
            密钥用于通过 REST API 调用 iCalAgent 服务
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-4 text-center text-sm text-zinc-500">加载中...</p>
          ) : keys.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-zinc-500">
              <Key className="h-8 w-8" />
              <p className="text-sm">还没有创建任何密钥</p>
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
                          已吊销
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <code>{k.keyPrefix}...</code>
                      <span>
                        创建于{" "}
                        {new Date(k.createdAt).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!k.revokedAt && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleCopyKey(k.id)}
                        title="复制密钥"
                      >
                        {copiedKeyId === k.id ? (
                          <span className="text-xs text-green-600">已复制</span>
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
                        title="吊销密钥"
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
            <AlertDialogTitle>确认吊销密钥</AlertDialogTitle>
            <AlertDialogDescription>
              密钥「{revokeTarget?.name}」（{revokeTarget?.keyPrefix}...）吊销后将立即失效，使用该密钥的所有服务将无法继续访问。此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevokeConfirm} className="bg-red-600 hover:bg-red-700">
              确认吊销
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
