import { cookies } from "next/headers";
import TweetCard from "@/components/TweetCard";
import { verifyJwtToken } from "@/lib/auth";
import { getBookmarkedTweets } from "@/lib/tweets";

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const cookieStore = await cookies();
  const currentUser = verifyJwtToken(cookieStore.get("token")?.value);
  const tweets = await getBookmarkedTweets(currentUser?.userId);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6">
      <section className="card">
        <h1
          className="text-3xl"
          style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
        >
          Bookmarks
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Tweets you saved for later.
        </p>
      </section>

      <div className="mt-4 overflow-hidden rounded-md">
        {tweets.length > 0 ? (
          tweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              currentUserId={currentUser?.userId}
            />
          ))
        ) : (
          <p className="card text-sm" style={{ color: "var(--text-muted)" }}>
            No bookmarks yet.
          </p>
        )}
      </div>
    </main>
  );
}
