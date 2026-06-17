"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TweetForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/tweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Could not create tweet.");
      return;
    }

    setTitle("");
    setBody("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card mt-4">
      <div className="mb-5">
        <h2
          className="text-2xl"
          style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
        >
          Share an idea
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Write a short thought for your Pulse feed.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="sr-only" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What is happening?"
            required
          />
        </div>

        <div>
          <label className="sr-only" htmlFor="body">
            Tweet
          </label>
          <textarea
            id="body"
            className="input min-h-28 resize-y"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Tweet your idea..."
            required
          />
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {body.length} characters
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
          style={{
            opacity: isSubmitting ? 0.6 : undefined,
            cursor: isSubmitting ? "not-allowed" : undefined,
          }}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
