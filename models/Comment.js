import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    tweetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280,
    },
  },
  {
    collection: "comments",
    timestamps: true,
  },
);

export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);
