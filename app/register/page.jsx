"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, passwordConfirmation }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      alert("Register successful");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="card w-full max-w-sm">
        <h1
          className="mb-1 text-3xl"
          style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
        >
          Create account
        </h1>
        <p className="mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
          Join Pulse and start sharing your ideas
        </p>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              style={{ paddingRight: "56px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="relative">
            <label className="sr-only" htmlFor="passwordConfirmation">
              Confirm password
            </label>
            <input
              id="passwordConfirmation"
              className="input"
              name="passwordConfirmation"
              type={showPasswordConfirmation ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm password"
              value={passwordConfirmation}
              onChange={(event) =>
                setPasswordConfirmation(event.target.value)
              }
              required
              style={{ paddingRight: "56px" }}
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswordConfirmation((current) => !current)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {showPasswordConfirmation ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.6 : undefined,
              cursor: isLoading ? "not-allowed" : undefined,
            }}
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p
          className="mt-5 text-center text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
