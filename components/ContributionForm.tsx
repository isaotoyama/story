"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ContributionForm({ topicId }: { topicId: string }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Please write the next scene.");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch(`/api/topics/${topicId}/contributions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        website: honeypot,
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || "Failed to post contribution.");
      return;
    }

    setContent("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card form">
      <h2>Add the next paragraph</h2>

      <p className="muted">
        Use line breaks to create paragraphs. Press return twice between scenes.
      </p>

      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        value={honeypot}
        onChange={(e)=>setHoneypot(e.target.value)}
        style={{
          position:"absolute",
          left:"-9999px",
          opacity:0,
          width:1,
          height:1,
          pointerEvents:"none"
        }}
      />

      <textarea
        className="textarea"
        rows={10}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={`Write the next scene...

Use paragraphs.

Example:

The rain finally stopped.

She opened the door slowly.

Nothing was inside.`}
      />

      {error && (
        <p style={{ color: "#ff3b30", marginTop: 0 }}>
          {error}
        </p>
      )}

      <button
        className="btn btn-primary"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Posting..." : "Post contribution"}
      </button>
    </form>
  );
}
