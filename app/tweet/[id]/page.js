import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import CommentDeleteButton from "@/components/CommentDeleteButton";
import CommentForm from "@/components/CommentForm";
import { verifyJwtToken } from "@/lib/auth";
import { getCommentsByTweetId } from "@/lib/comments";
import { getTweetById } from "@/lib/tweets";

export const dynamic = "force-dynamic";

export default async function TweetDetail({ params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const currentUser = verifyJwtToken(cookieStore.get("token")?.value);
  const tweet = await getTweetById(id, currentUser?.userId);

  if (!tweet) {
    notFound();
  }

  const canComment = tweet.source === "mongodb";
  const comments = canComment ? await getCommentsByTweetId(tweet.id) : [];
  const publishedAt = tweet.createdAt
    ? new Date(tweet.createdAt).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Berlin",
      })
    : null;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6">
      <Link
        href="/home"
        className="text-sm hover:underline"
        style={{ color: "var(--accent)" }}
      >
        Back to home
      </Link>

      <article className="card mt-4">
        <h1
          className="text-3xl"
          style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
        >
          {tweet.title}
        </h1>
        <p className="mt-4 whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
          {tweet.body}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: "var(--text-muted)" }}>
          {publishedAt ? (
            <time dateTime={new Date(tweet.createdAt).toISOString()}>
              {publishedAt}
            </time>
          ) : null}
          <span>Likes: {tweet.reactions?.likes ?? 0}</span>
          <span>Dislikes: {tweet.reactions?.dislikes ?? 0}</span>
          <span>Reposts: {tweet.reactions?.reposts ?? 0}</span>
        </div>
      </article>

      <section className="card mt-5">
        <div className="flex items-center justify-between gap-3">
          <h2
            className="text-2xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Comments
          </h2>
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            {comments.length}
          </span>
        </div>

        {canComment ? (
          currentUser ? (
            <CommentForm tweetId={tweet.id} />
          ) : (
            <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
              Please log in to comment.
            </p>
          )
        ) : (
          <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
            Comments are available for Pulse tweets only.
          </p>
        )}

        <div className="mt-6 space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-md border px-3 py-3"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-medium" style={{ color: "var(--foreground)" }}>
                      {comment.userEmail ?? "Pulse user"}
                    </span>
                    <time className="ml-2" style={{ color: "var(--text-muted)" }}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </time>
                  </div>
                  {currentUser?.userId === comment.userId ? (
                    <CommentDeleteButton
                      tweetId={tweet.id}
                      commentId={comment.id}
                    />
                  ) : null}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm">{comment.body}</p>
              </article>
            ))
          ) : (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No comments yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
