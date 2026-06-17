"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CommentForm({ tweetId }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    const response = await fetch(`/api/tweets/${tweetId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body }),
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Could not post comment.");
      return;
    }

    setBody("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5">
      <label className="sr-only" htmlFor="comment">
        Add a comment
      </label>
      <textarea
        id="comment"
        className="input min-h-24 resize-y"
        maxLength={280}
        placeholder="Add a comment..."
        value={body}
        onChange={(event) => setBody(event.target.value)}
        required
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {body.length}/280
        </p>
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
          style={{
            opacity: isSubmitting ? 0.6 : undefined,
            cursor: isSubmitting ? "not-allowed" : undefined,
          }}
        >
          {isSubmitting ? "Posting..." : "Comment"}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
