import type { Profile } from "./types";

// Each step is due at a month relative to the student's high-school
// graduation year G (US fall entry = G). Applications happen in the
// autumn of G-1, during class 12 / HSC second year / A2.
export type Step = {
  id: string;
  title: string;
  detail: string;
  due: { yearOffset: number; month: number }; // month 1–12
  href?: string;
};

export type Stage = { id: string; title: string; summary: string; steps: Step[] };

export const stages: Stage[] = [
  {
    id: "explore",
    title: "Explore",
    summary: "Class 7–8. Get curious, read widely, try things.",
    steps: [
      { id: "read-stories", title: "Read how others did it", detail: "Understand that full-aid US study is possible, and what it takes.", due: { yearOffset: -5, month: 6 }, href: "/#stories" },
      { id: "english-habit", title: "Build an English reading habit", detail: "Read one English article or book chapter a day. It pays off in the SAT and essays.", due: { yearOffset: -5, month: 12 }, href: "/resources#tests" },
      { id: "try-olympiad", title: "Try an olympiad or competition", detail: "Math, informatics, science, debate: pick one and take part, results don't matter yet.", due: { yearOffset: -4, month: 6 }, href: "/opportunities" },
    ],
  },
  {
    id: "build",
    title: "Build",
    summary: "Class 9–10. Go deep in 2–3 activities and keep grades strong.",
    steps: [
      { id: "pick-activities", title: "Commit to 2–3 activities", detail: "Depth beats a long list. Lead something, start something, or get very good at something.", due: { yearOffset: -3, month: 3 } },
      { id: "strong-ssc", title: "Aim for strong SSC / O Level results", detail: "US colleges see your grades from class 9 onward.", due: { yearOffset: -2, month: 5 } },
      { id: "first-summer", title: "Plan a meaningful summer", detail: "A program, a project, research, a job or community work. Write down what you did.", due: { yearOffset: -2, month: 6 }, href: "/opportunities" },
    ],
  },
  {
    id: "prepare",
    title: "Prepare",
    summary: "Class 11 / HSC first year / AS. Tests, list, and a standout summer.",
    steps: [
      { id: "sat-diagnostic", title: "Take a free SAT practice test", detail: "Use Bluebook's official practice test to see where you start.", due: { yearOffset: -2, month: 9 }, href: "/resources#tests" },
      { id: "draft-list", title: "Draft a college list of 12–20", detail: "Mix reach, target and likely schools, and check each one's aid for internationals.", due: { yearOffset: -2, month: 12 }, href: "/colleges" },
      { id: "sat-first", title: "Take the SAT (first attempt)", detail: "Leaves time for a retake before applications.", due: { yearOffset: -1, month: 3 }, href: "/resources#tests" },
      { id: "english-test", title: "Take IELTS, TOEFL or Duolingo English Test", detail: "Check each college's minimum. Some waive it for English-medium students.", due: { yearOffset: -1, month: 6 }, href: "/resources#tests" },
      { id: "teachers", title: "Choose 2 teachers for recommendations", detail: "Pick teachers who know you well in class, and tell them early.", due: { yearOffset: -1, month: 6 } },
      { id: "summer-11", title: "Do your strongest summer yet", detail: "Research, a program, a real project. This is the last summer on your application.", due: { yearOffset: -1, month: 7 }, href: "/opportunities" },
    ],
  },
  {
    id: "apply",
    title: "Apply",
    summary: "Class 12 / HSC second year / A2. Essays, forms, deadlines.",
    steps: [
      { id: "common-app", title: "Create your Common App account", detail: "It opens around August 1. Fill in the profile and activities sections first.", due: { yearOffset: -1, month: 8 } },
      { id: "personal-essay", title: "Finish your personal essay", detail: "650 words. Several drafts. Get feedback from someone who knows you.", due: { yearOffset: -1, month: 9 }, href: "/assistant" },
      { id: "final-list", title: "Finalise your list and early round", detail: "Decide ED / EA / REA carefully. Binding Early Decision needs your family to accept the aid offer.", due: { yearOffset: -1, month: 10 }, href: "/colleges?tab=list" },
      { id: "sat-final", title: "Last SAT attempt for early rounds", detail: "October is usually the last sitting that counts for November deadlines.", due: { yearOffset: -1, month: 10 } },
      { id: "early-apps", title: "Submit early applications", detail: "Most early deadlines are November 1–15.", due: { yearOffset: -1, month: 11 } },
      { id: "aid-forms", title: "Submit financial-aid forms", detail: "CSS Profile or the college's international aid form, plus family income documents.", due: { yearOffset: -1, month: 11 } },
      { id: "rd-apps", title: "Submit regular-decision applications", detail: "Most are due January 1–15. Write every supplement yourself.", due: { yearOffset: 0, month: 1 } },
    ],
  },
  {
    id: "decide",
    title: "Decide & go",
    summary: "After decisions. Compare offers, visa, and departure.",
    steps: [
      { id: "compare-aid", title: "Compare admission and aid offers", detail: "Look at the full cost you must pay each year, not only the scholarship amount.", due: { yearOffset: 0, month: 4 } },
      { id: "commit", title: "Accept one offer", detail: "The usual deadline is May 1. Then the college issues your I-20.", due: { yearOffset: 0, month: 5 } },
      { id: "visa", title: "Pay SEVIS fee, fill DS-160, book your visa interview", detail: "The F-1 interview is at the US Embassy in Dhaka. Book early in summer.", due: { yearOffset: 0, month: 6 }, href: "/resources#visa" },
      { id: "depart", title: "Prepare to leave", detail: "Housing, vaccinations, flights, and a first-semester budget.", due: { yearOffset: 0, month: 8 } },
    ],
  },
];

export const allSteps = stages.flatMap((s) => s.steps);

export function dueDate(step: Step, gradYear: number) {
  // Last day of the due month.
  return new Date(gradYear + step.due.yearOffset, step.due.month, 0);
}

// Only steps missed in the last year count as "behind": a class-12 student
// who just joined shouldn't be told off for class-7 habits.
const CATCH_UP_MONTHS = 12;

export function isOverdue(step: Step, gradYear: number, now = new Date()) {
  const due = dueDate(step, gradYear);
  const cutoff = new Date(now.getFullYear(), now.getMonth() - CATCH_UP_MONTHS, now.getDate());
  return due < now && due >= cutoff;
}

export function roadmapStatus(profile: Profile, done: string[], now = new Date()) {
  const doneSet = new Set(done);
  const overdue = allSteps.filter((s) => !doneSet.has(s.id) && isOverdue(s, profile.gradYear, now));
  const upcoming = allSteps.filter((s) => !doneSet.has(s.id) && dueDate(s, profile.gradYear) >= now);
  const next = upcoming[0];
  const currentStage =
    stages.find((st) => st.steps.some((s) => s.id === next?.id)) ?? stages[stages.length - 1];
  const progress = Math.round((doneSet.size / allSteps.length) * 100);
  return { overdue, upcoming, next, currentStage, progress };
}

export function formatDue(step: Step, gradYear: number) {
  return dueDate(step, gradYear).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

// Class 12 students graduate this coming year; each class below adds one.
export function gradYearFor(classLevel: number, now = new Date()) {
  // Bangladesh HSC / A Level exams finish by mid-year, so after June the
  // "current" class-12 cohort graduates next calendar year.
  const base = now.getMonth() >= 6 ? now.getFullYear() + 1 : now.getFullYear();
  return base + (12 - classLevel);
}
