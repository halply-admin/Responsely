"use client";

import { api } from "@workspace/backend/_generated/api";
import { useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { CustomizationForm } from "../components/customization-form";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { MobileAwareLayout } from "@/modules/dashboard/ui/layouts/mobile-aware-layout";

export const CustomizationView = () => {
  const isMobile = useIsMobile();
  const widgetSettings = useQuery(api.private.widgetSettings.getOne); 
  const vapiplugin = useQuery(api.private.plugins.getOne, {
    service: "vapi" 
  });

  const isLoading = widgetSettings === undefined || vapiplugin === undefined;

  if (isLoading) {
    const loadingContent = (
      <div className="min-h-screen flex flex-col items-center justify-center gap-y-2 bg-muted p-8">
        <Loader2Icon className="text-muted-foreground animate-spin" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );

    return isMobile ? (
      <MobileAwareLayout title="Customization">
        {loadingContent}
      </MobileAwareLayout>
    ) : loadingContent;
  }

  const content = (
    <div className={`flex min-h-screen flex-col bg-muted ${isMobile ? 'p-4' : 'p-8'}`}>
      <div className="max-w-screen-md mx-auto w-full">
        <div className="space-y-2">
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-4xl'}`}>
            Widget Customization
          </h1>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
            Customize how your chat widget looks and behaves
          </p>
        </div>

        <div className="mt-8">
          <CustomizationForm 
            initialData={widgetSettings}
            hasVapiPlugin={!!vapiplugin}
          />
        </div>
      </div>
    </div>
  );

  return (
    <MobileAwareLayout title="Customization">
      {content}
    </MobileAwareLayout>
  );
};