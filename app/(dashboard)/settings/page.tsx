"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  preferredTime: string;
  dailyDigest: boolean;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  
  // Weather settings
  const [city, setCity] = useState("");
  const [weatherEnabled, setWeatherEnabled] = useState(false);
  
  // Notification settings
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    pushEnabled: false,
    emailEnabled: true,
    preferredTime: "09:00",
    dailyDigest: false,
  });
  const [pushPermission, setPushPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    fetchSettings();
    checkPushPermission();
  }, []);

  const checkPushPermission = () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushPermission(Notification.permission);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/user/settings");
      if (response.ok) {
        const data = await response.json();
        setCity(data.city || "");
        setWeatherEnabled(data.weatherEnabled || false);
        
        const prefs = data.notificationPreferences || {};
        setPreferences({
          emailEnabled: prefs.emailEnabled !== false,
          pushEnabled: prefs.pushEnabled || false,
          preferredTime: prefs.preferredTime || "09:00",
          dailyDigest: prefs.dailyDigest || false,
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPushPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Not supported",
        description: "Push notifications are not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      
      if (permission === "granted") {
        setPreferences({ ...preferences, pushEnabled: true });
        toast({
          title: "Permission granted",
          description: "You will now receive push notifications.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request notification permission.",
        variant: "destructive",
      });
    }
  };

  const handleSendTestEmail = async () => {
    setTestEmailLoading(true);
    try {
      const response = await fetch("/api/notifications/test-email", {
        method: "POST",
      });

      if (response.ok) {
        toast({
          title: "Test email sent",
          description: "Check your inbox for the test email.",
        });
      } else {
        throw new Error("Failed to send test email");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTestEmailLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          city, 
          weatherEnabled,
          notificationPreferences: preferences,
        }),
      });

      if (response.ok) {
        toast({
          title: "Settings saved",
          description: "Your preferences have been updated.",
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and preferences
        </p>
      </div>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Configure how you want to receive care reminders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive care reminders via email
                </p>
              </div>
              <Switch
                id="email"
                checked={preferences.emailEnabled}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, emailEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive instant notifications in your browser
                  {pushPermission === 'denied' && ' (Permission denied)'}
                  {pushPermission === 'default' && ' (Permission required)'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {pushPermission !== "granted" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRequestPushPermission}
                  >
                    Enable
                  </Button>
                )}
                <Switch
                  id="push"
                  checked={preferences.pushEnabled && pushPermission === "granted"}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, pushEnabled: checked })
                  }
                  disabled={pushPermission !== "granted"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Preferred Notification Time</Label>
              <Input
                id="time"
                type="time"
                value={preferences.preferredTime}
                onChange={(e) =>
                  setPreferences({ ...preferences, preferredTime: e.target.value })
                }
              />
              <p className="text-sm text-muted-foreground">
                Time of day you prefer to receive reminders
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="digest">Daily Digest</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a single daily summary instead of individual reminders
                </p>
              </div>
              <Switch
                id="digest"
                checked={preferences.dailyDigest}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, dailyDigest: checked })
                }
              />
            </div>

            {preferences.emailEnabled && (
              <Button
                variant="outline"
                onClick={handleSendTestEmail}
                disabled={testEmailLoading}
                className="w-full"
              >
                {testEmailLoading ? "Sending..." : "Send Test Email"}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weather-Based Watering</CardTitle>
            <CardDescription>
              Automatically adjust watering reminders based on local weather conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Weather Adjustments</Label>
                <p className="text-sm text-muted-foreground">
                  Skip watering when it rains or adjust based on temperature and humidity
                </p>
              </div>
              <Switch
                checked={weatherEnabled}
                onCheckedChange={setWeatherEnabled}
              />
            </div>

            {weatherEnabled && (
              <div className="space-y-2">
                <Label htmlFor="city">Your City</Label>
                <Input
                  id="city"
                  placeholder="e.g., London, New York, Tokyo"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Enter your city name to get accurate weather data
                </p>
              </div>
            )}

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-medium">How it works:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Skips watering if it rained recently ({">"} 5mm)</li>
                <li>• Reduces watering in high humidity and cool weather</li>
                <li>• Suggests extra watering in hot, dry conditions</li>
                <li>• Only affects watering tasks, not fertilizing</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              • Push notifications require browser permission and work when the app is open
            </p>
            <p>
              • Email notifications are sent to your registered email address
            </p>
            <p>
              • Daily digest sends a summary of all tasks due that day
            </p>
            <p>
              • Notifications are sent based on your care schedule times
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
            </div>
            <div>
              <Label>Name</Label>
              <p className="text-sm text-muted-foreground">{session?.user?.name || "Not set"}</p>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? "Saving..." : "Save All Settings"}
        </Button>
    </div>
  );
}
