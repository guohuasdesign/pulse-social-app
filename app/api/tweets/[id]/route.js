import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import {
  deleteTweet,
  getTweetById,
  toggleTweetAction,
  updateTweet,
} from "@/lib/tweets";

export async function GET(request, { params }) {
  const { id } = await params;
  const currentUser = verifyToken(request);
  const tweet = await getTweetById(id, currentUser?.userId);

  if (!tweet) {
    return NextResponse.json({ error: "Tweet not found." }, { status: 404 });
  }

  return NextResponse.json({ tweet });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const currentUser = verifyToken(request);

  if (!currentUser) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }

  const body = await request.json();

  if (body.action) {
    const tweet = await toggleTweetAction(id, body.action, currentUser.userId);

    if (!tweet) {
      return NextResponse.json({ error: "Tweet not found." }, { status: 404 });
    }

    return NextResponse.json({ tweet });
  }

  const title = body.title?.trim();
  const tweetBody = body.body?.trim();

  if (!title || !tweetBody) {
    return NextResponse.json(
      { error: "Title and body are required." },
      { status: 400 },
    );
  }

  const tweet = await updateTweet(id, {
    title,
    body: tweetBody,
    userId: currentUser.userId,
  });

  if (!tweet) {
    return NextResponse.json(
      { error: "You can only edit your own tweets." },
      { status: 403 },
    );
  }

  return NextResponse.json({ tweet });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const currentUser = verifyToken(request);

  if (!currentUser) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }

  const existingTweet = await getTweetById(id, currentUser.userId);

  if (!existingTweet) {
    return NextResponse.json({ error: "Tweet not found." }, { status: 404 });
  }

  if (existingTweet.userId !== currentUser.userId) {
    return NextResponse.json(
      { error: "You can only delete your own tweets." },
      { status: 403 },
    );
  }

  const tweet = await deleteTweet(id, currentUser.userId);

  if (!tweet) {
    return NextResponse.json(
      { error: "Could not delete tweet." },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Tweet deleted successfully." });
}
