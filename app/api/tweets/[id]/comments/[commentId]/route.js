import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { deleteComment } from "@/lib/comments";

export async function DELETE(request, { params }) {
  const { id, commentId } = await params;
  const currentUser = verifyToken(request);

  if (!currentUser) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }

  const comment = await deleteComment({
    commentId,
    tweetId: id,
    userId: currentUser.userId,
  });

  if (!comment) {
    return NextResponse.json(
      { error: "You can only delete your own comments." },
      { status: 403 },
    );
  }

  return NextResponse.json({ message: "Comment deleted successfully." });
}
