"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TweetCard = ({ tweet, currentUserId }) => {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingAction, setUpdatingAction] = useState("");
  const [error, setError] = useState("");

  const isOwner =
    currentUserId && tweet.userId && currentUserId === tweet.userId.toString();
  const canInteract = tweet.source === "mongodb";

  async function handleAction(action) {
    setUpdatingAction(action);
    setError("");

    const response = await fetch(`/api/tweets/${tweet.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action }),
    });

    setUpdatingAction("");

    if (!response.ok) {
      const data = await response.json();

      setError(data.error ?? "Could not update tweet.");
      return;
    }

    router.refresh();
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = confirm("Are you sure you want to delete this tweet?");

    if (!confirmed) return;

    setIsDeleting(true);
    setError("");

    const response = await fetch(`/api/tweets/${tweet.id}`, {
      method: "DELETE",
    });

    setIsDeleting(false);

    if (!response.ok) {
      const data = await response.json();

      setError(data.error ?? "Could not delete tweet.");
      return;
    }

    router.refresh();
  }

  return (
    <article className="border-b border-gray-200 px-4 py-4">
      <Link
        href={`/tweet/${tweet.id}`}
        className="block rounded-md hover:bg-gray-50"
      >
        <h2 className="font-semibold">{tweet.title}</h2>

        <p className="mt-2 text-gray-700">{tweet.body}</p>

        <div className="mt-3 flex gap-4 text-sm text-gray-500">
          <span>Likes: {tweet.reactions?.likes ?? 0}</span>

          <span>Dislikes: {tweet.reactions?.dislikes ?? 0}</span>
        </div>
      </Link>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {canInteract ? (
          <>
            <button
              type="button"
              onClick={() => handleAction("like")}
              disabled={Boolean(updatingAction)}
              className={`rounded-md border px-3 py-1 text-sm ${
                tweet.viewer?.liked
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {updatingAction === "like" ? "Liking..." : "Like"}
            </button>

            <button
              type="button"
              onClick={() => handleAction("dislike")}
              disabled={Boolean(updatingAction)}
              className={`rounded-md border px-3 py-1 text-sm ${
                tweet.viewer?.disliked
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {updatingAction === "dislike" ? "Updating..." : "Dislike"}
            </button>

            <button
              type="button"
              onClick={() => handleAction("bookmark")}
              disabled={Boolean(updatingAction)}
              className={`rounded-md border px-3 py-1 text-sm ${
                tweet.viewer?.bookmarked
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {updatingAction === "bookmark" ? "Saving..." : "Bookmark"}
            </button>
          </>
        ) : null}

        {isOwner ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:bg-red-300"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        ) : null}
      </div>
    </article>
  );
};

export default TweetCard;
