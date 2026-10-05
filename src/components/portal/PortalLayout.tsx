import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, CalendarPlus, ChevronDown, FileClock, LayoutDashboard, LogOut, Menu, User } from "lucide-react";

import { Logo } from "./Logo";
import { employee } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/apply-leave", label: "Apply Leave", icon: CalendarPlus },
  { to: "/my-requests", label: "My Requests", icon: FileClock },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function Avatar({
  className,
  photo,
  initials,
}: {
  className?: string;
  photo?: string | undefined;
  initials?: string;
}) {
  return (
    <span
      className={cn(
        "bg-gradient-brand grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full text-sm font-semibold text-white",
        className,
      )}
    >
      {photo ? (
        <img src={photo} alt="" className="h-full w-full object-cover" />
      ) : (
        initials || employee.initials
      )}
    </span>
  );
}

function getStoredEmployee() {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem("cornixe_employee");
    return stored
      ? (JSON.parse(stored) as {
          name?: string;
          email?: string;
          profilePhoto?: string;
        })
      : null;
  } catch {
    return null;
  }
}

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
            {active ? <span className="bg-gradient-brand ml-auto h-1.5 w-1.5 rounded-full" /> : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function PortalLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [storedEmployee, setStoredEmployee] = useState<ReturnType<typeof getStoredEmployee>>(null);
  const displayName = storedEmployee?.name || employee.name;
  const displayEmail = storedEmployee?.email || employee.email;
  const displayInitials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    const refreshEmployee = () => setStoredEmployee(getStoredEmployee());
    refreshEmployee();
    window.addEventListener("cornixe-profile-updated", refreshEmployee);
    return () => window.removeEventListener("cornixe-profile-updated", refreshEmployee);
  }, []);

  const sidebarBody = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col gap-6 p-4">
      <Logo className="px-2" />
      <NavLinks onNavigate={onNavigate} />
      <div className="mt-auto">
        <button
          onClick={() => {
            onNavigate?.();
            setLogoutOpen(true);
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-surface flex min-h-screen w-full">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:block">
        <div className="sticky top-0 h-screen">{sidebarBody()}</div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  {sidebarBody(() => setMobileOpen(false))}
                </SheetContent>
              </Sheet>
              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">{title}</h1>
                {description ? (
                  <p className="hidden truncate text-sm text-muted-foreground sm:block">{description}</p>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell />
                <span className="bg-brand-coral absolute top-2 right-2 h-2 w-2 rounded-full" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-secondary">
                    <Avatar photo={storedEmployee?.profilePhoto} initials={displayInitials} />
                    <span className="hidden text-sm font-medium sm:block">{displayName}</span>
                    <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs font-normal text-muted-foreground">{displayEmail}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate({ to: "/profile" })}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate({ to: "/my-requests" })}>
                    <FileClock className="mr-2 h-4 w-4" /> My Requests
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setLogoutOpen(true)}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of the portal?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again with your Cornixe work email to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay signed in</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate({ to: "/" })}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
