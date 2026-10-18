# Campus Life Planner

## Overview
Plan campus tasks, due dates and study time. Vanilla HTML, CSS and JavaScript (ES modules), no libraries.
By Bayubahe Don ([63DON](https://github.com/63DON), b.don@alustudent.com).

- Live URL: https://63don.github.io/campus-life-planner/
- Demo video: link

## Data model
`{ id: "task_0001", title, dueDate: "YYYY-MM-DD", duration: minutes, tag, createdAt, updatedAt }`
Ids are unique and never reused. Data is saved in one localStorage key; `seed.json` loads on first run.

## Features
Add, edit inline (Enter saves, Escape cancels), delete with confirm. Regex search with ignore case and `<mark>` highlights. Sort by due date, title or duration. Dashboard with totals, top tag and a 7-day chart. Time cap, minutes/hours setting, JSON import/export.

## Regex catalog
| Rule | Pattern | Example |
|---|---|---|
| Title | `^\S(?:.*\S)?$` | `Study group` |
| Duration | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | `90`, `0.5` |
| Due date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | `2024-02-29` |
| Tag | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | `Group Project` |
| Duplicate word (warning) | `\b(\w+)\s+\1\b` | `the the` |

Search examples: `\b\d{2}:\d{2}\b`, `(exam|quiz)`, `\b(\w+)\s+\1\b`.

## Keyboard map
Tab / Shift+Tab move, Enter activates links and buttons and saves an edit, Space toggles the checkbox and buttons, Escape cancels an edit. The first Tab reveals "Skip to content".

## Accessibility
Landmarks, one h1 and an h2 per section, labels on every input, errors linked with aria-describedby and aria-invalid, a polite status region and an assertive alert region, visible focus outlines, dark text on light background, a hidden text summary of the chart, and no motion under prefers-reduced-motion.

## Layout sketch
```
[Skip link]  Campus Life Planner  | About Dashboard Tasks Add Settings
About | Dashboard (stats + 7 bars)
Tasks: search [ ] [x] ignore case  sort [v]   table (scrolls on mobile)
Add Task form | Settings (units, cap, export, import)
[status / alert bar]  footer
```

## Run and test
Serve the folder (e.g. `python -m http.server`) and open `index.html`. Open `tests.html` to see pass/fail results.
