"use client"

import { useAtomValue } from "jotai";
import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";
import { WidgetAuthScreen } from "@/modules/widget/ui/screens/widget-auth-screen";
import { WidgetErrorScreen } from "@/modules/widget/ui/screens/widget-error-screen";
import { WidgetSelectionScreen } from "@/modules/widget/ui/screens/widget-selection-screen";
import { WidgetChatScreen } from "@/modules/widget/ui/screens/widget-chat-screen";
import { WidgetLoadingScreen } from "@/modules/widget/ui/screens/widget-loading-screen";
import { WidgetInboxScreen } from "@/modules/widget/ui/screens/widget-inbox-screen";
import { WidgetVoiceScreen } from "@/modules/widget/ui/screens/widget-voice-screen";
import { screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { WidgetContactScreen } from "../screens/widget-contact-screen";
import { WidgetColorProvider } from "../components/widget-color-provider"; // ADD THIS

interface Props {
    organizationId: string | null;
}

export const WidgetView = ({ organizationId }: Props) => {
    const screen = useAtomValue(screenAtom);

    const screenComponents = {
        error: <WidgetErrorScreen />,
        loading: <WidgetLoadingScreen organizationId={organizationId} />,
        auth: <WidgetAuthScreen />,
        voice: <WidgetVoiceScreen />,
        inbox: <WidgetInboxScreen />,
        selection: <WidgetSelectionScreen />,
        chat: <WidgetChatScreen />,
        contact: <WidgetContactScreen />,
    }
    
    return (
        <WidgetColorProvider> {/* WRAP EVERYTHING */}
            <main className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
                {screenComponents[screen]}
            </main>
        </WidgetColorProvider>
    )   
}