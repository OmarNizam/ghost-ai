---
name: factory
description: "Run /factory to push a feature through the software factory: spec, build, four parallel reviews, approval, merge. /factory <feature> | next | approve <job-id> | rework <job-id> <note>. The session running it is the orchestrator."
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Agent, SendMessage, ToolSearch
---

# /factory

You are the **orchestrator**. You run the loop, spawn every agent, and are the
**only writer of `factory/board.json`** (and `factory/backlog.md`). Agents get their
context from files, not from this conversation, and each writes only its own file.

## Config (edit here)

```bash
BASE=develop     # job branches are cut from here ...
MERGE=develop    # ... and merged back here. Keep them equal.
MAX_ROUNDS=2     # review rounds per job; CHANGES after the last one → needs-human
REVIEWERS="security ux ui code"
```

## The loop

```
feature → spec-writer → builder → [security | ux | ui | code] → WAIT FOR ALL 4
                           ▲                                       │
                           └──── any CHANGES (round < MAX_ROUNDS) ◄┤
                                                                   ▼ all PASS
                                            approver → APPROVE → merge into $MERGE
                                                     → ESCALATE → needs-human
```

## Paths

Run these once per invocation (with the Config lines above) and pass the absolute
paths in every agent prompt.

```bash
ROOT=$(git rev-parse --show-toplevel)                          # factory home: docs, agents, factory/
MAIN_ROOT=$(cd "$(git rev-parse --git-common-dir)/.." && pwd)  # holds .env.local
JOB=$ROOT/factory/jobs/<job-id>                                # job files (markdown)
WT=$ROOT/.claude/worktrees/factory-<job-id>                    # job code (branch factory/<job-id>)
```

**Docs come from `$ROOT`, code from `$WT`.** The job branch is cut from `$BASE`, whose
`AGENTS.md` and `context/` may be older than the checkout you run from. Every agent
prompt includes `$ROOT` and says: "read `AGENTS.md` and `context/` from `$ROOT`".

`factory/` and `.claude/agents/` must exist in `$ROOT`. If they don't (for example the
branch adding them isn't merged yet), stop and say so.

## board.json

Shape (keep `round` and `reviews` for the current round, `rounds` for history):

```json
{ "jobs": [ {
  "id": "003-rate-limiting", "title": "Rate limiting", "branch": "factory/003-rate-limiting",
  "stage": "review", "round": 2,
  "reviews": { "security": "CHANGES", "ux": "PASS", "ui": "pending", "code": "PASS" },
  "rounds": [ { "round": 1, "reviews": { "security": "CHANGES", "ux": "PASS", "ui": "PASS", "code": "CHANGES" } },
              { "round": 2, "reviews": { "security": "CHANGES", "ux": "PASS", "ui": "pending", "code": "PASS" } } ],
  "builder": "builder-003-rate-limiting", "worktree": ".claude/worktrees/factory-003-rate-limiting",
  "note": "", "updated": "2026-10-10T12:00:00Z" } ] }
```

`stage` is one of `spec`, `build`, `review`, `approve`, `merged`, `needs-human`.
`rounds` holds every round including the current one, which also mirrors into
`round` + `reviews`. Always write the whole file atomically: write
`factory/board.json.tmp`, then `mv` it over `factory/board.json`. Set `updated` on
every write. Update the board **before** each stage starts and as each verdict lands,
so the dashboard moves in real time.

## Verdicts (strict)

- A review's verdict is its **first line**. Exactly `VERDICT: PASS` is PASS. Anything
  else (empty file, typo, `VERDICT: CHANGES`) is CHANGES.
- `decision.md`'s first line: exactly `APPROVE` is approve; anything else is ESCALATE.

Read them with `head -n 1`.

---

## /factory <feature>

1. **Job id.** Next number after the highest `factory/jobs/NNN-*` (start at `001`), plus a
   short kebab slug of the feature: `004-dark-404-page`. Branch `factory/<job-id>`.
2. **Board.** Add the job with `stage: "spec"`, `round: 0`, empty `reviews` and `rounds`.
3. **Spec.** `mkdir -p $JOB`. Spawn `spec-writer` with the feature text, `$ROOT`, and the
   output path `$JOB/spec.md`. Wait for it. If `spec.md` is missing, set `needs-human`
   with a note and stop.
4. **Worktree.** Create the job's isolated checkout (never switch branches in `$ROOT`):
   ```bash
   git worktree add -b "factory/<job-id>" "$WT" "$BASE"
   ln -s "$MAIN_ROOT/.env.local" "$WT/.env.local"   # symlink only; never read .env files
   (cd "$WT" && npm ci --no-audit --no-fund)        # don't symlink node_modules: Turbopack rejects it
   ```
