import { definePluginApp } from "@get-bb/plugin-sdk/app";

import { HARNESS_ICON_REGISTRATIONS } from "./src/icons";

/**
 * Registers every mark in the harness registry with bb's provider-icon slot.
 *
 * `provider-acp` has no per-agent artwork for custom agents: it draws its
 * generic ACP glyph unless the agent id happens to match an ACP-registry id.
 * This plugin fills that gap for the harnesses we run, so adding a harness is
 * one entry in `src/brands.ts` (plus its mark) rather than another plugin.
 */
export default definePluginApp((app) => {
  for (const { providerId, Icon } of HARNESS_ICON_REGISTRATIONS) {
    app.slots.experimental_providerIcon({
      providerKind: "agent",
      providerId,
      icon: Icon,
    });
  }
});
