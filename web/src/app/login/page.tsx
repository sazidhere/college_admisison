"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Notice } from "@/components/Page";
import { useHydrated, useProfile } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const [profile] = useProfile();
  const hydrated = useHydrated();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="min-h-[80dvh] grid lg:grid-cols-2">
      <aside className="hero-backdrop text-paper relative px-4 sm:px-12 py-12 lg:py-20 flex items-end">
        <div className="absolute inset-0 grain" aria-hidden />
        <h1 className="relative text-5xl sm:text-7xl">Welcome back</h1>
      </aside>
      <section className="px-4 sm:px-12 py-12 lg:py-20 max-w-xl w-full">
        <h2 className="text-4xl">Log in</h2>
        {hydrated && profile && (
          <div className="mt-8 border border-line p-6">
            <p className="text-muted text-sm">Profile on this device</p>
            <p className="font-serif text-3xl mt-1">{profile.name}</p>
            <p className="text-muted">{profile.email}</p>
            <Button className="mt-6" onClick={() => router.push("/dashboard")}>
              Continue as {profile.name.split(" ")[0]}
            </Button>
          </div>
        )}
        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (profile && profile.email === email.trim().toLowerCase()) router.push("/dashboard");
            else setError("There is no profile with that email on this device.");
          }}
        >
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="field" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} required />
          </div>
          {error && (
            <p className="text-signal">
              {error}{" "}
              <Link href="/signup" className="underline underline-offset-4">Create one</Link>.
            </p>
          )}
          <Button type="submit" className="w-full">Log in</Button>
        </form>
        <p className="mt-6 text-muted">
          New here? <Link href="/signup" className="underline underline-offset-4 text-ink">Create a free profile</Link>
        </p>
        <div className="mt-10">
          <Notice>Profiles are stored on this device for now. Sign-in with Google and syncing across devices come with the next version.</Notice>
        </div>
      </section>
    </div>
  );
}
