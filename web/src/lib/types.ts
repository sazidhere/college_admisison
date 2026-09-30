export type Curriculum = "national" | "english-medium";

export type TestScores = {
  sat?: number; // 400–1600
  act?: number; // 1–36
  ielts?: number; // 0–9
  toefl?: number; // 0–120
  det?: number; // 10–160
};

export type Activity = {
  id: string;
  title: string;
  role: string;
  years: string; // e.g. "Class 9–11"
  hoursPerWeek?: number;
  description: string;
};

export type Award = {
  id: string;
  title: string;
  level: "school" | "district" | "national" | "international";
};

export type Profile = {
  name: string;
  email: string;
  classLevel: number; // 7–12 (12 = HSC 2nd year / A2)
  gradYear: number; // expected high-school graduation year
  city: string;
  curriculum: Curriculum;
  // National curriculum
  sscGpa?: number; // out of 5
  hscGpa?: number; // out of 5
  // English medium
  oLevelAs?: number; // number of A/A* grades
  oLevelTotal?: number;
  aLevelGrades?: string; // e.g. "A*A*A"
  tests: TestScores;
  intendedMajors: string[];
  needsAid: "full" | "partial" | "none";
  activities: Activity[];
  awards: Award[];
  createdAt: string;
};

export type AppStatus = "researching" | "applying" | "submitted" | "admitted" | "waitlisted" | "denied";

export type ListEntry = {
  slug: string;
  status: AppStatus;
  round?: string;
  essayDone?: boolean;
  aidDocsDone?: boolean;
  addedAt: string;
};
