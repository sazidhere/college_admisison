"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Notice } from "@/components/Page";
import { AcademicsFields, GoalFields, TestFields } from "@/components/profile/fields";
import { gradYearFor } from "@/lib/roadmap";
import { profileStore } from "@/lib/store";
import type { Profile } from "@/lib/types";
import { site } from "@/lib/site";

const steps = ["About you", "Academics", "Tests", "Goals"] as const;

const blank: Profile = {
  name: "",
  email: "",
  classLevel: 11,
  gradYear: gradYearFor(11),
  city: "",
  curriculum: "national",
  tests: {},
  intendedMajors: [],
  needsAid: "full",
  activities: [],
  awards: [],
  createdAt: "",
};

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Profile>(blank);
  const set = (patch: Partial<Profile>) => setP((prev) => ({ ...prev, ...patch }));

  const canContinue = step !== 0 || (p.name.trim() && /\S+@\S+\.\S+/.test(p.email));
  const last = step === steps.length - 1;

  const finish = () => {
    profileStore.set({ ...p, name: p.name.trim(), email: p.email.trim().toLowerCase(), createdAt: new Date().toISOString() });
    router.push("/dashboard?welcome=1");
  };

  return (
    <div className="min-h-[80dvh] grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="hero-backdrop text-paper relative px-4 sm:px-12 py-12 lg:py-20">
        <div className="absolute inset-0 grain" aria-hidden />
        <div className="relative">
          <p className="uppercase tracking-[0.2em] text-sm text-white/70">Create your profile</p>
          <h1 className="mt-4 text-5xl sm:text-6xl">Four short steps. Free forever.</h1>
          <ol className="mt-10 space-y-4">
            {steps.map((s, i) => (
              <li key={s} className={`flex items-center gap-4 text-lg ${i === step ? "" : "text-white/55"}`}>
                <span className={`grid place-items-center size-9 rounded-full border ${i < step ? "bg-paper text-ink border-paper" : i === step ? "border-paper" : "border-white/40"}`}>
                  {i + 1}
                </span>
                <span className={i === step ? "font-semibold" : ""}>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </aside>

      <section className="px-4 sm:px-12 py-12 lg:py-20 max-w-3xl w-full">
        <p className="text-sm text-muted">
          Step {step + 1} of {steps.length}
        </p>
        <div className="h-1 bg-stone mt-3">
          <div className="h-1 bg-ink transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
        <h2 className="mt-8 text-4xl sm:text-5xl">{steps[step]}</h2>

        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canContinue) return;
            if (last) finish();
            else setStep(step + 1);
          }}
        >
          {step === 0 && (
            <>
              <div>
                <label className="label" htmlFor="name">Your name</label>
                <input id="name" className="field" autoComplete="name" value={p.name} onChange={(e) => set({ name: e.target.value })} required />
              </div>
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" type="email" className="field" autoComplete="email" value={p.email} onChange={(e) => set({ email: e.target.value })} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="class">Your class right now</label>
                  <select
                    id="class"
                    className="field"
                    value={p.classLevel}
                    onChange={(e) => {
                      const c = Number(e.target.value);
                      set({ classLevel: c, gradYear: gradYearFor(c) });
                    }}
                  >
                    {[7, 8, 9, 10, 11, 12].map((c) => (
                      <option key={c} value={c}>
                        Class {c}
                        {c === 11 ? " (HSC 1st year / AS)" : c === 12 ? " (HSC 2nd year / A2)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="grad">High-school graduation year</label>
                  <input id="grad" type="number" className="field" value={p.gradYear} onChange={(e) => set({ gradYear: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="city">City or district</label>
                <input id="city" className="field" placeholder="e.g. Dhaka, Sylhet, Rangpur" value={p.city} onChange={(e) => set({ city: e.target.value })} />
              </div>
            </>
          )}
          {step === 1 && <AcademicsFields p={p} set={set} />}
          {step === 2 && (
            <>
              <p className="text-ink/75">Haven&apos;t taken a test yet? Leave it blank. You can add scores any time.</p>
              <TestFields p={p} set={set} />
            </>
          )}
          {step === 3 && <GoalFields p={p} set={set} />}

          <div className="flex items-center justify-between pt-6 border-t border-line">
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <Link href="/login" className="text-muted underline underline-offset-4">
                Already have a profile? Log in
              </Link>
            )}
            <Button type="submit" disabled={!canContinue}>
              {last ? "Create my profile" : "Continue"}
            </Button>
          </div>
        </form>

        <div className="mt-10">
          <Notice>
            In this early version, your profile is saved only in this browser on this device. Accounts that sync across
            devices are coming. {site.name} never sells or shares your data.
          </Notice>
        </div>
      </section>
    </div>
  );
}
