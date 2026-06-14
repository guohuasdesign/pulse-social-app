import { cookies } from "next/headers";
import TweetCard from "@/components/TweetCard";
import TweetForm from "@/components/TweetForm";
import { verifyJwtToken } from "@/lib/auth";
import { getTweets } from "@/lib/tweets";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = await cookies();
  const currentUser = verifyJwtToken(cookieStore.get("token")?.value);
  const tweets = await getTweets(currentUser?.userId);

  return (
    <main className="mx-auto w-full max-w-2xl">
      <h1 className="border-b border-gray-200 px-4 py-4 text-2xl font-bold">
        Your Tweets
      </h1>
      <TweetForm />
      {tweets.length > 0 ? (
        tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            currentUserId={currentUser?.userId}
          />
        ))
      ) : (
        <p className="px-4 py-6 text-gray-600">No tweets yet.</p>
      )}
    </main>
  );
}
