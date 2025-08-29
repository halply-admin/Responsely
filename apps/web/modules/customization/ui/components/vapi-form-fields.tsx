import { UseFormReturn } from "react-hook-form";
import { useVapiAssistants, useVapiPhoneNumbers } from "@/modules/plugins/hooks/use-vapi-data";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@workspace/ui/components/select";
import { FormSchema } from "../../types";

interface VapiFormFieldsProps {
    form: UseFormReturn<FormSchema>;
}

export const VapiFormFields = ({ form }: VapiFormFieldsProps) => {
    const { data: assistants, isLoading: assistantsLoading } = useVapiAssistants();
    const { data: phoneNumbers, isLoading: phoneNumbersLoading } = useVapiPhoneNumbers();

    const disabled = form.formState.isSubmitting;

    return (
        <>
        <FormField
            control={form.control}
            name="vapiSettings.assistantId"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Voice Assistant</FormLabel>
                        <Select disabled={assistantsLoading} onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={assistantsLoading ? "Loading assistants..." : "Select an assistant"} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {assistants.map((assistant) =>(
                                    <SelectItem key={assistant.id} value={assistant.id}>
                                        {assistant.name || "Unamed Assistant"} - {" "}
                                        {assistant.model?.model || "Unknown Model"}
                                    </SelectItem> 
            
                                ))}
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            Your vapi assistant to interact with customers via voice calls
                        </FormDescription>
                        <FormMessage />
                </FormItem>
            )}
        />
             <FormField
            control={form.control}
            name="vapiSettings.phoneNumber"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Display Phone Number</FormLabel>
                        <Select disabled={phoneNumbersLoading} onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={phoneNumbersLoading ? "Loading phone numbers..." : "Select a phone number"} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {phoneNumbers.map((phone) =>(
                                    <SelectItem key={phone.id} value={phone.number || phone.id}>
                                        {phone.number || "Unknown"} - {" "}
                                        {phone.name || "Unamed"}
                                    </SelectItem> 
            
                                ))}
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            Your vapi phone number displayed to customers
                        </FormDescription>
                        <FormMessage />
                </FormItem>
            )}
        />
        </>
    )
};