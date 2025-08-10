"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/redux/store";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // Get user info and the loading status from Redux
  const { userInfo, status } = useSelector((state: RootState) => state.auth);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // This effect runs when the component mounts or when auth status changes
    if (status !== "loading") {
      // If user is not logged in OR is not an admin, redirect to login
      if (!userInfo || !userInfo.isAdmin) {
        router.push("/login");
      } else {
        // If user is an authenticated admin, stop checking
        setIsCheckingAuth(false);
      }
    }
  }, [userInfo, status, router]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // While checking authentication, show a full-screen loader
  if (isCheckingAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // Once authentication is confirmed, render the admin dashboard
  return (
    <div className="h-screen w-full flex bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar (Static) */}
      <div className="hidden lg:block flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar (Animated Drawer) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-30"
              onClick={closeSidebar}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 h-full z-40"
            >
              <AdminSidebar onLinkClick={closeSidebar} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <AdminHeader onMenuClick={toggleSidebar} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
