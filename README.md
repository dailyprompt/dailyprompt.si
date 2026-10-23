# The Daily Prompt

A directory of AI tools sorted by use case, with short, honest verdicts. Live at https://dailyprompt.si.

- Tool data: `data/tools.json` (one entry per tool) and `data/categories.json`. Pages are generated from these files.
- Next.js, TypeScript and Tailwind, deployed on Vercel.
- `npm run dev` to work locally, `npm run build` to check a production build.

Tool submissions from the site are filed as issues in a private repo for review (env vars `SUBMISSIONS_GITHUB_TOKEN`, optional `SUBMISSIONS_REPO`). Nothing is published automatically.
