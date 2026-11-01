import type { HarnessIcon } from "./types";

/**
 * Reflection mark — Mirror is Reflection's coding harness, so the harness uses
 * the Reflection symbol. The source artwork is a wide 2:1 lockup symbol; it is
 * scaled to the 24x24 grid and centred vertically so it sits at the same
 * optical weight as the other square marks.
 */
export const MirrorIcon: HarnessIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <g transform="translate(0 6.2) scale(0.14056)">
      <path d="M170.36 41.25c0 22.417-18.173 40.59-40.59 40.59s-40.59-18.173-40.59-40.59S107.353.66 129.77.66s40.59 18.173 40.59 40.59ZM40.59.66C18.173.66 0 18.833 0 41.25s18.173 40.59 40.59 40.59 40.59-18.173 40.59-40.59S63.007.66 40.59.66ZM73.18 41.25c0 17.999-14.591 32.59-32.59 32.59S8 59.249 8 41.25 22.591 8.66 40.59 8.66s32.59 14.591 32.59 32.59Z" />
    </g>
  </svg>
);
