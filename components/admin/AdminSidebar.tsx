"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Award,
  FileSignature,
  Send,
  UserX,
  Briefcase,
  Banknote,
  Gift,
  Receipt,
  Download,
  Building,
  SquarePlus,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { downloadReport } from "@/lib/redux/features/reports/reportSlice";
import { fetchDashboardStats } from "@/lib/redux/features/dashboard/dashboardSlice";
import { cn } from "@/lib/utils";

// --- Type Definitions ---
type SubLink = {
  label: string;
  href?: string;
  type?: "pending" | "active";
  fileName?: string;
};

type SidebarLink = {
  label: string;
  href: string;
  icon: React.ElementType;
  count?: number;
  subLinks?: SubLink[];
};

// --- Reusable Nav Item Component ---
const SidebarNavItem = ({
  link,
  pathname,
  openSubmenu,
  toggleSubmenu,
  handleReportDownload,
  reportStatus,
  downloadingType,
  onLinkClick, // Prop to handle closing the sidebar on mobile
}: {
  link: SidebarLink;
  pathname: string;
  openSubmenu: string | null;
  toggleSubmenu: (label: string) => void;
  handleReportDownload: (type: "pending" | "active", fileName: string) => void;
  reportStatus: string;
  downloadingType: string | null;
  onLinkClick?: () => void; // Optional function
}) => {
  const hasSubLinks = !!link.subLinks;
  const isOpen = openSubmenu === link.label;

  const isActive = hasSubLinks
    ? link.subLinks.some((sub) => sub.href && pathname.startsWith(sub.href))
    : link.href === "/admin"
      ? pathname === link.href
      : pathname.startsWith(link.href);

  return (
    <div>
      <Link
        href={link.href}
        onClick={(e) => {
          if (hasSubLinks) {
            e.preventDefault();
            toggleSubmenu(link.label);
          } else {
            // If it's a regular link, call the close function
            onLinkClick?.();
          }
        }}
        className={cn(
          "group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
          isActive
            ? "bg-slate-700 text-white"
            : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
        )}
      >
        <div className="flex items-center gap-x-3">
          <link.icon className="h-5 w-5" />
          <span>{link.label}</span>
        </div>

        <div className="flex items-center gap-x-3">
          {link.count !== undefined && link.count > 0 && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-xs font-semibold text-white">
              {link.count}
            </span>
          )}
          {hasSubLinks && (
            <ChevronDown
              size={16}
              className={cn("transition-transform", isOpen && "rotate-180")}
            />
          )}
        </div>
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-sky-400 rounded-r-full"></span>
        )}
      </Link>

      <AnimatePresence>
        {isOpen && hasSubLinks && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-7 pt-1 overflow-hidden"
          >
            <div className="space-y-1 border-l border-slate-600 pl-4">
              {link.subLinks.map((sub) => {
                if (link.label === "Report Download") {
                  const isLoading =
                    reportStatus === "loading" && downloadingType === sub.type;
                  return (
                    <button
                      key={sub.label}
                      onClick={() => {
                        handleReportDownload(sub.type!, sub.fileName!);
                        onLinkClick?.(); // Also close sidebar after starting download
                      }}
                      disabled={isLoading}
                      className="w-full text-left text-sm py-1.5 px-3 rounded-md text-slate-400 hover:text-white flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {sub.label}
                      {isLoading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </button>
                  );
                }
                return (
                  <Link
                    key={sub.label}
                    href={sub.href || "#"}
                    onClick={() => onLinkClick?.()} // Close sidebar when a sub-link is clicked
                    className={cn(
                      "block text-sm py-1.5 px-3 rounded-md transition-colors",
                      pathname === sub.href
                        ? "text-sky-400 font-semibold"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    {sub.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Sidebar Component ---
export function AdminSidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const { status: reportStatus, downloadingType } = useSelector(
    (state: RootState) => state.reports
  );
  const { stats, status: dashboardStatus } = useSelector(
    (state: RootState) => state.dashboard
  );
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const sidebarLinks: SidebarLink[] = useMemo(
    () => [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      {
        label: "New Memberships",
        href: "/admin/new-memberships",
        icon: UserPlus,
        count: stats?.members.new,
      },
      {
        label: "Active Members",
        href: "/admin/active-members",
        icon: Users,
        count: stats?.members.active,
      },
      {
        label: "Generate Certificate",
        href: "/admin/generate-certificate",
        icon: Award,
        count: stats?.members.active,
      },
      {
        label: "Active Certificate",
        href: "/admin/active-certificate",
        icon: ShieldCheck,
        count: stats?.receipts.userDonation,
      },
      {
        label: "Send Notice",
        href: "#",
        icon: Send,
        subLinks: [
          { label: "Send To Single User", href: "/admin/send-notice/single" },
          { label: "Send To All User", href: "/admin/send-notice/all" },
          { label: "Previous Notice", href: "/admin/send-notice/previous" },
        ],
      },
      {
        label: "All Users Data",
        href: "/admin/all-users",
        icon: Users,
        count: stats?.members.total,
      },
      {
        label: "Blocked Users",
        href: "/admin/blocked-users",
        icon: UserX,
        count: stats?.members.blocked,
      },
      {
        label: "Manager Section",
        href: "#",
        icon: Briefcase,
        count: stats?.managers.total,
        subLinks: [
          { label: "Add Manager", href: "/admin/users/add" },
          { label: "Active Manager", href: "/admin/users/active" },
          { label: "Blocked Manager", href: "/admin/users/blocked" },
        ],
      },
      {
        label: "Cash Donation",
        href: "#",
        icon: Banknote,
        count: stats?.receipts.cash,
        subLinks: [
          { label: "Receive Donation", href: "/admin/cash-donation/receive" },
          { label: "Receipt", href: "/admin/cash-donation/receipt" },
        ],
      },
      {
        label: "Visitor Certificate",
        href: "#",
        icon: Award,
        subLinks: [
          {
            label: "Generate Certificate",
            href: "/admin/visitor-certificate/generate",
          },
          {
            label: "All Visitor Certificate",
            href: "/admin/visitor-certificate/all",
          },
        ],
      },
      {
        label: "Visitor Donation",
        href: "/admin/visitor-donation",
        icon: Gift,
        count: stats?.receipts.visitor,
      },
      {
        label: "All Receipts",
        href: "#",
        icon: Receipt,
        count: stats
          ? stats.receipts.membership +
            stats.receipts.visitor +
            stats.receipts.cash
          : 0,
        subLinks: [
          { label: "Membership Receipt", href: "/admin/receipts/membership" },
          {
            label: "User Donation Receipt",
            href: "/admin/receipts/user-donation",
          },
          {
            label: "Visitor Donation Receipt",
            href: "/admin/receipts/visitor-donation",
          },
          {
            label: "Cash Donation Receipt",
            href: "/admin/receipts/cash-donation",
          },
        ],
      },
      {
        label: "Report Download",
        href: "#",
        icon: Download,
        subLinks: [
          {
            label: "New Memberships",
            type: "pending",
            fileName: "new-memberships-report.xlsx",
          },
          {
            label: "Active Members",
            type: "active",
            fileName: "active-members-report.xlsx",
          },
        ],
      },
      {
        label: "Add Emp Details",
        href: "/admin/add-emp-details",
        icon: SquarePlus,
      },
      { label: "Comp List", href: "/admin/comp-list", icon: Building },
      {
        label: "Add state",
        href: "/admin/manage-config",
        icon: SquarePlus,
      },
      {
        label: "Manage Claims",
        href: "/admin/manage-claims",
        icon: SquarePlus,
      },

      {
        label: "Update Software",
        href: "/admin/update-software",
        icon: FileSignature,
      },
    ],
    [stats]
  );

  useEffect(() => {
    if (dashboardStatus === "idle") {
      dispatch(fetchDashboardStats());
    }
  }, [dashboardStatus, dispatch]);

  useEffect(() => {
    const activeParent = sidebarLinks.find((link) =>
      link.subLinks?.some((sub) => sub.href && pathname.startsWith(sub.href))
    );
    if (activeParent) {
      setOpenSubmenu(activeParent.label);
    } else {
      setOpenSubmenu(null); // Close submenus when navigating to a top-level link
    }
  }, [pathname, sidebarLinks]);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const handleReportDownload = (
    type: "pending" | "active",
    fileName: string
  ) => {
    if (reportStatus === "loading") return;
    dispatch(downloadReport({ type, fileName }));
  };

  return (
    <aside className="w-64 bg-slate-800 text-slate-100 flex flex-col h-screen">
      <div className="flex items-center gap-x-3 p-4 border-b border-slate-700 h-16 flex-shrink-0">
        <Image
          src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
          alt="Logo"
          width={36}
          height={36}
          className="rounded-full bg-white p-0.5"
        />
        <span className="text-lg font-bold text-white">Admin Activity</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => (
          <SidebarNavItem
            key={link.label}
            link={link}
            pathname={pathname}
            openSubmenu={openSubmenu}
            toggleSubmenu={toggleSubmenu}
            handleReportDownload={handleReportDownload}
            reportStatus={reportStatus}
            downloadingType={downloadingType}
            onLinkClick={onLinkClick} // Pass the function down
          />
        ))}
      </nav>
    </aside>
  );
}
