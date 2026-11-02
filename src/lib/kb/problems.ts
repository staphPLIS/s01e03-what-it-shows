// The problems inside one big ticket, counted the desk's way. causes.ts files every report under the
// cause its tenant gives it, and that is where the report is counted. The desk notes (desk-notes.json)
// add the reports whose body shows a one-day move, not a day/month swap: a third problem. Those reports
// stay counted where they are filed, and the one-day move counts them again as its own problem.
import { causeOf, uniqueById, type Cause, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = Cause | 'shift' | 'unplaced';
export const PROBLEMS: readonly Problem[] = ['parser', 'hint', 'shift', 'unplaced'];

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  // What intake tagged these reports as: tag → count.
  taggedAs: Record<string, number>;
  channels: Record<string, number>;
  tenants: number;
  firstSeen: string;
  lastSeen: string;
  // shift only: where these reports are filed, and so also counted.
  alsoIn: Partial<Record<Problem, number>>;
};

export type TicketProblems = {
  rows: number; // rows in the export for this ticket, copies included
  reports: number; // one id, one report
  groups: ProblemGroup[];
};

const tally = (rs: Report[], key: (r: Report) => string) =>
  rs.reduce<Record<string, number>>((n, r) => ({ ...n, [key(r)]: (n[key(r)] ?? 0) + 1 }), {});

function group(problem: Problem, rs: Report[], alsoIn: ProblemGroup['alsoIn'] = {}): ProblemGroup {
  const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
  return {
    problem,
    reports: rs,
    taggedAs: tally(rs, (r) => r.meta.intakeTag),
    channels: tally(rs, (r) => r.channel),
    tenants: new Set(rs.map((r) => r.tenant)).size,
    firstSeen: days[0],
    lastSeen: days[days.length - 1],
    alsoIn,
  };
}

export function problemsIn(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  shiftIds: readonly string[],
): TicketProblems {
  const rows = all.filter((r) => r.mergedInto === ticket);
  const reports = uniqueById(rows);
  const filedAs = (r: Report): Problem => causeOf(r, tenantOf(r)) ?? 'unplaced';

  const byCause = new Map<Problem, Report[]>();
  for (const r of reports) byCause.set(filedAs(r), [...(byCause.get(filedAs(r)) ?? []), r]);
  const groups = [...byCause.entries()].map(([p, rs]) => group(p, rs)).sort((a, b) => b.reports.length - a.reports.length);

  const shifted = reports.filter((r) => shiftIds.includes(r.id));
  if (shifted.length) groups.push(group('shift', shifted, tally(shifted, filedAs) as ProblemGroup['alsoIn']));

  return { rows: rows.length, reports: reports.length, groups };
}

export function countOf(p: TicketProblems, problem: Problem | 'all' | 'copies'): number {
  if (problem === 'all') return p.reports;
  if (problem === 'copies') return p.rows - p.reports;
  return p.groups.find((g) => g.problem === problem)?.reports.length ?? 0;
}
