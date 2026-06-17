import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createComment, getCommentsByTweetId } from "@/lib/comments";

export async function GET(_request, { params }) {
  const { id } = await params;
  const comments = await getCommentsByTweetId(id);

  return NextResponse.json({ comments });
}

export async function POST(request, { params }) {
  const { id } = await params;
  const currentUser = verifyToken(request);

  if (!currentUser) {
    return NextResponse.json(
      { error: "You must be logged in to comment." },
      { status: 401 },
    );
  }

  const body = await request.json();
  const commentBody = body.body?.trim();

  if (!commentBody) {
    return NextResponse.json(
      { error: "Comment is required." },
      { status: 400 },
    );
  }

  if (commentBody.length > 280) {
    return NextResponse.json(
      { error: "Comment must be 280 characters or fewer." },
      { status: 400 },
    );
  }

  const comment = await createComment({
    tweetId: id,
    userId: currentUser.userId,
    body: commentBody,
  });

  if (!comment) {
    return NextResponse.json({ error: "Tweet not found." }, { status: 404 });
  }

  return NextResponse.json({ comment }, { status: 201 });
}
