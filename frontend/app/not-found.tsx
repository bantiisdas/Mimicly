import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-zinc-50 px-6 text-center">
      <h1 className="text-6xl font-bold text-zinc-300">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-zinc-800">
        Persona not found
      </h2>
      <p className="mt-2 text-zinc-500">
        You can only chat with Hitesh Choudhary or Piyush Garg.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
      >
        Back to home
      </Link>
    </div>
  );
}
