"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import VoiceTranscribeButton from "@/components/VoiceTranscribeButton";

const TweetCard = ({ tweet, currentUserId }) => {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [updatingAction, setUpdatingAction] = useState("");
  const [error, setError] = useState("");

  const isOwner =
    currentUserId && tweet.userId && currentUserId === tweet.userId.toString();
  const canInteract = tweet.source === "mongodb";

  function playReactionSound(action) {
    if (!["like", "dislike"].includes(action)) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) return;

    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const startTime = audioContext.currentTime;
    const endTime = startTime + 0.14;
    const startFrequency = action === "like" ? 520 : 220;
    const endFrequency = action === "like" ? 760 : 140;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(startFrequency, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, endTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime);

    oscillator.onended = () => {
      audioContext.close();
    };
  }

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

    playReactionSound(action);
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

  async function handleComment(event) {
    event.preventDefault();
    if (isCommenting) return;

    setIsCommenting(true);
    setError("");

    const response = await fetch(`/api/tweets/${tweet.id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: commentBody }),
    });

    setIsCommenting(false);

    if (!response.ok) {
      const data = await response.json();

      setError(data.error ?? "Could not post comment.");
      return;
    }

    setCommentBody("");
    router.refresh();
  }

  function appendCommentTranscript(transcript) {
    setCommentBody((currentBody) =>
      currentBody ? `${currentBody} ${transcript}` : transcript,
    );
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
          <span>Comments: {tweet.commentsCount ?? 0}</span>
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

      {canInteract ? (
        <section
          className="mt-5 border-t pt-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="space-y-3">
            {tweet.comments?.length > 0 ? (
              tweet.comments.map((comment) => (
                <article key={comment.id} className="text-sm">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className="font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      {comment.userEmail ?? "Pulse user"}
                    </span>
                    <time style={{ color: "var(--text-muted)" }}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </time>
                  </div>
                  <p className="mt-1" style={{ color: "var(--foreground)" }}>
                    {comment.body}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No comments yet.
              </p>
            )}
          </div>

          {currentUserId ? (
            <form onSubmit={handleComment} className="mt-4">
              <label className="sr-only" htmlFor={`comment-${tweet.id}`}>
                Add a comment
              </label>
              <textarea
                id={`comment-${tweet.id}`}
                className="input min-h-20 resize-y"
                maxLength={280}
                placeholder="Add a comment..."
                value={commentBody}
                onChange={(event) => setCommentBody(event.target.value)}
                required
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {commentBody.length}/280
                </p>
                <div className="flex items-center gap-2">
                  <VoiceTranscribeButton
                    disabled={isCommenting}
                    onError={setError}
                    onTranscript={appendCommentTranscript}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isCommenting}
                    style={{
                      opacity: isCommenting ? 0.6 : undefined,
                      cursor: isCommenting ? "not-allowed" : undefined,
                      padding: "6px 14px",
                    }}
                  >
                    {isCommenting ? "Posting..." : "Comment"}
                  </button>
                </div>
              </div>
            </form>
          ) : null}

          {(tweet.commentsCount ?? 0) > (tweet.comments?.length ?? 0) ? (
            <Link
              href={`/tweet/${tweet.id}`}
              className="mt-3 inline-block text-sm hover:underline"
              style={{ color: "var(--accent)" }}
            >
              View all comments
            </Link>
          ) : null}
        </section>
      ) : null}
    </article>
  );
};

export default TweetCard;
