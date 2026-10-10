---
name: factory
description: "Run /factory to push a feature through the software factory: spec, build, four parallel reviews, approval, merge. /factory <feature> | next | approve <job-id> | rework <job-id> <note>. The session running it is the orchestrator."
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Agent, SendMessage
---

# /factory

You are the **orchestrator**. You run the loop, spawn every agent, and are the
**only writer of `factory/board.json`** (and `factory/backlog.md`). Agents get their
context from files, not from this conversation, and each writes only its own file.

## Config (edit here)

```
BASE_BRANCH = main     # job branches are cut from here ...
MERGE_INTO  = main     # ... and merged back here. Keep them equal.
MAX_REWORK  = 2        # builder rework passes after round 1 (so at most 3 review rounds)
REVIEWERS   = security ux ui code
```

## The loop

```
feature → spec-writer → builder → [security | ux | ui | code] → WAIT FOR ALL 4
                           ▲                                       │
                           └──── any CHANGES (≤ MAX_REWORK) ◄──────┤
                                                                   ▼ all PASS
                                            approver → APPROVE → merge into MERGE_INTO
                                                     → ESCALATE → needs-human
```

## Paths

Run these once per invocation and use the absolute paths in every agent prompt.

```bash
ROOT=$(git rev-parse --show-toplevel)                          # factory home
MAIN_ROOT=$(cd "$(git rev-parse --git-common-dir)/.." && pwd)  # holds .env.local and node_modules
JOB=$ROOT/factory/jobs/<job-id>                                # job files (markdown)
WT=$ROOT/.claude/worktrees/factory-<job-id>                    # job code (feature branch)
```

`factory/` and `.claude/agents/` must exist in the checkout you run from. If they
don't (for example the branch adding them isn't merged yet), stop and say so.

## board.json

Shape (keep `round` and `reviews` for the current round, `rounds` for history):

```json
{ "jobs": [ {
  "id": "003-rate-limiting", "title": "Rate limiting", "branch": "factory/003-rate-limiting",
  "stage": "review", "round": 2,
  "reviews": { "security": "CHANGES", "ux": "PASS", "ui": "pending", "code": "PASS" },
  "rounds": [ { "round": 1, "reviews": { "security": "CHANGES", "ux": "PASS", "ui": "PASS", "code": "CHANGES" } } ],
  "builder": "<agent id from the spawn result>", "worktree": ".claude/worktrees/factory-003-rate-limiting",
  "note": "", "updated": "2026-10-10T12:00:00Z" } ] }
```

`stage` is one of `spec`, `build`, `review`, `approve`, `merged`, `needs-human`.
`rounds` holds every round including the current one (the current one also mirrors
into `round` + `reviews`). Always write the whole file atomically: write
`factory/board.json.tmp`, then `mv` it over `factory/board.json`. Update `updated`
on every write. Update the board **before** each stage starts and as each verdict lands,
so the dashboard moves in real time.

## Verdicts (strict)

- A review's verdict is its **first line**. Exactly `VERDICT: PASS` is PASS; anything
  else (missing file content, typo, `VERDICT: CHANGES`) is CHANGES.
- `decision.md`'s first line: exactly `APPROVE` is approve; anything else is ESCALATE.

Read them with `head -n 1`.

---

## /factory <feature>

1. **Job id.** Next number after the highest `factory/jobs/NNN-*` (start at `001`), plus a
   short kebab slug of the feature: `004-dark-404-page`. Branch `factory/<job-id>`.
2. **Board.** Add the job with `stage: "spec"`, `round: 0`, empty `reviews` and `rounds`.
3. **Spec.** `mkdir -p $JOB`. Spawn `spec-writer` with: the feature text, `ROOT`, and the
   output path `$JOB/spec.md`. Wait for it. If `spec.md` is missing, set `needs-human`
   with a note and stop.
4. **Worktree.** Create the job's isolated checkout (never switch branches in `ROOT`):
   ```bash
   git worktree add -b factory/<job-id> "$WT" BASE_BRANCH
   ln -s "$MAIN_ROOT/.env.local" "$WT/.env.local"   # symlink only; never read .env files
   (cd "$WT" && npm ci --no-audit --no-fund)        # node_modules cannot be symlinked: Turbopack rejects it
   ```
