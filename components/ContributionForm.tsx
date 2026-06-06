"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ContributionForm({ topicId }: { topicId: string }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(`/api/topics/${topicId}/contributions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return setError(json.error ?? "Could not add contribution.");
    setContent("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card space-y-4">
      <h2 className="text-xl font-bold">Continue the story</h2>
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <textarea className="input min-h-40" placeholder="Write the next paragraph or scene..." value={content} onChange={(e) => setContent(e.target.value)} required maxLength={2000} />
      <button className="btn" disabled={loading}>{loading ? "Posting..." : "Add contribution"}</button>
    </form>
  );
}
