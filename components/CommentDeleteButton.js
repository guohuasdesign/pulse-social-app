"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CommentDeleteButton({ tweetId, commentId }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = confirm("Delete this comment?");

    if (!confirmed) return;

    setError("");
    setIsDeleting(true);

    const response = await fetch(
      `/api/tweets/${tweetId}/comments/${commentId}`,
      {
        method: "DELETE",
      },
    );

    setIsDeleting(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Could not delete comment.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-xs font-medium hover:underline disabled:cursor-not-allowed disabled:opacity-60"
        style={{ color: "#dc2626" }}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
