import { notFound } from "next/navigation";
import { getTweetById } from "@/lib/tweets";

export const dynamic = "force-dynamic";

export default async function TweetDetail({ params }) {
  const { id } = await params;
  const tweet = await getTweetById(id);

  if (!tweet) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-2xl bg-white px-4 py-6">
      <h1 className="text-2xl font-bold">{tweet.title}</h1>
      <p className="mt-4 text-gray-700">{tweet.body}</p>
      <p className="mt-4 text-sm text-gray-500">
        Likes: {tweet.reactions?.likes ?? 0} | Dislikes:{" "}
        {tweet.reactions?.dislikes ?? 0}
      </p>
    </main>
  );
}
