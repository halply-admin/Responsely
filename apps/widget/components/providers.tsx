"use client"

import * as React from "react"
import { Provider } from "jotai";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Toaster } from "@workspace/ui/components/sonner";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <Provider>
        {children}
        <Toaster />
      </Provider>
    </ConvexProvider>
  );
};
