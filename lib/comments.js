import mongoose from "mongoose";
import { Comment } from "@/models/Comment";
import { Tweet } from "@/models/Tweet";
import "@/models/User";
import { makeSureDbIsReady } from "@/lib/db/database";

function formatComment(comment) {
  return {
    id: comment._id.toString(),
    tweetId: comment.tweetId?.toString(),
    userId: comment.userId?._id?.toString() ?? comment.userId?.toString(),
    userEmail: comment.userId?.email,
    body: comment.body,
    createdAt: comment.createdAt,
  };
}

export async function getCommentsByTweetId(tweetId) {
  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    return [];
  }

  await makeSureDbIsReady();

  const comments = await Comment.find({ tweetId })
    .sort({ createdAt: -1 })
    .populate("userId", "email")
    .lean();

  return comments.map(formatComment);
}

export async function createComment({ tweetId, userId, body }) {
  if (
    !mongoose.Types.ObjectId.isValid(tweetId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return null;
  }

  await makeSureDbIsReady();

  const tweet = await Tweet.findById(tweetId).select("_id").lean();

  if (!tweet) {
    return null;
  }

  const comment = await Comment.create({
    tweetId,
    userId,
    body,
  });

  const populatedComment = await Comment.findById(comment._id)
    .populate("userId", "email")
    .lean();

  return formatComment(populatedComment);
}

export async function deleteComment({ commentId, tweetId, userId }) {
  if (
    !mongoose.Types.ObjectId.isValid(commentId) ||
    !mongoose.Types.ObjectId.isValid(tweetId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return null;
  }

  await makeSureDbIsReady();

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    tweetId,
    userId,
  }).lean();

  return comment ? formatComment(comment) : null;
}
