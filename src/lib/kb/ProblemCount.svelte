<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { countOf, problemsIn, type Problem } from '#lib/kb/problems';

  // One number from the ticket, for a sentence: <ProblemCount ticket={4471} problem="hint" />
  let { ticket, problem }: { ticket: number; problem: Problem | 'all' | 'copies' } = $props();

  const n = $derived(countOf(problemsIn(reports as Report[], ticket, tenantOf, notes.oneDayMove), problem));
</script>

<strong>{n}</strong>
