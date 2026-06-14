import { NextResponse } from "next/server";
import PasswordResetToken from "@/models/PasswordResetToken";
import User from "@/models/User";
import { makeSureDbIsReady } from "@/lib/db/database";
import { sendPasswordResetEmail } from "@/lib/email";
import { createPasswordResetToken } from "@/lib/passwordReset";

const RESET_TOKEN_MINUTES = 30;

export async function POST(request) {
  try {
    await makeSureDbIsReady();

    const { email } = await request.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      await PasswordResetToken.deleteMany({ userId: user._id });

      const { token, tokenHash } = createPasswordResetToken();
      const expiresAt = new Date(Date.now() + RESET_TOKEN_MINUTES * 60 * 1000);

      await PasswordResetToken.create({
        userId: user._id,
        tokenHash,
        expiresAt,
      });

      const resetUrl = new URL("/reset-password", request.url);
      resetUrl.searchParams.set("token", token);

      await sendPasswordResetEmail({
        email: normalizedEmail,
        resetUrl: resetUrl.toString(),
      });
    }

    return NextResponse.json({
      message:
        "If that email is registered, a password reset link has been sent.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not start password reset." },
      { status: 500 },
    );
  }
}
