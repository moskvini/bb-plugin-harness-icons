import type { BbPluginApi } from "@get-bb/plugin-sdk";

import {
  hasOwnArtwork,
  HARNESS_BRAND_BY_PROVIDER,
  HARNESS_BRANDS,
} from "./src/brands";

/**
 * The icon half of this plugin lives in `app.tsx`; the server entry adds the
 * `bb harness-icons` report so the registry can be audited against the live
 * provider catalog. A harness whose ids drifted shows up here instead of
 * silently going back to the generic ACP glyph.
 */
export default async function plugin(bb: BbPluginApi): Promise<void> {
  bb.cli.register({
    name: "harness-icons",
    summary: "Report which harnesses have brand marks and which fall back to the ACP glyph",
    commands: [
      {
        name: "list",
        summary: "Show harness brand coverage",
        usage: "bb harness-icons [list] [--json]",
      },
    ],
    async run(argv) {
      const json = argv.includes("--json");
      const [subcommand] = argv.filter((arg) => arg !== "--json");
      if (subcommand !== undefined && subcommand !== "list") {
        return {
          exitCode: 1,
          stderr: "Usage: bb harness-icons [list] [--json]",
        };
      }

      let providers: Array<{
        id: string;
        displayName: string;
        family?: string;
        logoUrl?: string | null;
      }> = [];
      let catalogError: string | null = null;
      try {
        providers = await bb.sdk.providers.list();
      } catch (cause) {
        catalogError = cause instanceof Error ? cause.message : String(cause);
      }

      const liveIds = new Set(providers.map((provider) => provider.id));
      const brands = HARNESS_BRANDS.map((brand) => ({
        name: brand.name,
        providerIds: [...brand.providerIds],
        liveProviderIds: brand.providerIds.filter((id) => liveIds.has(id)),
      }));

      const unmapped =
        catalogError === null
          ? providers
              .filter(
                (provider) =>
                  (provider.family === "acp" || provider.id.startsWith("acp-")) &&
                  !HARNESS_BRAND_BY_PROVIDER.has(provider.id) &&
                  !hasOwnArtwork(provider),
              )
              .map((provider) => ({ id: provider.id, displayName: provider.displayName }))
              .sort((left, right) => left.id.localeCompare(right.id))
          : [];

      if (json) {
        return {
          exitCode: 0,
          stdout: JSON.stringify({ brands, unmapped, catalogError }),
        };
      }

      const lines = ["Harness icons — brand marks registered with bb", ""];
      const idColumn = Math.max(...brands.map((brand) => brand.providerIds.join(", ").length));
      const nameColumn = Math.max(...brands.map((brand) => brand.name.length));
      for (const brand of brands) {
        const state =
          brand.liveProviderIds.length > 0
            ? `live: ${brand.liveProviderIds.join(", ")}`
            : "not in the provider catalog";
        lines.push(
          `${brand.name.padEnd(nameColumn)}  ${brand.providerIds.join(", ").padEnd(idColumn)}  ${state}`,
        );
      }

      if (catalogError !== null) {
        lines.push("", `Could not read the provider catalog: ${catalogError}`);
      } else if (unmapped.length > 0) {
        lines.push("", "ACP providers still on the generic glyph:");
        for (const provider of unmapped) {
          lines.push(`  ${provider.id.padEnd(nameColumn)}  ${provider.displayName}`);
        }
        lines.push(
          "",
          "Add a brand mark: one entry in src/brands.ts plus its icon under src/icons/.",
        );
      } else {
        lines.push("", "Every ACP provider either has a brand mark or its own artwork.");
      }

      return { exitCode: 0, stdout: lines.join("\n") };
    },
  });
}
