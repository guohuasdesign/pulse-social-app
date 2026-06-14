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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    <form
      onSubmit={handleSubmit}
      className="border-b border-gray-200 bg-white px-4 py-4"
    >
      <label
        className="block text-sm font-medium text-gray-700"
        htmlFor="title"
      >
        Title
      </label>
      <input
        id="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        placeholder="What is happening?"
      />

      <label
        className="mt-4 block text-sm font-medium text-gray-700"
        htmlFor="body"
      >
        Tweet
      </label>
      <textarea
        id="body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        className="mt-2 min-h-24 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        placeholder="tweet your idea..."
      />

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isSubmitting ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
