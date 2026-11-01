import { HARNESS_BRANDS, type HarnessBrandId } from "../brands";
import { DeepSeekIcon } from "./deepseek";
import { GlmIcon } from "./glm";
import { KimiIcon } from "./kimi";
import { MirrorIcon } from "./mirror";
import type { HarnessIcon } from "./types";

/**
 * Artwork per brand. The `Record<HarnessBrandId, …>` makes the compiler demand
 * a mark for every brand added to `src/brands.ts`.
 */
export const HARNESS_ICONS: Record<HarnessBrandId, HarnessIcon> = {
  deepseek: DeepSeekIcon,
  glm: GlmIcon,
  kimi: KimiIcon,
  mirror: MirrorIcon,
};

/** One registration per provider id, ready for bb's provider-icon slot. */
export const HARNESS_ICON_REGISTRATIONS: ReadonlyArray<{
  providerId: string;
  brandId: HarnessBrandId;
  brandName: string;
  Icon: HarnessIcon;
}> = HARNESS_BRANDS.flatMap((brand) =>
  brand.providerIds.map((providerId) => ({
    providerId,
    brandId: brand.id,
    brandName: brand.name,
    Icon: HARNESS_ICONS[brand.id],
  })),
);
