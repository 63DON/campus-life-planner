import { S, init, add, edit, remove, replace, setSettings, stats, fmt } from './state.js';
import { validate, DUP, clean } from './validators.js';
import { compile, filter, sort, highlight, esc } from './search.js';
import { exportJSON, importJSON } from './storage.js';
const $ = s => document.querySelector(s), form = $('#form'), polite = $('#polite'), loud = $('#loud');
let editing = null;
const norm = t =>({ ...t, title: clean(t.title), duration: +t.duration }), formData = () => Object.fromEntries(new FormData(form));
const cell = (name, label, v) => `<td><input name="${name}" aria-label="${label}" value="${esc(v)}"></td>`;
const row = (t, re) => `<tr data-id="${t.id}">${t.id === editing
    ? cell('title', 'Title', t.title)
      + cell('dueDate', 'Due date', t.dueDate)
      + cell('duration', 'Duration in minutes', t.duration)
      + cell('tag', 'Tag', t.tag)
      + `<td><button data-act="save">Save</button> <button data-act="del" aria-label="Delete ${esc(t.title)}">Delete</button></td>`
    : `<td>${highlight(t.title, re)}</td><td>${highlight(t.dueDate, re)}</td><td>${highlight(t.duration, re)}</td><td>${highlight(t.tag, re)}</td><td><button data-act="edit">Edit</button></td>`
}</tr>`;

function render(msg = '') {
  const q = $('#q').value, re = compile(q, $('#ci').checked), list = sort(filter(S.tasks, re), $('#sort').value);
  const { total, top, days } = stats(), max = Math.max(1, ...days.map(d => d.m)), cap = S.settings.cap, left = cap - total;
  $('#rows').innerHTML = list.map(t => row(t, re)).join('') || '<tr><td colspan="5">No tasks</td></tr>';
  Object.entries({ count: S.tasks.length, time: fmt(total), top, 'chart-sum': 'Last 7 days by due date: ' + days.map(d => `${d.d} ${fmt(d.m)}`).join(', ') }).forEach(([id, v]) => $('#' + id).textContent = v);
  $('#chart').innerHTML = days.map(d => `<div><span style="height:${d.m / max * 110}px"></span>${d.d.slice(5)}</div>`).join('');
  polite.textContent = [msg, q && !re && 'Invalid pattern.', `${list.length} of ${S.tasks.length} tasks shown.`, cap > 0 && left >= 0 && `${fmt(left)} remaining under your cap.`].filter(Boolean).join(' ');
  loud.textContent = cap > 0 && left < 0 ? `Over your time cap by ${fmt(-left)}!` : '';
}
function act(id, a) {
  const t = Object.fromEntries([...document.querySelectorAll(`[data-id="${id}"] input`)].map(i => [i.name, i.value])), err = a === 'save' ? Object.values(validate(t)) : [];
  if (err.length) return loud.textContent = err.join(' ');
  if (a === 'save') edit(id, norm(t)); else if (a === 'del') { if (!confirm('Delete this task?')) return; remove(id); }
  if (a !== 'del') editing = a === 'edit' ? id : null;
  render({ save: 'Task saved.', del: 'Task deleted.' }[a]);
  ($(`[data-id="${id}"] ${editing ? 'input' : 'button'}`) || $('#q')).focus();
}
$('#rows').onclick = e => { const b = e.target.closest('button'); if (b) act(b.closest('tr').dataset.id, b.dataset.act); };
$('#rows').onkeydown = e => { if (e.target.matches('input') && (e.key === 'Enter' || e.key === 'Escape')) act(editing, e.key === 'Enter' ? 'save' : 'cancel'); };
const show = (n, err) => { form.elements[n].setAttribute('aria-invalid', !!err[n]);
  $('#e-' + n).textContent = err[n] || (n === 'title' && DUP.test(form.elements[n].value) ? 'Warning: duplicated word.' : ''); };
form.oninput = e => show(e.target.name, validate(formData()));
form.onsubmit = e => {
  e.preventDefault(); const t = formData(), err = validate(t); Object.keys(t).forEach(n => show(n, err));
  if (Object.keys(err).length) { polite.textContent = 'Task not added: fix the highlighted fields.'; return form.querySelector('[aria-invalid="true"]').focus(); }
  add(norm(t)); form.reset(); Object.keys(t).forEach(n => show(n, {})); render('Task added.'); };
$('#q').oninput = $('#ci').onchange = $('#sort').onchange = () => render();
$('#unit').onchange = e => { setSettings({ unit: e.target.value }); render('Units saved.'); };
$('#cap').onchange = e => { setSettings({ cap: +e.target.value }); render('Cap saved.'); };
$('#export').onclick = () => exportJSON(S.tasks);
$('#import').onchange = async e => {
  try { const d = await importJSON(e.target.files[0]); replace(d.map(norm)); render(`Imported ${d.length} tasks.`); }
  catch { loud.textContent = 'Import failed: file must be a JSON array of valid tasks with unique ids. Nothing changed.'; } finally { e.target.value = ''; } };
await init(); $('#unit').value = S.settings.unit; $('#cap').value = S.settings.cap || ''; render();