"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAction } from "convex/react";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { MailIcon, SendIcon } from "lucide-react";

import { api } from "@workspace/backend/_generated/api";
import { Doc } from "@workspace/backend/_generated/dataModel";

const sendEmailSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200, "Subject too long"),
  message: z.string().min(1, "Message is required").max(5000, "Message too long"),
});

type SendEmailFormData = z.infer<typeof sendEmailSchema>;

interface SendEmailDialogProps {
  conversation: Doc<"conversations">;
  contactSession: Doc<"contactSessions">;
  children?: React.ReactNode;
}

export const SendEmailDialog = ({ 
  conversation, 
  contactSession, 
  children 
}: SendEmailDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userId, orgId } = useAuth();
  const { user } = useUser();
  
  const sendCustomerEmail = useAction(api.emails.sendCustomerEmail);

  const form = useForm<SendEmailFormData>({
    resolver: zodResolver(sendEmailSchema),
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      form.reset({
        subject: `Re: Your support inquiry`,
        message: `Hello ${contactSession.name || 'there'},

Thank you for reaching out to us.

Best regards,
Support Team`,
      });
    }
    setOpen(isOpen);
  };

  const onSubmit = async (data: SendEmailFormData) => {
    if (!userId || !orgId) {
      toast.error("Authentication required");
      return;
    }

    if (!contactSession.email) {
      toast.error("Customer email not available");
      return;
    }

    setIsLoading(true);
    
    try {
      await sendCustomerEmail({
        conversationId: conversation._id,
        organizationId: orgId,
        customerEmail: contactSession.email,
        customerName: contactSession.name || contactSession.email,
        subject: data.subject,
        message: data.message,
        senderUserId: userId,
      });

      toast.success("Email sent successfully!");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full" size="lg">
            <MailIcon />
            <span>Send Email</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Email to Customer</DialogTitle>
          <DialogDescription>
            Send a direct email to {contactSession.name || contactSession.email}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                <strong>To:</strong> {contactSession.email}
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>From:</strong> {(() => {
                  const userEmail = user?.primaryEmailAddress?.emailAddress;
                  if (!userEmail) return "Your organization email";
                  
                  // Check if it's an unverified domain
                  const unverifiedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
                  const emailParts = userEmail.split('@');
                  const domain = emailParts[1];
                  
                  if (domain && unverifiedDomains.includes(domain)) {
                    const username = emailParts[0];
                    return `${username}@resend.dev (verified domain)`;
                  }
                  
                  return userEmail;
                })()}
              </div>
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email subject"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your message"
                      className="min-h-[200px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <SendIcon className="w-4 h-4 mr-2" />
                {isLoading ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 