// app/page.js - Fetching tweets from DummyJSON API
import TweetCard from "./components/TweetCard";

async function getTweets() {
  const res = await fetch("https://dummyjson.com/posts");
  return res.json();
}

export default async function HomePage() {
  const tweets = await getTweets();

  return (
    <main className="mx-auto w-full max-w-2xl">
      <h1 className="border-b border-gray-200 px-4 py-4 text-2xl font-bold">
        Latest Tweets
      </h1>
      {tweets.posts.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </main>
  );
}
