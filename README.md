# bb-plugin-harness-icons

Brand marks for the coding harnesses bb runs through ACP providers, so each
harness looks like itself in bb's provider pickers, thread headers and sidebar
instead of sharing the generic ACP glyph.

One plugin, one registry. Adding a harness is a data edit, not a new plugin.

## What it draws

| Harness | Brand mark | bb provider ids |
| --- | --- | --- |
| DSH | DeepSeek | `acp-dsh` |
| Kimi Code | Kimi (Moonshot AI) | `acp-kimi-code`, `acp-kimi` |
| ZCode | Z.ai (GLM) | `acp-zcode` |
| Mirror | Reflection | `acp-mirror` |

## How it works

`provider-acp` registers custom ACP agents without per-agent artwork: the icon
is its generic `Toolbox` glyph unless the agent id happens to match an ACP
registry id. bb's client exposes a provider-icon slot for exactly this gap, and
this plugin registers one mark per provider id through it.

```
src/brands.ts        brand registry: name + provider ids (no React)
src/icons/index.ts   artwork per brand id + the flat registration list
src/icons/*.tsx      the marks themselves (inline SVG, currentColor)
app.tsx              registers every entry with bb's provider-icon slot
server.ts            `bb harness-icons` coverage report
```

`src/brands.ts` is React-free so the server entry can read it too.
`HARNESS_ICONS` is typed `Record<HarnessBrandId, HarnessIcon>`, so adding a
brand without a mark is a compile error, and a provider id claimed by two
brands throws at load instead of silently winning.

## Add a harness

1. Drop the mark in `src/icons/<brand>.tsx` — a component that renders an
   inline `<svg viewBox="0 0 24 24">`, honours `className`, and paints with
   `currentColor` (one glyph for both themes).
2. Export it from `src/icons/index.ts` and add it to `HARNESS_ICONS`.
3. Add the brand and its provider ids to `HARNESS_BRANDS` in `src/brands.ts`.
4. `bb plugin build && bb plugin reload harness-icons`.

## Install

```sh
npm install
bb plugin build
bb plugin install .
```

The plugin is server-side: it runs where the bb server runs, and every
connected client draws the marks. Reload is enough after changing an icon.

## Check coverage

```sh
bb harness-icons           # table: brands, provider ids, which ids are live
bb harness-icons --json
```

The report also lists ACP providers that still fall back to the generic glyph,
so a newly added harness is visible instead of just looking wrong.
