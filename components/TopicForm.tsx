"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TopicForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return setError(json.error ?? "Could not create topic.");
    router.push(`/topics/${json.topic.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card space-y-4">
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <label className="block space-y-2">
        <span className="font-medium">Topic title</span>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} />
      </label>
      <label className="block space-y-2">
        <span className="font-medium">Story premise</span>
        <textarea className="input min-h-36" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} />
      </label>
      <button className="btn" disabled={loading}>{loading ? "Creating..." : "Create topic"}</button>
    </form>
  );
}
