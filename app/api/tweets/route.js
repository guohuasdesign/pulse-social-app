import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createTweet, getTweets } from "@/lib/tweets";

export async function GET(request) {
  const currentUser = verifyToken(request);
  const tweets = await getTweets(currentUser?.userId);
  return NextResponse.json({ tweets });
}

export async function POST(request) {
  const currentUser = verifyToken(request);

  if (!currentUser) {
    return NextResponse.json(
      { error: "You must be logged in to create a tweet." },
      { status: 401 },
    );
  }

  const body = await request.json();
  const title = body.title?.trim();
  const tweetBody = body.body?.trim();

  if (!title || !tweetBody) {
    return NextResponse.json(
      { error: "Title and body are required." },
      { status: 400 },
    );
  }

  const tweet = await createTweet({
    title,
    body: tweetBody,
    userId: currentUser.userId,
  });

  return NextResponse.json({ tweet }, { status: 201 });
}
