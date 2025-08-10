"use client";
import { Bell, UserCircle, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { logout } from "@/lib/redux/features/auth/authSlice";
import Link from "next/link";
import Image from "next/image"; // Make sure Image is imported

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const getDisplayName = () => {
    if (!userInfo) return "Admin";
    return userInfo.fullName || userInfo.email?.split("@")[0] || "Admin";
  };

  return (
    <header className="bg-white text-gray-800 shadow-sm sticky top-0 z-20 flex-shrink-0">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden text-gray-600 hover:text-gray-800"
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold hidden sm:block">
              Admin Activity
            </h1>
          </div>

          <div className="flex items-center gap-x-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-x-2 p-1 rounded-lg hover:bg-gray-100">
                  <span className="hidden sm:block text-sm font-semibold capitalize">
                    {getDisplayName()}
                  </span>

                  {/* --- THIS IS THE CORRECTED BLOCK --- */}
                  {userInfo?.profileImageUrl ? (
                    <>
                      <Image
                        src={userInfo.profileImageUrl}
                        alt="Admin"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    </>
                  ) : (
                    <UserCircle size={32} className="text-gray-500" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={handleLogout}
                  className="text-red-500 focus:text-red-600 cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
