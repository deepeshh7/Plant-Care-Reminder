"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { Leaf, Menu } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (status === "loading") {
    return null;
  }

  if (!session) {
    redirect("/signin");
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/plants", label: "Plants" },
    { href: "/schedules", label: "Schedules" },
    { href: "/tasks", label: "Tasks" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <header className="border-b sticky top-0 bg-background z-50" role="banner">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 font-bold text-lg md:text-xl"
            aria-label="Plant Care - Go to dashboard"
          >
            <Leaf className="h-5 w-5 md:h-6 md:w-6 text-green-600" aria-hidden="true" />
            <span className="hidden sm:inline">Plant Care</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-2 py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span 
              className="text-xs md:text-sm text-muted-foreground hidden lg:inline truncate max-w-[150px]"
              aria-label={`Signed in as ${session.user?.email}`}
            >
              {session.user?.email}
            </span>
            <ThemeToggle />
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="outline"
              size="sm"
              className="hidden md:inline-flex"
              aria-label="Sign out of your account"
            >
              Sign Out
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                  <Menu className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]" aria-label="Mobile navigation">
                <div className="flex flex-col gap-6 mt-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Signed in as</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <nav className="flex flex-col gap-3" aria-label="Mobile navigation menu">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-base hover:text-primary transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    variant="outline"
                    className="w-full"
                    aria-label="Sign out of your account"
                  >
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main 
        id="main-content" 
        className="flex-1 container mx-auto px-4 py-6 md:py-8" 
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>
      
      <footer className="border-t py-6 md:py-8 mt-auto" role="contentinfo">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Plant Care App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
