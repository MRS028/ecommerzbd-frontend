import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Shield,
  LayoutDashboard,
  LogOut,
  Package,
  UserCircle2,
} from "lucide-react";
import { ThemeToggle } from "../common/ThemeToggle";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/shared/components/ui/dropdown-menu";
import { useCartStore } from "@/modules/cart/store/cart.store";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { ROUTES, APP_NAME } from "@/shared/lib/constants";
import { cn } from "@/shared/lib/utils";

const ADMIN_ROLES = ["admin", "ADMIN", "SUPER_ADMIN"];

export function Header() {
  const navigate = useNavigate();
  const count = useCartStore((s) => s.count());
  const { isAuthenticated, user, logout } = useAuthStore();

  const isAdmin = !!user && ADMIN_ROLES.includes(user.role);

  const displayName =
    user?.name ||
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    user?.email?.split("@")[0] ||
    "Account";

  const initials = (
    user?.firstName?.[0] ||
    user?.name?.[0] ||
    user?.email?.[0] ||
    "U"
  ).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "text-sm font-medium transition-colors hover:text-primary",
      isActive ? "text-primary" : "text-muted-foreground",
    );

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={ROUTES.HOME} className="text-xl font-bold text-primary">
          {APP_NAME}
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to={ROUTES.HOME} className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to={ROUTES.PRODUCTS} className={navLinkClass}>
            Products
          </NavLink>
          {isAuthenticated && (
            <NavLink to={ROUTES.ORDERS} className={navLinkClass}>
              Orders
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              <span className="inline-flex items-center gap-1">
                <Shield className="h-3 w-3" /> Admin
              </span>
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Link to={ROUTES.CART}>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              {/* ✅ Base UI: render prop replaces asChild */}
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm" className="gap-2">
                    <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                      {initials}
                    </span>
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {displayName.split(" ")[0]}
                    </span>
                  </Button>
                }
              />

              <DropdownMenuContent align="end" className="w-56">
                {/* ✅ Label must be inside Group */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium truncate">
                      {displayName}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground truncate">
                      {user?.email}
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserCircle2 className="h-4 w-4 mr-2" />
                  My Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate(ROUTES.ORDERS)}>
                  <Package className="h-4 w-4 mr-2" />
                  My Orders
                </DropdownMenuItem>

                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/admin/users")}>
                      <User className="h-4 w-4 mr-2" />
                      Manage Users
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={ROUTES.LOGIN}>
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}