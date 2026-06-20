import mongoose from "mongoose";
import { Comment } from "@/models/Comment";
import { makeSureDbIsReady } from "@/lib/db/database";
import { formatComment } from "@/lib/comments";
import { Tweet } from "@/models/Tweet";
import "@/models/User";

const DUMMYJSON_POSTS_URL = "https://dummyjson.com/posts";

function idsInclude(ids = [], userId) {
  return Boolean(userId && ids.some((id) => id.toString() === userId));
}

function formatMongoTweet(tweet, currentUserId, commentSummary) {
  const repostOf = tweet.repostOf?._id ?? tweet.repostOf;
  const targetTweetId = repostOf?.toString() ?? tweet._id.toString();
  const likedBy = tweet.likedBy ?? [];
  const dislikedBy = tweet.dislikedBy ?? [];
  const bookmarkedBy = tweet.bookmarkedBy ?? [];
  const repostedBy = tweet.repostedBy ?? [];

  return {
    id: tweet._id.toString(),
    title: tweet.title,
    body: tweet.body,
    userId: tweet.userId?.toString(),
    repostOf: repostOf?.toString(),
    isRepost: Boolean(repostOf),
    reactions: {
      likes: likedBy.length || tweet.reactions?.likes || 0,
      dislikes: dislikedBy.length || tweet.reactions?.dislikes || 0,
      reposts: repostedBy.length,
    },
    viewer: {
      liked: idsInclude(likedBy, currentUserId),
      disliked: idsInclude(dislikedBy, currentUserId),
      bookmarked: idsInclude(bookmarkedBy, currentUserId),
      reposted:
        idsInclude(repostedBy, currentUserId) ||
        Boolean(currentUserId && tweet.userId?.toString() === currentUserId && repostOf),
    },
    createdAt: tweet.createdAt,
    comments: commentSummary?.comments ?? [],
    commentsCount: commentSummary?.count ?? 0,
    targetTweetId,
    source: "mongodb",
  };
}

async function getCommentSummaries(tweetIds) {
  if (tweetIds.length === 0) {
    return new Map();
  }

  const comments = await Comment.find({ tweetId: { $in: tweetIds } })
    .sort({ createdAt: -1 })
    .populate("userId", "email")
    .lean();
  const summaries = new Map();

  comments.forEach((comment) => {
    const tweetId = comment.tweetId.toString();
    const summary = summaries.get(tweetId) ?? { comments: [], count: 0 };

    summary.count += 1;

    if (summary.comments.length < 2) {
      summary.comments.push(formatComment(comment));
    }

    summaries.set(tweetId, summary);
  });

  return summaries;
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
  const mongoTweets = await Tweet.collection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  const commentSummaries = await getCommentSummaries(
    mongoTweets.map((tweet) => tweet._id),
  );
  const dummyJsonTweets = await getDummyJsonTweets();

  return [
    ...mongoTweets.map((tweet) =>
      formatMongoTweet(
        tweet,
        currentUserId,
        commentSummaries.get(tweet._id.toString()),
      ),
    ),
    ...dummyJsonTweets,
  ];
}

export async function getBookmarkedTweets(currentUserId) {
  if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
    return [];
  }

  await makeSureDbIsReady();

  const tweets = await Tweet.collection
    .find({ bookmarkedBy: new mongoose.Types.ObjectId(currentUserId) })
    .sort({ createdAt: -1 })
    .toArray();
  const commentSummaries = await getCommentSummaries(
    tweets.map((tweet) => tweet._id),
  );

  return tweets.map((tweet) =>
    formatMongoTweet(
      tweet,
      currentUserId,
      commentSummaries.get(tweet._id.toString()),
    ),
  );
}

export async function getTweetById(id, currentUserId) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    await makeSureDbIsReady();
    const tweet = await Tweet.collection.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

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

  if (!["like", "dislike", "bookmark", "repost"].includes(action)) {
    return null;
  }

  await makeSureDbIsReady();
  const tweet = await Tweet.collection.findOne({
    _id: new mongoose.Types.ObjectId(id),
  });

  if (!tweet) {
    return null;
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const targetTweetId = tweet.repostOf ?? tweet._id;
  const targetTweet = tweet.repostOf
    ? await Tweet.collection.findOne({ _id: targetTweetId })
    : tweet;
  const existingRepost = await Tweet.collection.findOne({
    userId: userObjectId,
    repostOf: targetTweetId,
  });
  const likedBy = tweet.likedBy ?? [];
  const dislikedBy = tweet.dislikedBy ?? [];
  const bookmarkedBy = tweet.bookmarkedBy ?? [];
  const hasLiked = idsInclude(likedBy, userId);
  const hasDisliked = idsInclude(dislikedBy, userId);
  const hasBookmarked = idsInclude(bookmarkedBy, userId);
  const hasReposted = Boolean(existingRepost);

  if (action === "like") {
    await Tweet.collection.updateOne(
      { _id: tweet._id },
      hasLiked
        ? {
            $pull: { likedBy: userObjectId },
            $set: { "reactions.likes": Math.max(likedBy.length - 1, 0) },
          }
        : {
            $addToSet: { likedBy: userObjectId },
            $pull: { dislikedBy: userObjectId },
            $set: {
              "reactions.likes": likedBy.length + 1,
              "reactions.dislikes": hasDisliked
                ? Math.max(dislikedBy.length - 1, 0)
                : dislikedBy.length,
            },
          },
    );
  }

  if (action === "dislike") {
    await Tweet.collection.updateOne(
      { _id: tweet._id },
      hasDisliked
        ? {
            $pull: { dislikedBy: userObjectId },
            $set: {
              "reactions.dislikes": Math.max(dislikedBy.length - 1, 0),
            },
          }
        : {
            $addToSet: { dislikedBy: userObjectId },
            $pull: { likedBy: userObjectId },
            $set: {
              "reactions.likes": hasLiked
                ? Math.max(likedBy.length - 1, 0)
                : likedBy.length,
              "reactions.dislikes": dislikedBy.length + 1,
            },
          },
    );
  }

  if (action === "bookmark") {
    await Tweet.collection.updateOne(
      { _id: tweet._id },
      hasBookmarked
        ? { $pull: { bookmarkedBy: userObjectId } }
        : { $addToSet: { bookmarkedBy: userObjectId } },
    );
  }

  if (action === "repost") {
    if (!targetTweet) {
      return null;
    }

    await Tweet.collection.updateOne(
      { _id: targetTweetId },
      hasReposted
        ? { $pull: { repostedBy: userObjectId } }
        : { $addToSet: { repostedBy: userObjectId } },
    );

    if (hasReposted) {
      await Tweet.collection.deleteOne({
        userId: userObjectId,
        repostOf: targetTweetId,
      });
    } else {
      await Tweet.collection.insertOne({
        title: targetTweet.title,
        body: targetTweet.body,
        userId: userObjectId,
        repostOf: targetTweetId,
        reactions: {
          likes: 0,
          dislikes: 0,
        },
        likedBy: [],
        dislikedBy: [],
        bookmarkedBy: [],
        repostedBy: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const updatedTargetTweet = await Tweet.collection.findOne({
      _id: targetTweetId,
    });

    return formatMongoTweet(updatedTargetTweet, userId);
  }

  const updatedTweet = await Tweet.collection.findOne({ _id: tweet._id });

  return formatMongoTweet(updatedTweet, userId);
}

export async function deleteTweet(id, userId) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  await makeSureDbIsReady();
  const tweet = await Tweet.findOneAndDelete({ _id: id, userId }).lean();

  return tweet ? formatMongoTweet(tweet, userId) : null;
}
