// The problems inside one big ticket. causes.ts places a report by its tenant; the desk notes
// (desk-notes.json) add the reports whose body shows a one-day move, not a day/month swap.
// Those are a third problem, whatever the tenant: they are taken out before the tenant decides.
import { causeOf, uniqueById, type Cause, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = Cause | 'shift' | 'unplaced';
export const PROBLEMS: readonly Problem[] = ['parser', 'hint', 'shift', 'unplaced'];

export function problemOf(r: Report, t: Tenant | undefined, shiftIds: readonly string[]): Problem {
  if (shiftIds.includes(r.id)) return 'shift';
  return causeOf(r, t) ?? 'unplaced';
}

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  // What intake tagged these reports as: tag → count.
  taggedAs: Record<string, number>;
  channels: Record<string, number>;
  tenants: number;
  firstSeen: string;
  lastSeen: string;
};

export type TicketProblems = {
  rows: number; // rows in the export for this ticket, copies included
  reports: number; // one id, one report
  groups: ProblemGroup[];
};

const tally = (rs: Report[], key: (r: Report) => string) =>
  rs.reduce<Record<string, number>>((n, r) => ({ ...n, [key(r)]: (n[key(r)] ?? 0) + 1 }), {});

export function problemsIn(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  shiftIds: readonly string[],
): TicketProblems {
  const rows = all.filter((r) => r.mergedInto === ticket);
  const reports = uniqueById(rows);
  const byProblem = new Map<Problem, Report[]>();
  for (const r of reports) {
    const p = problemOf(r, tenantOf(r), shiftIds);
    byProblem.set(p, [...(byProblem.get(p) ?? []), r]);
  }
  const groups = [...byProblem.entries()]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: rs,
        taggedAs: tally(rs, (r) => r.meta.intakeTag),
        channels: tally(rs, (r) => r.channel),
        tenants: new Set(rs.map((r) => r.tenant)).size,
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
  return { rows: rows.length, reports: reports.length, groups };
}

export function countOf(p: TicketProblems, problem: Problem | 'all' | 'copies'): number {
  if (problem === 'all') return p.reports;
  if (problem === 'copies') return p.rows - p.reports;
  return p.groups.find((g) => g.problem === problem)?.reports.length ?? 0;
}
