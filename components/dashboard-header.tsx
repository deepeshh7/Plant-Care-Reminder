"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardHeader() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#4A7C2C] to-[#7FD99A] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🌱</span>
          </div>
          <span className="font-bold text-lg">PlantCare</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {session?.user?.email}
          </span>
          <ThemeToggle />
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
