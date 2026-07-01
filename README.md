# UiPath Partner Experiential Learning Platform

A hands-on, self-service learning platform for UiPath partners. Participants pick
a use case, build a solution in a lab environment, submit it, and receive
**pointed automated feedback scored against industry standard**.

> **Stage 1 (this repo):** static single-page app on GitHub Pages, a hybrid
> review engine (deterministic rubric now, AI-swappable later), and a dummy lab
> environment. **Stage 2** will add real UiPath Cloud Labs environments and (if
> desired) an AI-powered reviewer + shared leaderboard.

## Learning tracks

| Track | Use cases |
|---|---|
| **Agentic Automation** | Autonomous Invoice Triage Agent · Employee Onboarding Orchestrator Agent |
| **Agentic Testing** | Self-Healing Regression Suite · Requirement-to-Test Generation Agent |
| **Document Understanding & IXP** | Mixed-Format Document Extraction · Intelligent Claims Processing (IXP) |

> The Stage 1 use cases are realistic placeholders. Swap the content in
> [`src/data/tracks.ts`](src/data/tracks.ts) with the real Stage 2 exercises —
> no code changes needed, the data shape stays the same.

## How it works

1. **Pick a use case** — read the scenario, objectives, and reveal progressive hints.
2. **Build in the lab** — dummy lab in Stage 1; UiPath Cloud Labs in Stage 2.
3. **Submit & get scored** — describe your solution, tick what you implemented,
   report metrics. The review engine returns a per-criterion scorecard, strengths,
   focus areas, an overall grade, and an industry-standard benchmark.

Best attempts are saved locally (browser `localStorage`) and ranked on the
**Leaderboard**.

## Architecture

```
src/
  data/tracks.ts        # All track + use case content and rubrics (swap for Stage 2)
  review/
    ReviewService.ts    # Reviewer interface + factory (rule-based | ai)
    RuleBasedReviewer.ts# Deterministic Stage 1 scoring engine
  storage/progress.ts   # localStorage persistence (swap for an API in Stage 2)
  components/           # Layout, forms, feedback report, icons
  pages/                # Home, Track, UseCase, Leaderboard
  types.ts              # Domain types
```

**Swap points for Stage 2** (all behind stable interfaces):

- **AI review** — implement `AiReviewer` and return it from `getReviewService`
  (set `VITE_REVIEWER=ai`). The scoring UI is unchanged.
- **Cloud Labs** — wire the "Launch Cloud Lab" button in `UseCasePage` to the
  UiPath Cloud Labs environment.
- **Shared leaderboard / auth** — replace `storage/progress.ts` with API calls.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # preview the production build
```

## Deploying to GitHub Pages

1. Create a GitHub repo and push this project to the `main` branch.
2. In **Settings → Pages**, set **Source = GitHub Actions**.
3. The included workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
   builds and deploys on every push to `main`.
4. The Vite `base` path is derived automatically from the repository name, so
   assets resolve at `https://<owner>.github.io/<repo>/`.

Routing uses `HashRouter`, so deep links and refreshes work on GitHub Pages
without server rewrites.

## Tech stack

React 18 · TypeScript · Vite · React Router — no backend, no external services in
Stage 1.
