"use client";

import {
  Bell,
  UserCircle,
  Home,
  LogOut,
  Settings,
  User,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

// Redux Imports
import { RootState, AppDispatch } from "@/lib/redux/store";
import { logout } from "@/lib/redux/features/auth/authSlice"; // Import the logout action

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Get user info from Redux to display the name and control UI
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // Handler function for the logout action
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login"); // Redirect to login page after logout
  };

  // --- Breadcrumb logic (no changes needed here) ---
  const pathSegments = pathname.split("/").filter((p) => p);
  const breadcrumbs = pathSegments.slice(pathSegments.indexOf("dashboard") + 1);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10 flex-shrink-0">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Hamburger Menu (Mobile) + Breadcrumbs */}
          <div className="flex items-center gap-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden text-gray-600 hover:text-gray-800"
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
            {/* Breadcrumbs UI */}
            <div className="hidden sm:flex items-center text-sm text-gray-500">
              {/* Your existing breadcrumbs logic goes here... */}
            </div>
          </div>

          {/* Right side: User profile and notifications */}
          <div className="flex items-center gap-x-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-x-2 p-1 rounded-lg hover:bg-gray-100">
                  <UserCircle size={32} className="text-gray-500" />
                  <div className="hidden sm:block text-left">
                    {/* --- DYNAMIC USER NAME --- */}
                    <p className="font-semibold text-sm text-gray-800">
                      {userInfo?.fullName || userInfo?.email || "User"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User size={14} className="mr-2" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/account"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Settings size={14} className="mr-2" />
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* --- LOGOUT BUTTON CONNECTION --- */}
                <DropdownMenuItem
                  onClick={handleLogout} // <-- Attach the handler here
                  className="text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer flex items-center gap-2"
                >
                  <LogOut size={14} className="mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
