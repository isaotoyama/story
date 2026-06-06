"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ModerationButtons({ id, approved }: { id: string; approved: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function approve() {
    setLoading(true);
    await fetch(`/api/contributions/${id}/approve`, { method: "PATCH" });
    setLoading(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this contribution?")) return;
    setLoading(true);
    await fetch(`/api/contributions/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      {!approved && <button onClick={approve} disabled={loading} className="btn-secondary">Approve</button>}
      <button onClick={remove} disabled={loading} className="btn-secondary">Delete</button>
    </div>
  );
}
