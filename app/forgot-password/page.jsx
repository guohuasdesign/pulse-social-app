"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleForgotPassword(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Could not send password reset email.");
      return;
    }

    setMessage(data.message);
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Reset password</h1>
      <p className="text-gray-600">
        Enter your registered email and we will send you a password reset link.
      </p>

      <form onSubmit={handleForgotPassword} className="mt-4 space-y-4">
        <input
          className="w-full border p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        {message ? <p className="text-sm text-green-600">{message}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          disabled={isSubmitting}
          className="w-full bg-black p-2 text-white disabled:bg-gray-400"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700"
      >
        Back to login
      </Link>
    </main>
  );
}
