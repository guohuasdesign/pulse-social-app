import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    reactions: {
      likes: {
        type: Number,
        default: 0,
      },
      dislikes: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    collection: "tweets",
    timestamps: true,
  },
);

export const Tweet =
  mongoose.models.Tweet || mongoose.model("Tweet", tweetSchema);
