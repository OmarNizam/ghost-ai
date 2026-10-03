import type { LocalizationResource } from "@clerk/nextjs/types";

// Keep the full "Continue with <provider>" label even when several social providers are shown.
export const clerkLocalization: LocalizationResource = {
  socialButtonsBlockButtonManyInView: "Continue with {{provider|titleize}}",
};
