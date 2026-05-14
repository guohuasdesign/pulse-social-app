import Link from "next/link";

const TweetCard = ({ tweet }) => {
  return (
    <article className="border-b border-gray-200 px-4 py-4">
      <Link href={`/tweet/${tweet.id}`} className="block hover:bg-gray-50">
        <h2 className="font-semibold">{tweet.title}</h2>
        <p className="mt-2 text-gray-700">{tweet.body}</p>
        <div className="mt-3 flex gap-4 text-sm text-gray-500">
          <span>Likes: {tweet.reactions?.likes ?? 0}</span>
          <span>Dislikes: {tweet.reactions?.dislikes ?? 0}</span>
        </div>
      </Link>
    </article>
  );
};

export default TweetCard;
