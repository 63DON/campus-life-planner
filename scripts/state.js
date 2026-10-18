import { load, save } from './storage.js';

export const S = { tasks: [], nextId: 1, settings: { unit: 'min', cap: 0 }};
const now = () => new Date().toISOString();
const sum = list => list.reduce((s, t) => s + t.duration, 0);

export async function init() {
    const d = load();
    if (d) Object.assign(S, d);
    else replace(await (await fetch('seed.json')).json());
}

export function replace(tasks) {
    S.tasks = tasks;
    S.nextId = Math.max(S.nextId, ...tasks.map(t => +t.id.slice(5) + 1));
    save(S);
}

export function add(t) {
    S.tasks.push({ id: 'task_' + String(S.nextId++).padStart(4, '0'), ...t, createdAt: now(), updatedAt: now() });
    save(S);
}

export function edit(id, t) {
    Object.assign(S.tasks.find(x => x.id === id), t, { updatedAt: now()});
    save(S);
}

export function remove(id) {
    S.tasks = S.tasks.filter(x => x.id !== id);
    save(S);
}

export function setSettings(o) {
    Object.assign(S.settings, o);
    save(S);
}

export function stats() {
    const count = {};
    S.tasks.forEach(t => count[t.tag] = (count[t.tag] || 0) + 1);
    const top = Object.keys(count).sort((a, b) => count[b] - count[a])[0] || 'none';
    const days = [...Array(7)].map((_, i) => {
        const d = new Date(Date.now() - (6 - i) * 864e5).toLocaleDateString('en-CA');
        return { d, m: sum(S.tasks.filter(t => t.dueDate === d)) };
    });
    return { total: sum(S.tasks), top, days };
}

export const fmt = m => S.settings.unit === 'h' ? +(m / 60).toFixed(2) + ' h' : m + ' min';