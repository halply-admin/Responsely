// apps/web/modules/customization/schemas.ts

import { z } from "zod";

export const widgetSettingsSchema = z.object({
  // General Settings
  greetMessage: z
    .string()
    .min(1, "Welcome message is required")
    .max(500, "Welcome message must be less than 500 characters"),
  
  // Quick Suggestions
  defaultSuggestions: z.object({
    suggestion1: z
      .string()
      .max(100, "Suggestion must be less than 100 characters")
      .optional()
      .or(z.literal("")),
    suggestion2: z
      .string()
      .max(100, "Suggestion must be less than 100 characters")
      .optional()
      .or(z.literal("")),
    suggestion3: z
      .string()
      .max(100, "Suggestion must be less than 100 characters")
      .optional()
      .or(z.literal("")),
  }),
  
  // Appearance Settings
  appearance: z.object({
    primaryColor: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please enter a valid hex color (e.g., #3b82f6)"),
    position: z.enum(["bottom-right", "bottom-left"], {
      errorMap: () => ({ message: "Position must be either bottom-right or bottom-left" }),
    }),
    theme: z.enum(["light", "dark", "auto"], {
      errorMap: () => ({ message: "Theme must be light, dark, or auto" }),
    }),
  }),
  
  // Voice Assistant Settings
  vapiSettings: z.object({
    assistantId: z.string().optional().or(z.literal("")),
    phoneNumber: z.string().optional().or(z.literal("")),
  }),
});

export type WidgetSettingsSchema = z.infer<typeof widgetSettingsSchema>;