5. **Build.** Set `stage: "build"`. Spawn `builder` (run it in the background so you can
   resume it later) with: `$WT`, `$JOB/spec.md`, the output path `$JOB/build.md`, and
   `BASE_BRANCH`. Record the agent id from the spawn result in the job's `builder` field.
   Wait for it to finish.
6. **Review round** (see below), starting with round 1.

### Review round N

1. Set `stage: "review"`, `round: N`, `reviews` all `"pending"`, append the round to
   `rounds`. `mkdir -p $JOB/round-N`.
2. Spawn **all four reviewers in a single message**, in the background:
   `security-reviewer`, `ux-reviewer`, `ui-reviewer`, `code-reviewer`. Give each:
   `$WT`, `BASE_BRANCH` (they review `git diff BASE_BRANCH...HEAD` inside `$WT`),
   `$JOB/spec.md`, `$JOB/build.md`, their output path `$JOB/round-N/review-<name>.md`,
   and for N > 1 the previous round folder `$JOB/round-(N-1)/` so they check the fixes landed.
3. **WAIT FOR ALL.** After each completion notice, read that reviewer's first line,
   update its chip on the board, then count:
   ```bash
   ls "$JOB/round-N"/review-*.md 2>/dev/null | wc -l
   ```
   The round is done **only when the count is 4**. Never resume the builder mid-round.
4. **All PASS** → Approval.
   **Any CHANGES and rework passes used < MAX_REWORK** → set `stage: "build"`, resume the
   builder: `SendMessage` to the recorded `builder` id with "Round N reviews are in
   `$JOB/round-N/`. Fix every CHANGES item, commit, and update `$JOB/build.md`." Wait,
   then run round N+1.
   **Any CHANGES and the cap is reached** → `stage: "needs-human"`,
   `note: "review cap reached"`. Stop. (The approver only ever sees all-PASS rounds.)

If the `SendMessage` resume fails (for example, the builder is from an earlier session),
spawn a fresh `builder` with the same inputs plus the round folder. The files carry all
the context. Record the new id.

### Approval

1. Set `stage: "approve"`. Spawn `approver` with `$WT`, `BASE_BRANCH`, `$JOB` (it reads
   `spec.md`, `build.md`, every round folder), and the output path `$JOB/decision.md`.
2. `APPROVE` → **Merge**. `ESCALATE` → `stage: "needs-human"`, `note`: the decision's
   first reason line. Stop.

### Merge

```bash
cd "$WT" && git switch MERGE_INTO && git merge --no-ff factory/<job-id> -m "factory: merge <job-id>"
```

Run it in the job worktree, not in `ROOT`. If `git switch` fails because `MERGE_INTO` is
checked out in another worktree, or the merge conflicts (`git merge --abort`), set
`needs-human` with the reason. On success, set `stage: "merged"`, then
`git switch --detach` in `$WT` and `git worktree remove "$WT"` (keep the branch).
Do **not** push. Tell the user the push command (`git push origin MERGE_INTO`).

---

## /factory next

Read `factory/backlog.md`, take the first `- [ ]` line, change it to
`- [x] … → <job-id>`, then run `/factory <that line's text>`. If none are unchecked, say so.

## /factory approve <job-id>

Only for a job in `needs-human`. Show the user the decision or note first, then run
**Merge**. Add `"approvedBy": "human"` to the job.

## /factory rework <job-id> <note>

Write the note to `$JOB/rework-<k>.md` (k = 1, 2, …). Set `stage: "build"`, `note: ""`.
Resume (or respawn) the builder pointing at that file, then run a new review round. A
human rework resets the `MAX_REWORK` count for this job.

---

## Report

End every run with one short block: job id, final stage, branch, rounds used, and the
next command (`/factory approve <id>`, `git push origin main`, or `/factory next`).
Dashboard: `cd factory && python3 -m http.server 8000` → http://localhost:8000/dashboard.html
