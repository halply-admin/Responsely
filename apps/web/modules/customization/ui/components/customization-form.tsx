// NOTE: This class needs checking agianst completed code
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Textarea } from "@workspace/ui/components/textarea";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { VapiFormFields } from "./vapi-form-fields";
import { FormSchema } from "../../types";
import { widgetSettingsSchema } from "../../schemas";

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
            greetMessage: initialData?.greetMessage || "Hi, how can I help you today?",
            defaultSuggestions: {
                suggestion1: initialData?.defaultSuggestions?.suggestion1 || "",
                suggestion2: initialData?.defaultSuggestions?.suggestion2 || "",
                suggestion3: initialData?.defaultSuggestions?.suggestion3 || "",
            },
            vapiSettings: {
                assistantId: initialData?.vapiSettings?.assistantId || "",
                phoneNumber: initialData?.vapiSettings?.phoneNumber || "",
            },
        },
    })
    

    const onSubmit = async (values: FormSchema) => {
        try {
            const vapiSettings: WidgetSettings["vapiSettings"] = {
                assistantId: values.vapiSettings.assistantId === "none" ? "" : values.vapiSettings.assistantId,
                phoneNumber: values.vapiSettings.phoneNumber === "none" ? "" : values.vapiSettings.phoneNumber,
            }

            await upsertWidgetSettings({
                greetMessage: values.greetMessage,
                defaultSuggestions: values.defaultSuggestions,
                vapiSettings,
            })

            toast.success("Widget settings saved");
        } catch {
            console.error("Error updating widget settings");
            toast.error("Something went wrong");
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            General Chat Settings
                        </CardTitle>
                        <CardDescription>
                            Configure basic chat widget behaviour and messages
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="greetMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Greeting Message</FormLabel>
                                    <FormControl>
                                        <textarea {...field} placeholder="Welcome message shown when chat opens" rows={3}/>
                                    </FormControl>
                                    <FormDescription>
                                        The first message customers see when they open the chat widget.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Separator />

                        <div className="space-y-4">
                            <div>
                                <h3 className="mb-4 text-sm">Default Suggestions</h3>
                                <p className="mb-4 text-muted-foreground text-sm">
                                    Quick reply suggestions shown to customers to help guide the conversation
                                </p>
                                
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="defaultSuggestions.suggestion1"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Suggestion 1</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g., how do I get started?" />
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
                                                    <Input {...field} placeholder="What are your pricing plans?" />
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
                                                    <Input {...field} placeholder="I need help with my account" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        
                    </CardContent>
                </Card>

                {hasVapiPlugin && (
                  <Card>
                    <CardHeader>
                        <CardTitle>
                            Voice Assistant Settings
                        </CardTitle>
                        <CardDescription>
                            Configure voice calling features powered by VAPI
                        </CardDescription>
                    </CardHeader>
                     <CardContent className="space-y-6">
                        <VapiFormFields 
                            form={form}
                        />
                     </CardContent>
                  </Card>
                )}

                <div className="flex justify-end">
                    <Button disabled={form.formState.isSubmitting} type="submit">
                        Save Settings
                    </Button>
                </div>
            </form>
        </Form>
    )    
}
