import mongoose from "mongoose";
import { makeSureDbIsReady } from "@/lib/db/database";
import { Tweet } from "@/models/Tweet";

const DUMMYJSON_POSTS_URL = "https://dummyjson.com/posts";

function idsInclude(ids = [], userId) {
  return Boolean(userId && ids.some((id) => id.toString() === userId));
}

function formatMongoTweet(tweet, currentUserId) {
  const likedBy = tweet.likedBy ?? [];
  const dislikedBy = tweet.dislikedBy ?? [];
  const bookmarkedBy = tweet.bookmarkedBy ?? [];

  return {
    id: tweet._id.toString(),
    title: tweet.title,
    body: tweet.body,
    userId: tweet.userId?.toString(),
    reactions: {
      likes: likedBy.length || tweet.reactions?.likes || 0,
      dislikes: dislikedBy.length || tweet.reactions?.dislikes || 0,
    },
    viewer: {
      liked: idsInclude(likedBy, currentUserId),
      disliked: idsInclude(dislikedBy, currentUserId),
      bookmarked: idsInclude(bookmarkedBy, currentUserId),
    },
    createdAt: tweet.createdAt,
    source: "mongodb",
  };
}

async function getDummyJsonTweets() {
  const response = await fetch(DUMMYJSON_POSTS_URL);
  const data = await response.json();
  return data.posts.map((tweet) => ({
    ...tweet,
    id: tweet.id.toString(),
    source: "dummyjson",
  }));
}

export async function getTweets(currentUserId) {
  await makeSureDbIsReady();
  const mongoTweets = await Tweet.find({}).sort({ createdAt: -1 }).lean();
  const dummyJsonTweets = await getDummyJsonTweets();

  return [
    ...mongoTweets.map((tweet) => formatMongoTweet(tweet, currentUserId)),
    ...dummyJsonTweets,
  ];
}

export async function getTweetById(id, currentUserId) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    await makeSureDbIsReady();
    const tweet = await Tweet.findById(id).lean();

    if (tweet) {
      return formatMongoTweet(tweet, currentUserId);
    }
  }

  const response = await fetch(`${DUMMYJSON_POSTS_URL}/${id}`);

  if (!response.ok) {
    return null;
  }

  const tweet = await response.json();
  return {
    ...tweet,
    id: tweet.id.toString(),
    source: "dummyjson",
  };
}

export async function createTweet({ title, body, userId }) {
  await makeSureDbIsReady();
  const tweet = await Tweet.create({
    title,
    body,
    userId,
    reactions: {
      likes: 0,
      dislikes: 0,
    },
  });

  return formatMongoTweet(tweet.toObject(), userId);
}

export async function updateTweet(id, { title, body, userId }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  await makeSureDbIsReady();
  const tweet = await Tweet.findOneAndUpdate(
    { _id: id, userId },
    { title, body },
    { new: true },
  ).lean();

  return tweet ? formatMongoTweet(tweet, userId) : null;
}

export async function toggleTweetAction(id, action, userId) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  if (!["like", "dislike", "bookmark"].includes(action)) {
    return null;
  }

  await makeSureDbIsReady();
  const tweet = await Tweet.findById(id);

  if (!tweet) {
    return null;
  }

  tweet.likedBy ??= [];
  tweet.dislikedBy ??= [];
  tweet.bookmarkedBy ??= [];

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const hasLiked = idsInclude(tweet.likedBy, userId);
  const hasDisliked = idsInclude(tweet.dislikedBy, userId);
  const hasBookmarked = idsInclude(tweet.bookmarkedBy, userId);

  if (action === "like") {
    tweet.likedBy = hasLiked
      ? tweet.likedBy.filter((id) => id.toString() !== userId)
      : [...tweet.likedBy, userObjectId];
    tweet.dislikedBy = tweet.dislikedBy.filter((id) => id.toString() !== userId);
  }

  if (action === "dislike") {
    tweet.dislikedBy = hasDisliked
      ? tweet.dislikedBy.filter((id) => id.toString() !== userId)
      : [...tweet.dislikedBy, userObjectId];
    tweet.likedBy = tweet.likedBy.filter((id) => id.toString() !== userId);
  }

  if (action === "bookmark") {
    tweet.bookmarkedBy = hasBookmarked
      ? tweet.bookmarkedBy.filter((id) => id.toString() !== userId)
      : [...tweet.bookmarkedBy, userObjectId];
  }

  tweet.reactions = {
    likes: tweet.likedBy.length,
    dislikes: tweet.dislikedBy.length,
  };

  await tweet.save();

  return formatMongoTweet(tweet.toObject(), userId);
}

export async function deleteTweet(id, userId) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  await makeSureDbIsReady();
  const tweet = await Tweet.findOneAndDelete({ _id: id, userId }).lean();

  return tweet ? formatMongoTweet(tweet, userId) : null;
}
