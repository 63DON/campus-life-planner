import { validate } from './validators.js';

const KEY ='campus-life-planner';

export function load() {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return null;
    try { const d = JSON.parse(raw); return Array.isArray(d.tasks) ? d : {}; } catch { return {}; }
}

export const save = data => localStorage.setItem(KEY, JSON.stringify(data));

export function exportJSON(tasks) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json'}));
    a.download = 'campus-life-planner.json';
    a.click();
}

export async function importJSON(file) {
    const d = JSON.parse(await file.text());
    if (!Array.isArray(d) || new Set(d.map(t => t.id)).size !== d.length
      || d.some(t => !/^task_\d+$/.test(t.id) || Object.keys(validate(t)).length)) throw 0;
    return d;
}