export async function sendPasswordResetEmail({ email, resetUrl }) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`Password reset link for ${email}: ${resetUrl}`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "Pulse <onboarding@resend.dev>",
      to: email,
      subject: "Reset your Pulse password",
      text: `Open this link to reset your password: ${resetUrl}`,
    }),
  });

  if (!response.ok) {
    throw new Error("Could not send password reset email.");
  }
}
