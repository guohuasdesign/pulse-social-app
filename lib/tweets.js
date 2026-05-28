import mongoose from "mongoose";
import { makeSureDbIsReady } from "@/lib/db/database";
import { Tweet } from "@/lib/models/Tweet";

const DUMMYJSON_POSTS_URL = "https://dummyjson.com/posts";

function formatMongoTweet(tweet) {
  return {
    id: tweet._id.toString(),
    title: tweet.title,
    body: tweet.body,
    reactions: tweet.reactions ?? {
      likes: 0,
      dislikes: 0,
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

export async function getTweets() {
  await makeSureDbIsReady();
  const mongoTweets = await Tweet.find({}).sort({ createdAt: -1 }).lean();
  const dummyJsonTweets = await getDummyJsonTweets();

  return [...mongoTweets.map(formatMongoTweet), ...dummyJsonTweets];
}

export async function getTweetById(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    await makeSureDbIsReady();
    const tweet = await Tweet.findById(id).lean();

    if (tweet) {
      return formatMongoTweet(tweet);
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

export async function createTweet({ title, body }) {
  await makeSureDbIsReady();
  const tweet = await Tweet.create({
    title,
    body,
    reactions: {
      likes: 0,
      dislikes: 0,
    },
  });

  return formatMongoTweet(tweet.toObject());
}

export async function updateTweet(id, { title, body }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  await makeSureDbIsReady();
  const tweet = await Tweet.findByIdAndUpdate(
    id,
    { title, body },
    { new: true },
  ).lean();

  return tweet ? formatMongoTweet(tweet) : null;
}

export async function deleteTweet(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  await makeSureDbIsReady();
  const tweet = await Tweet.findByIdAndDelete(id).lean();

  return tweet ? formatMongoTweet(tweet) : null;
}
