"use client";

import { useOrganization } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { IntegrationId, INTEGRATIONS } from "../../constants";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useState } from "react";
import { createScript } from "../../utils";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { MobileAwareLayout } from "@/modules/dashboard/ui/layouts/mobile-aware-layout";

export const IntegrationsView = () => {
  const isMobile = useIsMobile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState("");
  const { organization } = useOrganization();

  const handleIntegrationClick = (integrationId: IntegrationId) => {
    if (!organization) {
      toast.error("Organization ID not found");
      return;
    }

    const snippet = createScript(integrationId, organization.id);
    setSelectedSnippet(snippet);
    setDialogOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(organization?.id ?? "");
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const content = (
    <>
      <IntegrationsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        snippet={selectedSnippet}
      />
      <div className={`flex min-h-screen flex-col bg-muted ${isMobile ? 'p-4' : 'p-8'}`}>
        <div className="mx-auto w-full max-w-screen-md">
          <div className="space-y-2">
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-4xl'}`}>
              Setup & Integrations
            </h1>
            <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
              Choose the integration that&apos;s right for you
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-4`}>
              <Label className={`${isMobile ? 'text-sm' : 'w-34'}`} htmlFor="organization-id">
                Organization ID
              </Label>
              <Input 
                disabled
                id="organization-id"
                readOnly
                value={organization?.id ?? ""}
                className={`${isMobile ? 'w-full' : 'flex-1'} bg-background font-mono text-sm`}
              />
              <Button
                className="gap-2"
                onClick={handleCopy}
                size={isMobile ? "sm" : "sm"}
              >
                <CopyIcon className="size-4" />
                Copy
              </Button>
            </div>
          </div>

          <Separator className="my-8" />
          <div className="space-y-6">
            <div className="space-y-1">
              <Label className={`${isMobile ? 'text-base' : 'text-lg'}`}>Integrations</Label>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Add the following code to your website to enable the chatbox.
              </p>
            </div>
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
              {INTEGRATIONS.map((integration) => (
                <button
                  key={integration.id}
                  onClick={() => handleIntegrationClick(integration.id)}
                  type="button"
                  className={`flex items-center gap-4 rounded-lg border bg-background ${isMobile ? 'p-3' : 'p-4'} hover:bg-accent`}
                >
                  <Image
                    alt={integration.title}
                    height={isMobile ? 24 : 32}
                    src={integration.icon}
                    width={isMobile ? 24 : 32}
                  />
                  <p className={isMobile ? 'text-sm' : ''}>{integration.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <MobileAwareLayout title="Integrations">
      {content}
    </MobileAwareLayout>
  );
};

export const IntegrationsDialog = ({
  open,
  onOpenChange,
  snippet,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  snippet: string;
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Integrate with your website</DialogTitle>
          <DialogDescription>
            Follow these steps to add the chatbox to your website
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="rounded-md bg-accent p-2 text-sm">
              1. Copy the following code
            </div>
            <div className="group relative">
              <pre className="max-h-[300px] overflow-x-auto overflow-y-auto whitespace-pre-wrap break-all rounded-md bg-foreground p-2 font-mono text-secondary text-sm">
                {snippet}
              </pre>
              <Button
                className="absolute top-4 right-6 size-6 opacity-100 md:opacity-0 transition-opacity md:group-hover:opacity-100"
                onClick={handleCopy}
                size="icon"
                variant="secondary"
              >
                <CopyIcon className="size-3" />
            </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="rounded-md bg-accent p-2 text-sm">
              2. Add the code in your page
            </div>
            <p className="text-muted-foreground text-sm">
              Paste the chatbox code above in your page. You can add it in the HTML head section.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};