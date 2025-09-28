import { Button } from "@workspace/ui/components/button";
import { ArrowLeftIcon, MicIcon, MicOffIcon, PhoneIcon } from "lucide-react";
import { useSetAtom } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { useVapi } from "../../hooks/use-vapi";
import { cn } from "@workspace/ui/lib/utils";
import { AIConversation, AIConversationContent, AIConversationScrollButton } from "@workspace/ui/components/ai/conversation";
import { 
  StyledAIMessage as AIMessage, 
  StyledAIMessageContent as AIMessageContent 
} from "../components/styled-ai-components";
import { AIResponse } from "@workspace/ui/components/ai/response";

export const WidgetVoiceScreen = () => {
  const setScreen = useSetAtom(screenAtom)
  const {
    isSpeaking,
    isConnected,
    transcript,
    startCall,
    endCall,
    isConnecting,
  } = useVapi();

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2">
          <Button
            variant="transparent"
            size="icon"
            onClick={() => setScreen("selection")}
          >
            <ArrowLeftIcon />
          </Button>
          <p>Voice Chat</p>
        </div>
      </WidgetHeader>

      {transcript.length > 0 ? (
        <AIConversation className="h-full">
          <AIConversationContent>
            {transcript.map((message, index) => (
              <AIMessage
                from={message.role}
                key={`${message.role}-${index}-${message.text}`}
              >
                <AIMessageContent from={message.role}>
                  {message.text}
                </AIMessageContent>
              </AIMessage>
            ))}
          </AIConversationContent>
          <AIConversationScrollButton />
        </AIConversation>
      ) : (
        <div className="flex flex-1 h-full flex-col items-center justify-center gap-y-4">
          <div className="flex items-center justify-center rounded-full border bg-white p-3">
            <MicIcon className="size-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Transcript will appear here</p>
        </div>
      )}
      
      <div className="border-t bg-background p-4">
        <div className="flex flex-col items-center gap-y-4">
          {isConnected && (
            <div className="flex items-center gap-x-2">
              <div className={cn("size-4 rounded-full", isSpeaking ? "animate-pulse bg-red-500" : "bg-green-500")} />
              <span className="text-muted-foreground text-sm">
                {isSpeaking ? "Assistant Speaking..." : "Listening..."}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-x-2 p-4">
        {!isConnected ? (
          <Button
            className="w-full"
            onClick={() => startCall()}
            size="lg"
            disabled={isConnecting}
          >
            <MicIcon />
            Start Voice Chat
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => endCall()}
            size="lg"
            variant="destructive"
            disabled={isConnecting}
          >
            <MicOffIcon />
            End Call
          </Button>
        )}
      </div>
    </>
  )
}