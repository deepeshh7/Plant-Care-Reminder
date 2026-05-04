"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordSchema, confirmResetSchema, type ResetPasswordInput, type ConfirmResetInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

function ResetPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const requestForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const confirmForm = useForm<ConfirmResetInput>({
    resolver: zodResolver(confirmResetSchema),
    defaultValues: {
      token: token || "",
    },
  });

  useEffect(() => {
    if (token) {
      confirmForm.setValue("token", token);
    }
  }, [token, confirmForm]);

  const onRequestSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success("Reset link sent! Check your email.");
      } else {
        toast.error("Failed to send reset link");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirmSubmit = async (data: ConfirmResetInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/confirm-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setResetSuccess(true);
        toast.success("Password reset successful!");
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        toast.error(result.error || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message after password reset
  if (resetSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Password Reset Successful</CardTitle>
            <CardDescription>
              Your password has been reset. Redirecting to sign in...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/signin">
              <Button className="w-full">Go to Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show confirmation form if token is present
  if (token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Set New Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={confirmForm.handleSubmit(onConfirmSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  {...confirmForm.register("password")}
                  disabled={isLoading}
                />
                {confirmForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {confirmForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <Link href="/signin" className="text-blue-600 hover:underline">
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show email request form if submitted
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              If an account exists with that email, we&apos;ve sent a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/signin">
              <Button className="w-full">Back to Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show email request form by default
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your email to receive a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...requestForm.register("email")}
                disabled={isLoading}
              />
              {requestForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {requestForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link href="/signin" className="text-blue-600 hover:underline">
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
