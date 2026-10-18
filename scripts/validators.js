export const RX = {
    title: [/^\S(?:.*\S)?$/, 'Title must not be empty or start/end with space.'],
    duration: [/^(0|[1-9]\d*)(\.\d{1,2})?$/, 'Duration must be minutes, e.g. 30 or 1.5.'],
    dueDate: [/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12\d |3[01])$/, 'Date must be YYYY-MM-DD.'],
    tag: [/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/, 'Tag must be letters, single spaces or hyphens.'],

};
export const DUP = /\b(\w+)\s+\1\b/i;

export const clean = s => s.replace(/\s{2,}/g, ' ');

export function validate(t) {
    const err = {};
    for (const k in RX) if (!RX[k][0].test(string(t[k] ?? ''))) err[k] = RX[k][1];
    return err;
}
