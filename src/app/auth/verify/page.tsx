"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyToken } from "@/lib/tokens";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const code = formData.get("code") as string;

    try {
      if (!email) throw new Error("Email is required");
      await verifyToken(email, code);
      router.push("/auth/login?verified=true");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  if (!email) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-red-500">Email parameter is missing</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a verification code to {email}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-red-500">{error}</div>
          )}

          <div>
            <label htmlFor="code" className="sr-only">
              Verification Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              className="relative block w-full rounded-md border-0 p-2 text-center tracking-widest ring-1 ring-inset ring-gray-300"
              placeholder="Enter 6-digit code"
              maxLength={6}
              pattern="\d{6}"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
