/**
 * The harness registry: the single place that knows which harnesses get a brand
 * mark and which bb agent-provider ids they answer to.
 *
 * Kept free of React and of the icon components so both surfaces can read it:
 * `app.tsx` asks for the artwork, and `server.ts` (the `bb harness-icons`
 * report) imports only this data.
 */

/** One harness and every provider id it can appear under. */
export interface HarnessBrand {
  /** Stable key used to look up the artwork. */
  id: string;
  /** Brand name shown in the diagnostics report. */
  name: string;
  /**
   * bb agent-provider ids — the id bb knows the provider by, e.g. `acp-dsh`.
   *
   * A harness can have several: the same agent may be a hand-configured custom
   * agent (`acp-kimi-code`) or arrive from the ACP registry under its registry
   * id (`acp-kimi`).
   */
  providerIds: readonly string[];
}

export const HARNESS_BRANDS = [
  {
    id: "deepseek",
    name: "DeepSeek",
    providerIds: ["acp-dsh"],
  },
  {
    id: "kimi",
    name: "Kimi",
    providerIds: ["acp-kimi-code", "acp-kimi"],
  },
  {
    id: "glm",
    name: "Z.ai (GLM)",
    providerIds: ["acp-zcode"],
  },
  {
    id: "mirror",
    name: "Reflection (Mirror)",
    providerIds: ["acp-mirror"],
  },
] as const satisfies readonly HarnessBrand[];

/** Every brand id the icon set must cover. */
export type HarnessBrandId = (typeof HARNESS_BRANDS)[number]["id"];

/**
 * provider id -> brand. Built once so a provider listed by two harnesses fails
 * loudly at load instead of the last registration quietly winning.
 */
export const HARNESS_BRAND_BY_PROVIDER: ReadonlyMap<string, HarnessBrand> = (() => {
  const byProvider = new Map<string, HarnessBrand>();
  for (const brand of HARNESS_BRANDS) {
    for (const providerId of brand.providerIds) {
      const existing = byProvider.get(providerId);
      if (existing !== undefined) {
        throw new Error(
          `harness icon for "${providerId}" is declared by both ${existing.name} and ${brand.name}`,
        );
      }
      byProvider.set(providerId, brand);
    }
  }
  return byProvider;
})();

/**
 * The shared artwork `provider-acp` serves for a custom agent it has no mark
 * for. Depending on the catalog projection it shows up as a `logoUrl` or as a
 * null, so both mean "no artwork of its own".
 */
const GENERIC_ACP_LOGO_PATH = "/plugins/provider-acp/assets/icon";

/** Whether a provider already ships artwork of its own. */
export function hasOwnArtwork(provider: { logoUrl?: string | null }): boolean {
  const logoUrl = provider.logoUrl;
  if (logoUrl === null || logoUrl === undefined) return false;
  return !logoUrl.includes(GENERIC_ACP_LOGO_PATH);
}
