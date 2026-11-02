<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { problemsIn, type Problem } from '#lib/kb/problems';

  // `names`: what the page calls each problem. `tickets`: where each problem is filed.
  let {
    ticket,
    names,
    tickets = {},
  }: { ticket: number; names: Partial<Record<Problem, string>>; tickets?: Partial<Record<Problem, string>> } = $props();

  const p = $derived(problemsIn(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const list = (n: Record<string, number>) =>
    Object.entries(n)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ×${v}`)
      .join(' · ');
  const ref = (url: string) => url.replace(/^.*\/issues\//, '#');
</script>

<p class="sum">
  <strong>{p.reports}</strong> reports merged into #{ticket} ·
  <strong>{p.groups.length}</strong>
  {p.groups.length === 1 ? 'problem' : 'problems'}
  <span class="rows">({p.rows} rows in the export; {p.rows - p.reports} are copies of a report already counted)</span>
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>came in by</th><th>intake tagged</th><th>seen</th><th>filed as</th></tr>
  </thead>
  <tbody>
    {#each p.groups as g (g.problem)}
      <tr class:open={!tickets[g.problem]}>
        <td>{names[g.problem] ?? g.problem} <code>{g.problem}</code></td>
        <td>{g.reports.length}</td>
        <td>{g.tenants}</td>
        <td class="tags">{list(g.channels)}</td>
        <td class="tags">{list(g.taggedAs)}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>
          {#if tickets[g.problem]}<a href={tickets[g.problem]}>{ref(tickets[g.problem]!)}</a>{:else}no ticket yet{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .rows { color: var(--muted); font-size: 0.85rem; }
  .tags { color: var(--muted); font-size: 0.85em; }
  .open td { background: var(--warn-bg); }
  .open td:last-child { color: var(--warn); font-weight: 600; }
</style>
