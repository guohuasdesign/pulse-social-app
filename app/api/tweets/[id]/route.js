import { NextResponse } from "next/server";
import { deleteTweet, getTweetById, updateTweet } from "@/lib/tweets";

export async function GET(request, { params }) {
  const { id } = await params;
  const tweet = await getTweetById(id);

  if (!tweet) {
    return NextResponse.json({ error: "Tweet not found." }, { status: 404 });
  }

  return NextResponse.json({ tweet });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const title = body.title?.trim();
  const tweetBody = body.body?.trim();

  if (!title || !tweetBody) {
    return NextResponse.json(
      { error: "Title and body are required." },
      { status: 400 },
    );
  }

  const tweet = await updateTweet(id, { title, body: tweetBody });

  if (!tweet) {
    return NextResponse.json({ error: "Tweet not found." }, { status: 404 });
  }

  return NextResponse.json({ tweet });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const tweet = await deleteTweet(id);

  if (!tweet) {
    return NextResponse.json({ error: "Tweet not found." }, { status: 404 });
  }

  return NextResponse.json({ message: "Tweet deleted successfully." });
}
