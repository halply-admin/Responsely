// apps/web/modules/customization/ui/components/customization-form.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Separator } from "@workspace/ui/components/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { ColorPicker } from "@workspace/ui/components/color-picker";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { VapiFormFields } from "./vapi-form-fields";

// Enhanced schema to match the new structure
const widgetSettingsSchema = z.object({
  greetMessage: z.string().min(1, "Welcome message is required").max(500, "Welcome message is too long"),
  
  defaultSuggestions: z.object({
    suggestion1: z.string().max(100, "Suggestion is too long").optional(),
    suggestion2: z.string().max(100, "Suggestion is too long").optional(),
    suggestion3: z.string().max(100, "Suggestion is too long").optional(),
  }),
  
  appearance: z.object({
    primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please enter a valid hex color"),
    position: z.enum(["bottom-right", "bottom-left"]),
    theme: z.enum(["light", "dark", "auto"]),
  }),
  
  vapiSettings: z.object({
    assistantId: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
});

type FormSchema = z.infer<typeof widgetSettingsSchema>;
type WidgetSettings = Doc<"widgetSettings">;

interface CustomizationFormProps {
  initialData?: WidgetSettings | null;
  hasVapiPlugin: boolean;
}

export const CustomizationForm = ({
  initialData,
  hasVapiPlugin,
}: CustomizationFormProps) => {
  const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert);

  const form = useForm<FormSchema>({
    resolver: zodResolver(widgetSettingsSchema),
    defaultValues: {
      greetMessage: initialData?.greetMessage || "Hi! How can I help you today?",
      defaultSuggestions: {
        suggestion1: initialData?.defaultSuggestions?.suggestion1 || "How do I get started?",
        suggestion2: initialData?.defaultSuggestions?.suggestion2 || "What are your pricing plans?",
        suggestion3: initialData?.defaultSuggestions?.suggestion3 || "I need help with my account",
      },
      appearance: {
        primaryColor: initialData?.appearance?.primaryColor || "#3b82f6",
        position: initialData?.appearance?.position || "bottom-right",
        theme: initialData?.appearance?.theme || "light",
      },
      vapiSettings: {
        assistantId: initialData?.vapiSettings?.assistantId || "",
        phoneNumber: initialData?.vapiSettings?.phoneNumber || "",
      },
    },
  });

  const onSubmit = async (values: FormSchema) => {
    try {
      const vapiSettings: WidgetSettings["vapiSettings"] = {
        assistantId: values.vapiSettings.assistantId === "none" ? "" : values.vapiSettings.assistantId,
        phoneNumber: values.vapiSettings.phoneNumber === "none" ? "" : values.vapiSettings.phoneNumber,
      };

      await upsertWidgetSettings({
        greetMessage: values.greetMessage,
        defaultSuggestions: values.defaultSuggestions,
        appearance: values.appearance,
        vapiSettings,
      });

      toast.success("Widget settings saved successfully");
    } catch (error) {
      console.error("Error updating widget settings:", error);
      toast.error("Failed to save settings. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        
        {/* General Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure basic chat widget behavior and messaging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="greetMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Welcome Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter the message customers see when they first open the chat"
                      rows={3}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    This message appears when customers open the chat widget for the first time.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Quick Suggestions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Suggestions</CardTitle>
            <CardDescription>
              Predefined responses to help customers start conversations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="defaultSuggestions.suggestion1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suggestion 1</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., How do I get started?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="defaultSuggestions.suggestion2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suggestion 2</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., What are your pricing plans?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="defaultSuggestions.suggestion3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suggestion 3</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., I need help with my account" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Appearance Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance & Branding</CardTitle>
            <CardDescription>
              Customize how your chat widget looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="appearance.primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color</FormLabel>
                  <FormControl>
                    <ColorPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    This color will be used for the widget header, buttons, and accent elements.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="appearance.position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Widget Position</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose where the chat widget appears on your website.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appearance.theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto (follows system)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Set the color scheme for your chat widget.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Voice Assistant Settings Card */}
        {hasVapiPlugin && (
          <Card>
            <CardHeader>
              <CardTitle>Voice Assistant</CardTitle>
              <CardDescription>
                Configure voice calling features powered by VAPI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VapiFormFields form={form} />
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="min-w-[120px]"
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
};