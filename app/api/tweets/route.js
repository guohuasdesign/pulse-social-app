import { NextResponse } from "next/server";
import { createTweet, getTweets } from "@/lib/tweets";

export async function GET() {
  const tweets = await getTweets();
  return NextResponse.json({ tweets });
}

export async function POST(request) {
  const body = await request.json();
  const title = body.title?.trim();
  const tweetBody = body.body?.trim();

  if (!title || !tweetBody) {
    return NextResponse.json(
      { error: "Title and body are required." },
      { status: 400 },
    );
  }

  const tweet = await createTweet({ title, body: tweetBody });
  return NextResponse.json({ tweet }, { status: 201 });
}
