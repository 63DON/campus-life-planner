export function compile(pattern, ignoreCase) {
    try { return pattern ? new RegExp(pattern, ignoreCase ? 'i' : '') : null; } catch { return null; }
}

export const filter = (tasks, re) => re ? tasks.filter(t => re.test(t.title) || re.test(t.tag) || re.test(t.dueDate)) : tasks;

const SORTS = {
    due: (a, b) => a.dueDate.localeCompare(b.dueDate),
    az: (a, b) => a.title.localeCompare(b.title),
    za: (a, b) => b.title.localeCompare(a.title),
    short: (a, b) => a.duration - b.duration,
    long: (a, b) => b.duration - a.duration,
};
export const sort = (tasks, key) => [...tasks].sort(SORTS[key]);

export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const highlight = (s, re) => esc(re ? String(s).replace(new RegExp(re.source, re.flags + 'g'), m => m && `\x01${m}\x02`) : s)
  .replace(/\x01/g, '<mark>').replace(/\x02/g, '</mark>');