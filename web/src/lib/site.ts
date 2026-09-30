// Single place to rename the platform or change its navigation.
export const site = {
  name: "Quest",
  tagline: "Your free companion for applying to US universities from Bangladesh.",
  description:
    "Build your college list, track every step, find programs and full-aid opportunities, and get help with your profile. Free, always.",
};

export const primaryNav = [
  { href: "/dashboard", label: "Roadmap" },
  { href: "/colleges", label: "Colleges" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/profile", label: "Profile" },
  { href: "/assistant", label: "Assistant" },
  { href: "/resources", label: "Resources" },
];

export const quickLinks = [
  { href: "/colleges?tab=list", label: "My list" },
  { href: "/signup", label: "Create profile" },
  { href: "/login", label: "Log in" },
  { href: "/resources#tests", label: "SAT & English tests" },
  { href: "/resources#visa", label: "Visa" },
];

// The red-dot announcement in the header. Keep it short and time-bound.
export const announcement = {
  text: "Fall 2027 applicants: most early deadlines fall between Nov 1 and Nov 15",
  href: "/dashboard",
};
