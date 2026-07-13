# Imaginary Numbers, the Useful Way — Editing Guide

Interactive widgets live in `complex-explorer.jsx`; the prose lives in plain
Markdown under `content/`. You can rewrite any page's text without touching React.

## File layout

```
complex-explorer.jsx      ← main React component (plots, complex plane, quaternion cube, phasors, quizzes)
Markdown.jsx              ← lightweight parser that renders the .md files
shared-blocks.jsx         ← styled boxes (Prose, Callout, Definition, TakeHome)
theme.js                 ← dark "complex-plane" palette and fonts
content/
  ch0-why-wrong.md        ← We start in the wrong place
  ch1-cubic.md            ← The cubic that forced our hand
  ch2-rotation.md         ← Numbers that love to rotate
  ch-euler.md             ← e^{iπ}: Euler's formula (motivated)
  ch3-quaternions.md      ← Quaternions, as simply as possible
  ch4-quantum.md          ← Why quantum mechanics is built on i
  ch5-capstone.md         ← Capstone
```

## Page structure

Each file is split into a `# intro` (before the widget) and `# outro` (after —
closing prose + the take-home box):

```markdown
# intro
Text, with **bold**, *italic*, `code`, and {{math spans}}.

# outro
Closing prose, plus a :::takehome block.
```

Keep the `# intro` / `# outro` markers — they tell the component where to split.

## Custom directives

- `:::callout color=cyan ... :::end` — italic side-note with a coloured bar
  (colors: cyan, magenta, gold, green, orange, purple, muted)
- `:::definition ... :::playful ... :::end` — formal statement + plain-English version
- `:::takehome color=gold` with `:::major` / `:::minor` bullet lists — the ✦ box

## Inline formatting

| Write | Get |
| --- | --- |
| `**bold**` | bold |
| `*italic*` | italic |
| `` `code` `` | monospace gold |
| `{{e^{iθ}}}` | math span (monospace gold) — use for all formulas |
| `[text](https://...)` | link |

## What lives in the JSX (not Markdown)

All interactive widgets — the parabola/cubic plots, the complex-plane multiplier,
the quaternion multiplication table and rotating cube, the phasor-sum demo — and
**the quiz questions** (take-home checks + working-knowledge lists) live in
`complex-explorer.jsx`, because they carry logic and reveal-able answers. To edit
a question, find the chapter's component (e.g. `Ch1`) and edit its `questions` array.

## Quick start

```
npm install
npm run dev
```

Edits to `content/*.md` hot-reload instantly.
