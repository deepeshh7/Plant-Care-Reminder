"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Welcome back, {session?.user?.name || "Plant Lover"}! 🌿
        </h1>
        <p className="text-muted-foreground mt-2">
          Your plant care dashboard is ready. Start managing your plants!
        </p>
      </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/plants')}>
              <CardHeader>
                <CardTitle>My Plants</CardTitle>
                <CardDescription>Manage your plant collection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🪴</div>
                  <p className="text-muted-foreground mb-4">
                    No plants yet
                  </p>
                  <Button 
                    className="bg-[#4A7C2C] hover:bg-[#2D5016] text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/plants/new');
                    }}
                  >
                    Add Your First Plant
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/tasks')}>
              <CardHeader>
                <CardTitle>Care Schedule</CardTitle>
                <CardDescription>Upcoming care tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-muted-foreground">
                    No scheduled tasks
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/tasks/history')}>
              <CardHeader>
                <CardTitle>Care History</CardTitle>
                <CardDescription>Track your plant care</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-muted-foreground">
                    No history yet
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-[#4A7C2C]/10 to-[#7FD99A]/10 border-[#7FD99A]/30">
            <CardHeader>
              <CardTitle>🎉 Getting Started</CardTitle>
              <CardDescription>
                Follow these steps to make the most of PlantCare
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#4A7C2C] text-white rounded-full flex items-center justify-center text-sm">
                    1
                  </span>
                  <span>Add your first plant with a photo and details</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#4A7C2C] text-white rounded-full flex items-center justify-center text-sm">
                    2
                  </span>
                  <span>Set up watering and fertilizing schedules</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#4A7C2C] text-white rounded-full flex items-center justify-center text-sm">
                    3
                  </span>
                  <span>Enable notifications to never miss a care task</span>
                </li>
              </ul>
            </CardContent>
          </Card>
    </div>
  );
}
