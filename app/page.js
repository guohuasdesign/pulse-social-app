import Link from "next/link";

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-md font-semibold uppercase tracking-wide text-blue-600">
        Pulse - Social using your Idea
      </p>
      <h1 className="mt-3 text-5xl font-bold text-gray-950">
        Using your thoughts to connect with the world！
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
        Log in if you already have an account, or create one to start sharing
        your ideas.
      </p>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
        <Link
          href="/login"
          className="flex-1 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="flex-1 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          Sign up
        </Link>
      </div>
    </main>
  );
}
