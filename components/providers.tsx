"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // Data is immediately stale - always fresh
            gcTime: 5 * 60 * 1000, // 5 minutes cache time
            refetchOnWindowFocus: true, // Refetch when window regains focus
            refetchOnMount: true, // Always refetch on mount
            refetchOnReconnect: true, // Refetch on reconnect
            retry: 1,
          },
          mutations: {
            retry: 1,
            onError: (error) => {
              console.error('Mutation error:', error);
            },
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </SessionProvider>
  );
}
