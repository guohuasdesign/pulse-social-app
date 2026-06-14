import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import PasswordResetToken from "@/models/PasswordResetToken";
import User from "@/models/User";
import { makeSureDbIsReady } from "@/lib/db/database";
import { hashPasswordResetToken } from "@/lib/passwordReset";

export async function POST(request) {
  try {
    await makeSureDbIsReady();

    const { token, password, passwordConfirmation } = await request.json();

    if (!token || !password || !passwordConfirmation) {
      return NextResponse.json(
        { error: "Token, password, and confirmation are required." },
        { status: 400 },
      );
    }

    if (password !== passwordConfirmation) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 },
      );
    }

    const tokenHash = hashPasswordResetToken(token);
    const resetToken = await PasswordResetToken.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Password reset link is invalid or expired." },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(resetToken.userId, { passwordHash });
    await PasswordResetToken.deleteMany({ userId: resetToken.userId });

    return NextResponse.json({ message: "Password reset successful." });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not reset password." },
      { status: 500 },
    );
  }
}
