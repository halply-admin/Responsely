// apps/web/modules/customization/types.ts

import { z } from "zod";
import { widgetSettingsSchema } from "./schemas";

export type FormSchema = z.infer<typeof widgetSettingsSchema>;

export interface AppearanceSettings {
  primaryColor: string;
  position: "bottom-right" | "bottom-left";
  theme: "light" | "dark" | "auto";
}

export interface DefaultSuggestions {
  suggestion1?: string;
  suggestion2?: string;
  suggestion3?: string;
}

export interface VapiSettings {
  assistantId?: string;
  phoneNumber?: string;
}