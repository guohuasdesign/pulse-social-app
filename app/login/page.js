"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      // token is stored in httpOnly cookie by the server — no localStorage needed
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/home");
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
          Welcome back
        </h1>
        <p className="mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
          Sign in to continue
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="sr-only" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              className="input"
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="sr-only" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              className="input"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: "56px" }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-xs hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.6 : undefined, cursor: isLoading ? "not-allowed" : undefined }}
          >
            {isLoading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          No account?{" "}
          <Link href="/register" className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
