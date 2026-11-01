import type { ComponentType } from "react";

/**
 * A harness brand mark.
 *
 * The host renders provider icons inline and passes its own sizing class, so a
 * mark must scale with `className` and paint with `currentColor` — that keeps
 * one glyph legible in both the light and the dark theme.
 */
export type HarnessIcon = ComponentType<{ className?: string }>;
