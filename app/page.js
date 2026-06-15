import Link from "next/link";

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <p
        className="text-sm font-medium uppercase tracking-widest"
        style={{ color: "var(--accent)" }}
      >
        Pulse — Social using your Idea
      </p>

      <h1
        className="mt-4 text-5xl leading-tight"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--foreground)",
          fontWeight: 400,
        }}
      >
        Using your thoughts to connect with the world
      </h1>

      <p
        className="mt-5 max-w-xl text-base leading-7"
        style={{ color: "var(--text-muted)" }}
      >
        Log in if you already have an account, or create one to start sharing
        your ideas.
      </p>

      <div className="mt-10 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
        <Link href="/login" className="btn-primary flex-1 text-center">
          Login
        </Link>
        <Link href="/register" className="btn-secondary flex-1 text-center">
          Sign up
        </Link>
      </div>
    </main>
  );
}
