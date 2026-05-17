# Workspace Exposure Scorecard

> Open-source methodology behind the free tool at [koaich.com/scorecard](https://koaich.com/scorecard) — a 60-second test that scores how much of your data each workspace tool you use can read, train on, or share with third parties.

## What this is

This repo contains the **data and risk-rating methodology** for the Workspace Exposure Scorecard. The interactive tool at koaich.com/scorecard reads from `scorecard-tools.ts`. The repo is here so:

- Anyone can **audit the methodology** — every claim about every vendor's exposure is in `scorecard-tools.ts` with a specific phrasing we'd defend in a comment thread.
- Anyone can **suggest corrections** — open a PR if a vendor's posture has changed or a detail is inaccurate.
- Anyone can **fork it** — build their own scorecard variant, use the data in their own analysis, cite it in research.

## What's NOT in this repo

- The interactive React UI (lives in the koaich-landing repo)
- The waitlist / event-tracking infrastructure (lives in koaich-landing)
- Anything tied to running the scorecard as a hosted service

This is **just the data** — the catalog of tools, their exposure categories, and the risk ratings — plus a small `computeResult()` function that turns a set of picked tools into a grade.

## How the scoring works

Each tool has an array of `exposure` entries:

```ts
{
  label: "Reads your messages",
  risk: "high",       // "high" | "medium" | "low" | "none"
  detail: "Slack holds the encryption keys; their team has technical access to all channels."
}
```

A user picks a subset of tools. The scorecard computes a percentage:

```
pct = (3 × #high + 2 × #medium + 1 × #low) / (3 × #total)
```

Then maps to a letter grade:

| Range | Grade | Label |
|---|---|---|
| `≥ 75%` | **F** | Heavy exposure |
| `≥ 55%` | **D** | Significant exposure |
| `≥ 35%` | **C** | Moderate exposure |
| `≥ 15%` | **B** | Some exposure |
| `< 15%` | **A** | Low exposure |

## Data integrity

Every risk rating cites the vendor's own public documentation, plan tier, or known incident. We deliberately don't include speculative claims, unsourced rumors, or competitor smears. If a vendor's posture changes (e.g., they ship Client-Side Encryption), the rating moves down. If you spot a stale or inaccurate detail, open a PR with the vendor's current docs as the citation.

## Use it freely

MIT licensed. Fork it, embed it, cite it, modify it. No attribution required (but appreciated).

The interactive tool at koaich.com/scorecard is also free to embed via iframe — see [koaich.com/embed](https://koaich.com/embed) for instructions.

## Why Koaich publishes this

Koaich is an end-to-end encrypted workspace where even the vendor can't read user content. We built the scorecard to make the trade-off concrete: pick your tools, see exactly what each vendor can see. The point isn't to dunk on the competition (most of these vendors do their work well within the constraints they accepted) — it's to make the structural property of vendor-key-custody visible at a glance.

Publishing the methodology is part of taking the claim seriously. If we said "Koaich is more private" without showing the work, we'd be doing what every other marketing page does. The risk ratings, the wording of each exposure, the math behind the grade — it's all here for review.

## Contributing

PRs welcome for:
- Adding a tool we missed
- Updating a risk rating because the vendor's posture changed
- Fixing a typo or unclear wording
- Suggesting a better methodology

Please cite the vendor's primary source (their docs, their disclosure, their announcement) in the PR description.

## License

[MIT](./LICENSE).

## Links

- Live tool: https://koaich.com/scorecard
- Embed instructions: https://koaich.com/embed
- About Koaich: https://koaich.com
- The architecture behind the privacy claim: https://koaich.com/security
