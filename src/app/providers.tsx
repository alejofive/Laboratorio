'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { LabProvider } from "@/context/LabContext";
import { Toaster } from "sileo";
import { Toaster as HotToaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LabProvider>
        <Toaster />
        <HotToaster position="bottom-center" />
        {children}
      </LabProvider>
    </QueryClientProvider>
  );
}
