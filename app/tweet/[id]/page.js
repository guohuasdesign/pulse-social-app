// app/tweet/[id]/page.js - Fetches a single tweet dynamically
async function getTweet(id) {
  const res = await fetch(`https://dummyjson.com/posts/${id}`);
  return res.json();
}

export default async function TweetDetail({ params }) {
  const { id } = await params;
  const tweet = await getTweet(id);

  return (
    <main>
      <h1>{tweet.title}</h1>
      <p>{tweet.body}</p>
      <p>
        Likes: {tweet.reactions?.likes ?? 0} | Dislikes:{" "}
        {tweet.reactions?.dislikes ?? 0}
      </p>
    </main>
  );
}