5. **Build.** Set `stage: "build"`. Spawn `builder` in the background **with the name
   `builder-<job-id>`** (if the Agent tool has no name field, use the agent id from the
   spawn result instead). Store that handle in the job's `builder` field. Give it `$ROOT`,
   `$WT`, `$BASE`, `$JOB/spec.md`, and the output path `$JOB/build.md`. Wait for it.
6. **Review round 1** (below).

### Review round N

1. Set `stage: "review"`, `round: N`, `reviews` all `"pending"`, append the round to
   `rounds`. `mkdir -p $JOB/round-N`.
2. Spawn **all four reviewers in a single message**, in the background:
   `security-reviewer`, `ux-reviewer`, `ui-reviewer`, `code-reviewer`. Give each
   `$ROOT`, `$WT`, `$BASE` (they review `git diff $BASE...HEAD` inside `$WT`),
   `$JOB/spec.md`, `$JOB/build.md`, their output path `$JOB/round-N/review-<name>.md`,
   and for N > 1 the previous round folder, so they check that the fixes landed.
3. **WAIT FOR ALL.** After each completion notice, read that reviewer's first line,
   update its chip on the board, then count:
   ```bash
   ls "$JOB/round-N"/review-*.md 2>/dev/null | wc -l
   ```
   The round is done **only when the count is 4**. Never resume the builder mid-round.
4. Then:
   - **All PASS** → Approval.
   - **Any CHANGES and N < MAX_ROUNDS** → set `stage: "build"` and resume the builder
     (below) with "Round N reviews are in `$JOB/round-N/`. Fix every CHANGES item,
     commit, and update `$JOB/build.md`." Wait, then run round N+1.
   - **Any CHANGES and N = MAX_ROUNDS** → `stage: "needs-human"`,
     `note: "CHANGES after round N"`. Stop. The approver only ever sees all-PASS rounds.

**Resuming the builder.** SendMessage is a deferred tool: load it first with
`ToolSearch("select:SendMessage")`, then send to the job's `builder` handle. If the
send fails (for example, the builder is from an earlier session), spawn a fresh
`builder` with the same inputs plus the round folder. The files carry all the context.
Store the new handle.

### Approval

1. Set `stage: "approve"`. Spawn `approver` with `$ROOT`, `$WT`, `$BASE`, `$JOB` (it
   reads `spec.md`, `build.md`, every round folder), and the output path `$JOB/decision.md`.
2. `APPROVE` → **Merge**. `ESCALATE` → `stage: "needs-human"`, `note`: the decision's
   Reason line. Stop.

### Merge

Git refuses to check out a branch that another worktree already has, so first find
where `$MERGE` lives:

```bash
HOLDER=$(git worktree list --porcelain | awk -v b="branch refs/heads/$MERGE" '/^worktree /{w=substr($0,10)} $0==b{print w}')
```

- **`$HOLDER` empty** (nobody has `$MERGE` checked out): merge in the job worktree.
  ```bash
  cd "$WT" && git switch "$MERGE" && git merge --no-ff "factory/<job-id>" -m "factory: merge <job-id>"
  ```
- **`$HOLDER` set and clean** (`git -C "$HOLDER" status --porcelain` prints nothing):
  merge there. A clean tree with no conflicts is safe to merge into.
  ```bash
  git -C "$HOLDER" merge --no-ff "factory/<job-id>" -m "factory: merge <job-id>"
  ```
- **`$HOLDER` has uncommitted changes**: don't touch it. Set `needs-human` with
  `note: "$MERGE is checked out at $HOLDER with uncommitted changes"`. The user commits
  or switches, then runs `/factory approve <job-id>`.

If the merge conflicts, run `git merge --abort` in the same place and set `needs-human`
with the reason. On success, set `stage: "merged"`, then `git worktree remove "$WT"`
(after `git switch --detach` if you merged in `$WT`). Keep the branch. Do **not** push.
Tell the user `git push origin $MERGE`.

---

## /factory next

Read `factory/backlog.md`, take the first `- [ ]` line, change it to
`- [x] … → <job-id>`, then run `/factory <that line's text>`. If no line is unchecked, say so.

## /factory approve <job-id>

Only for a job in `needs-human`. Show the user the decision or note first, then run
**Merge**. Add `"approvedBy": "human"` to the job.

## /factory rework <job-id> <note>

Write the note to `$JOB/rework-<k>.md` (k = 1, 2, …). Set `stage: "build"`, `note: ""`.
Resume (or respawn) the builder, pointing it at that file, then run the next review
round. A human rework gives the job a fresh `MAX_ROUNDS` budget from that round.

---

## Report

End every run with one short block: job id, final stage, branch, rounds used, and the
next command (`/factory approve <id>`, `git push origin develop`, or `/factory next`).
Dashboard: `cd factory && python3 -m http.server 8000` → http://localhost:8000/dashboard.html
