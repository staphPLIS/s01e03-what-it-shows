# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

---

## S01E03: #4471 split into its problems

The desk merged 412 reports into #4471 as one issue. They are three problems, each filed as its own ticket:

| Problem | Ticket |
|---|---|
| The shared parser reads dates month first (`parser`) | [#1](https://github.com/staphPLIS/s01e03-what-it-shows/issues/1) |
| The booking-v3 form hint says month first (`hint`) | [#2](https://github.com/staphPLIS/s01e03-what-it-shows/issues/2) |
| The date moves by one day (`shift`) | [#3](https://github.com/staphPLIS/s01e03-what-it-shows/issues/3) |

The counts are not typed here: the kb page calculates them from `src/lib/data/` at each render.

- The page: `src/routes/kb/incidents/4471-three-problems/+page.svx`, signed `staphPLIS`.
- Its logic: `src/lib/kb/problems.ts`, `src/lib/kb/ProblemTable.svelte`, `src/lib/kb/ProblemCount.svelte`.
- The page as the desk sees it: `rendered/kb/incidents/4471-three-problems/index.html`, and a screenshot in `rendered/4471-three-problems.png`.
- To render it again: `render/build.sh` (SvelteKit and mdsvex; writes `rendered/`).
