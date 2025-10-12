import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  Users,
  Menu,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/contexts/sidebar-context";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { SettingsDropdown } from "./settings-dropdown";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar for Desktop */}
      <div
        className={cn(
          "hidden border-r bg-muted/40 md:block transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="#" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span
                className={cn(
                  "transition-all",
                  isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                )}
              >
                Acme Inc
              </span>
            </a>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
              <Link
                to="/"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  location.pathname === "/"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
              >
                <Home className="h-4 w-4" />
                <span
                  className={cn(
                    "transition-all",
                    isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                  )}
                >
                  Dashboard
                </span>
              </Link>
              <Link
                to="/orders"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  location.pathname === "/orders"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
              >
                <ShoppingCart className="h-4 w-4" />
                <span
                  className={cn(
                    "transition-all",
                    isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                  )}
                >
                  Orders
                </span>
                <span
                  className={cn(
                    "ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[0.625rem] font-medium text-primary-foreground transition-all",
                    isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                  )}
                >
                  6
                </span>
              </Link>
              <Link
                to="/products"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  location.pathname === "/products"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
              >
                <Package className="h-4 w-4" />
                <span
                  className={cn(
                    "transition-all",
                    isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                  )}
                >
                  Products
                </span>
              </Link>
              <Link
                to="/customers"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  location.pathname === "/customers"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
              >
                <Users className="h-4 w-4" />
                <span
                  className={cn(
                    "transition-all",
                    isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                  )}
                >
                  Customers
                </span>
              </Link>
              <Link
                to="/analytics"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  location.pathname === "/analytics"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
              >
                <LineChart className="h-4 w-4" />
                <span
                  className={cn(
                    "transition-all",
                    isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                  )}
                >
                  Analytics
                </span>
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="@user" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "flex-1 min-w-0 transition-all",
                  isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                )}
              >
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">
                  admin@acme.com
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "flex-shrink-0",
                  isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                )}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col w-full flex-1">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <a
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span>Acme Inc</span>
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </a>
              </nav>
              <div className="mt-auto">
                <Separator className="my-4" />
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@user" />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">John Doe</p>
                    <p className="text-xs text-muted-foreground truncate">
                      admin@acme.com
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <SettingsDropdown />
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
              </div>
            </form>

            {/* Add Settings Dialog Here */}
            <SettingsDropdown />

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>New order received</DropdownMenuItem>
                <DropdownMenuItem>Sales report ready</DropdownMenuItem>
                <DropdownMenuItem>System updated</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@user" />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
