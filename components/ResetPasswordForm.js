"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordForm({ token }) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleResetPassword(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password, passwordConfirmation }),
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Could not reset password.");
      return;
    }

    setMessage(data.message);
    setTimeout(() => router.push("/login"), 1000);
  }

  if (!token) {
    return (
      <main className="mx-auto max-w-md p-6">
        <h1 className="mb-4 text-2xl font-bold">Reset password</h1>
        <p className="text-gray-600">This reset link is missing a token.</p>
        <Link
          href="/forgot-password"
          className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700"
        >
          Request a new link
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Reset password</h1>

      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="relative">
          <input
            className="w-full border p-2 pr-16"
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="relative">
          <input
            className="w-full border p-2 pr-16"
            type={showPasswordConfirmation ? "text" : "password"}
            placeholder="Confirm new password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswordConfirmation((current) => !current)
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900"
          >
            {showPasswordConfirmation ? "Hide" : "Show"}
          </button>
        </div>

        {message ? <p className="text-sm text-green-600">{message}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          disabled={isSubmitting}
          className="w-full bg-black p-2 text-white disabled:bg-gray-400"
        >
          {isSubmitting ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </main>
  );
}
