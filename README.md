# imaginary_numbers_for_teenagers

An interactive, geometry-first introduction to imaginary numbers for a sharp
teenager — built in the same style as
[matrices_for_11_year_olds](https://jeremydwong.github.io/matrices_for_11_year_olds/)
and [fractions_for_6_year_olds](https://github.com/jeremydwong/fractions_for_6_year_olds).

Inspired by Tristan Needham's *Visual Complex Analysis* (lead with **utility and
geometry**, not with a definition rescued from {{x² + 1 = 0}}) and Feynman's *QED*.

## The pages

0. **We start in the wrong place** — why opening with quadratics makes `i` look fake, and why textbooks do it anyway
1. **The cubic that forced our hand** — the Cardano/Bombelli history; `x³ = 15x + 4` reaches a real root only through `√−121`
2. **Numbers that love to rotate** — `i` as a 90° turn, `i² = −1` from geometry, multiply = scale + add-angle
3. **e^{iπ}: Euler's formula** — motivated, not declared: "velocity = i·position" forces the unit circle; plus its utility
4. **Quaternions, as simply as possible** — a "how to use them" box up top, then 3D rotation
5. **Why quantum mechanics is built on `i`** — complex amplitudes, phase = rotation, Feynman's arrows
6. **Capstone** — recap, mixed checks, and where to read next

Every page ends with **take-home points**, a few **take-home test questions**
(with reveal-able answers), and a list of harder **working-knowledge** problems.

## Style

The visual design derives from the reference stylesheets in
[`styles/reference/`](styles/reference/) — `normalize.css`, Skeleton
(`skeleton.css`), and `custom.css` (dark `#242424` default, Raleway,
`#33C3F0` accent, the blue navbar, the light/dark toggle switch).
`theme.js` documents which token comes from which rule.
[`styles/site.css`](styles/site.css) explains why `custom.css` isn't imported
wholesale (its bare `label`/`input` rules would hide the widget sliders) and
scopes the pieces used. Light mode reuses the `invert(1) hue-rotate(180deg)`
filter trick `custom.css` applies to SVGs.

## Requirements

node.js

## Build & run

```
npm install
npm run dev
```

Then open the local URL it prints (usually http://localhost:5173).
Production build: `npm run build` (output in `dist/`).

## Editing the words

Prose for each page lives in `content/*.md` and can be edited without touching
React. The interactive widgets and the quiz questions live in
`complex-explorer.jsx`. See [`content/README.md`](content/README.md).

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to `main` (set **Settings → Pages → Source → GitHub Actions** once). The
site serves under `/<repo-name>/` automatically via the `BASE_PATH` env var.
