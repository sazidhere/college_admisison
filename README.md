# Uttoron (উত্তরণ)

A free companion for students in Bangladesh applying to US universities: a
roadmap from class 7 to the visa interview, a college list with each college's
aid policy for international students, special programs and opportunities, a
profile, and an AI assistant that reads the profile.

"Uttoron" is a placeholder name. Change it in `web/src/lib/site.ts`.

## What's in version 1

| Section | What it does |
|---|---|
| Home | Overview, "full aid is real", stories (placeholders), message for class 7–10 |
| Sign up | 4 steps: about you → academics (SSC/HSC or O/A Level) → tests → goals |
| Roadmap | 23 steps in 5 stages with dates worked out from the student's class; red dot for anything missed in the last 12 months; tick steps off |
| Colleges | Search and filter by aid policy; college pages with facts, aid for internationals, programs, schools and sources; reach / target / likely band (never a %) |
| My list | Tracker: status, round (ED/EA/RD…), essays done, aid forms done |
| Opportunities | Olympiads in Bangladesh, summer programs with aid for internationals, competitions, scholarships, free advising, test prep, and programs at each college |
| Profile | Grades, tests, activities (Common App limits) and awards, with a completeness checklist |
| Assistant | Chat that knows the profile. Uses free AI tiers, falling back to the next provider when one hits its limit |
| Resources | Official links for SAT, English tests, Common App, CSS Profile and the F-1 visa |

The site is a PWA, so Android users can add it to their home screen and open it like an app.

**Storage for now:** profiles, lists and chats are saved in the browser
(localStorage) on that device. Real accounts that sync across devices are the
next step (Supabase, free tier). Only `web/src/lib/store.ts` needs to change.

## Run it locally

```bash
cd web
npm install
cp .env.example .env.local   # add at least one AI key to use the assistant
npm run dev                  # http://localhost:3000
```

## Deploy (free) on Vercel

1. Import this GitHub repo at https://vercel.com/new.
2. Set **Root Directory** to `web`.
3. Under Environment Variables, add the AI keys from `web/.env.example`.
4. Deploy. You get a free `*.vercel.app` address. A custom domain is optional.

## AI assistant: free keys

Add one or more of the following. The server tries them in order and moves to
the next when one is rate-limited:

- **Google Gemini:** `GEMINI_API_KEY` from https://aistudio.google.com/apikey
- **Groq:** `GROQ_API_KEY` from https://console.groq.com/keys
- **OpenRouter:** `OPENROUTER_API_KEY` plus a `:free` model in `OPENROUTER_MODEL`

Free tiers have daily caps, and some use prompts to improve their models. The
site tells students not to share sensitive details. Each visitor is also
limited to 30 messages an hour, so one person can't use up the shared quota.

## College data

`web/src/data/colleges.json` holds **15 colleges**, researched in September
2026 from official pages (via search results):

Harvard, Yale, Princeton, MIT, Stanford, Penn, Columbia, Rice, Vanderbilt,
Amherst, Williams, Bowdoin, Swarthmore, Pomona, Wellesley.

Each has a `confidence` field and its `sources`. Some SAT ranges and total
costs are still null.

**Not yet researched:** Brown, Dartmouth, Cornell, Duke, UChicago,
Northwestern, Johns Hopkins, Caltech, Grinnell, Macalester, Berea, NYU,
Carnegie Mellon, Michigan and Georgia Tech. Every college so far admits under
15%, so the next batch should include target and likely schools that give
internationals good aid.

`web/src/data/opportunities.json` holds 29 opportunities with official links.
Items marked `medium` confidence should be checked by hand.

To grow toward 300 colleges, `web/scripts/import-scorecard.mjs` pulls admit
rates, SAT ranges and costs from the US government's College Scorecard API. It
needs a free key from https://api.data.gov/signup/. Aid policy for
internationals and special programs still need research for each college.
