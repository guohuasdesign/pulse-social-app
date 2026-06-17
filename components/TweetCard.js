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

  const actionButtonClass =
    "rounded-md border px-3 py-1 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60";
  const inactiveActionStyle = {
    borderColor: "var(--border)",
    color: "var(--text-muted)",
  };
  const activeActionStyle = {
    borderColor: "rgba(180, 88, 55, 0.28)",
    background: "rgba(180, 88, 55, 0.08)",
    color: "var(--accent)",
  };
  const publishedAt = tweet.createdAt
    ? new Date(tweet.createdAt).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Berlin",
      })
    : null;

  return (
    <article className="card mt-4">
      <Link
        href={`/tweet/${tweet.id}`}
        className="block rounded-md transition-opacity hover:opacity-80"
      >
        <div className="flex items-start justify-between gap-3">
          <h2
            className="text-2xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            {tweet.title}
          </h2>
          {tweet.source === "dummyjson" ? (
            <span
              className="rounded-md border px-2 py-1 text-xs"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              Demo
            </span>
          ) : null}
          {tweet.isRepost ? (
            <span
              className="rounded-md border px-2 py-1 text-xs"
              style={{
                borderColor: "rgba(180, 88, 55, 0.28)",
                color: "var(--accent)",
              }}
            >
              Repost
            </span>
          ) : null}
        </div>

        <p className="mt-3 line-clamp-3" style={{ color: "var(--foreground)" }}>
          {tweet.body}
        </p>

        <div
          className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          {publishedAt ? (
            <time dateTime={new Date(tweet.createdAt).toISOString()}>
              {publishedAt}
            </time>
          ) : null}
          <span>Likes: {tweet.reactions?.likes ?? 0}</span>
          <span>Dislikes: {tweet.reactions?.dislikes ?? 0}</span>
          <span>Reposts: {tweet.reactions?.reposts ?? 0}</span>
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
              className={actionButtonClass}
              style={tweet.viewer?.liked ? activeActionStyle : inactiveActionStyle}
            >
              {updatingAction === "like" ? "Liking..." : "Like"}
            </button>

            <button
              type="button"
              onClick={() => handleAction("dislike")}
              disabled={Boolean(updatingAction)}
              className={actionButtonClass}
              style={
                tweet.viewer?.disliked ? activeActionStyle : inactiveActionStyle
              }
            >
              {updatingAction === "dislike" ? "Updating..." : "Dislike"}
            </button>

            <button
              type="button"
              onClick={() => handleAction("bookmark")}
              disabled={Boolean(updatingAction)}
              className={actionButtonClass}
              style={
                tweet.viewer?.bookmarked
                  ? activeActionStyle
                  : inactiveActionStyle
              }
            >
              {updatingAction === "bookmark"
                ? "Saving..."
                : tweet.viewer?.bookmarked
                  ? "Bookmarked"
                  : "Bookmark"}
            </button>

            <button
              type="button"
              onClick={() => handleAction("repost")}
              disabled={Boolean(updatingAction)}
              className={actionButtonClass}
              style={
                tweet.viewer?.reposted ? activeActionStyle : inactiveActionStyle
              }
            >
              {updatingAction === "repost"
                ? "Reposting..."
                : tweet.viewer?.reposted
                  ? "Reposted"
                  : "Repost"}
            </button>
          </>
        ) : null}

        {isOwner ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-md border px-3 py-1 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor: "rgba(220, 38, 38, 0.24)",
              color: "#dc2626",
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        ) : null}
      </div>
    </article>
  );
};

export default TweetCard;
