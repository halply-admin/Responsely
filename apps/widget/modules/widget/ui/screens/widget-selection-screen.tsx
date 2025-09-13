"use client";

import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronRightIcon, MessageSquareTextIcon, MicIcon, PhoneIcon } from "lucide-react";
import { 
  contactSessionIdAtomFamily, 
  conversationIdAtom, 
  errorMessageAtom, 
  hasVapiSecretsAtom, 
  organizationIdAtom, 
  screenAtom, 
  widgetSettingsAtom 
} from "../../atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";
import { WidgetFooter } from "../components/widget-footer";

export const WidgetSelectionScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  // Get primary color from widget settings
  const primaryColor = widgetSettings?.appearance?.primaryColor || "#3b82f6";
  const greetMessage = widgetSettings?.greetMessage || "Hi! How can I help you today?";

  const createConversation = useMutation(api.public.conversations.create);
  const [isPending, setIsPending] = useState(false);

  const handleNewConversation = async () => {
    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Missing Organization ID");
      return;
    }
    
    if (!contactSessionId) {
      setScreen("auth");
      return;
    }
    
    setIsPending(true);
    try {
      const conversationId = await createConversation({
        contactSessionId,
        organizationId,
      });

      setConversationId(conversationId);
      setScreen("chat");
    } catch {
      setScreen("auth");
    } finally {
      setIsPending(false);
    }
  };

  // Convert suggestions object to array, filtering out empty values
  const suggestions = widgetSettings?.defaultSuggestions ? 
    Object.values(widgetSettings.defaultSuggestions).filter(Boolean) : [];

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there! 👋</p>
          <p className="text-lg opacity-90">{greetMessage}</p>
          
          {/* Quick Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm opacity-75">Quick suggestions:</p>
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left text-white border-white/20 hover:bg-white/10"
                  onClick={() => {
                    // Store suggestion and start conversation
                    handleNewConversation();
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </div>
      </WidgetHeader>

      <div className="flex-1 p-6">
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="font-semibold text-lg mb-2">How can we help you?</h3>
            <p className="text-muted-foreground text-sm">Choose your preferred way to get support</p>
          </div>

          {/* START CHAT BUTTON - FIXED with primary color */}
          <Button
            variant="default"
            className="w-full justify-start gap-3 h-16"
            onClick={handleNewConversation}
            disabled={isPending}
            style={{
              backgroundColor: primaryColor,
              borderColor: primaryColor,
              color: "white"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <MessageSquareTextIcon className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium">Start Live Chat</div>
              <div className="text-xs opacity-75">Get instant help from our AI assistant</div>
            </div>
            <ChevronRightIcon className="w-5 h-5" />
          </Button>

          {/* VOICE CALL BUTTON - with primary color styling */}
          {hasVapiSecrets && (
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-16"
              onClick={() => setScreen("voice")}
              style={{
                borderColor: primaryColor + '40',
                color: primaryColor
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor + '10';
                e.currentTarget.style.borderColor = primaryColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = primaryColor + '40';
              }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <PhoneIcon className="w-5 h-5" />
              </div>
              <div className="text-left flex-1">
                <div className="font-medium">Voice Call</div>
                <div className="text-xs text-muted-foreground">Talk directly to our AI assistant</div>
              </div>
              <ChevronRightIcon className="w-5 h-5" />
            </Button>
          )}

          {/* LEAVE MESSAGE BUTTON - with primary color styling */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-16"
            onClick={() => setScreen("contact")}
            style={{
              borderColor: primaryColor + '40',
              color: primaryColor
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor + '10';
              e.currentTarget.style.borderColor = primaryColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = primaryColor + '40';
            }}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <MicIcon className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium">Leave a Message</div>
              <div className="text-xs text-muted-foreground">Send us a message and we'll get back to you</div>
            </div>
            <ChevronRightIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <WidgetFooter />
    </>
  );
};