"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  BarChart,
  FileText,
  Calendar,
  Award,
  User,
  Settings,
  HandHeart,
  Receipt,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
 
  {
    label: "Membership Status",
    icon: BarChart,
    href: "/dashboard/membership-status",
  },
  { label: "Generate ID Card", icon: FileText, href: "/dashboard/generate-id" },
  {
    label: "Appointment Letter",
    icon: Calendar,
    href: "/dashboard/appointment-letter",
  },
  { label: "Our Certificate", icon: Award, href: "/dashboard/certificate" },
  { label: "Update Profile", icon: User, href: "/dashboard/profile" },
  { label: "Account", icon: Settings, href: "/dashboard/account" },
  { label: "Donate Now", icon: HandHeart, href: "/dashboard/donate" },
  {
    label: "Receipt",
    icon: Receipt,
    href: "#",
    subLinks: [
      { label: "Membership Payment", href: "/dashboard/receipt/membership" },
      { label: "Donation Payment", href: "/dashboard/receipt/donation" },
    ],
  },
];

// --- 🚨 STEP 1: ADD 'onLinkClick' TO THE PROPS INTERFACE 🚨 ---
interface SidebarProps {
  onLinkClick?: () => void;
}

export function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const activeParent = sidebarLinks.find((link) =>
      link.subLinks?.some((sub) => sub.href === pathname)
    );
    if (activeParent) {
      setOpenSubmenu(activeParent.label);
    }
  }, [pathname]);

  return (
    <aside className="w-64 bg-[#2c3e50] text-gray-200 flex flex-col h-screen">
      <div className="flex items-center gap-x-3 p-4 border-b border-gray-700/50 h-16">
        <Image
          src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
          alt="Jeevan Suraksha Logo"
          width={36}
          height={36}
          className="rounded-full"
        />
        <span className="text-lg font-bold text-white">Jeevan Suraksha</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <Link
          href="/dashboard"
          // --- 🚨 STEP 2: CALL 'onLinkClick' on every link/button click 🚨 ---
          onClick={onLinkClick}
          className={cn(
            "flex items-center gap-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            pathname === "/dashboard"
              ? "bg-green-500 text-white"
              : "hover:bg-gray-700/50"
          )}
        >
          <LayoutDashboard className="h-5 w-5" /> Dashboard
        </Link>

        {sidebarLinks.map((link) => {
          const isActive =
            (link.href &&
              pathname.startsWith(link.href) &&
              link.href !== "#") ||
            (link.subLinks &&
              link.subLinks.some((sub) => pathname === sub.href));

          if (link.subLinks) {
            return (
              <div key={link.label}>
                <button
                  onClick={() =>
                    setOpenSubmenu(
                      openSubmenu === link.label ? null : link.label
                    )
                  }
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                    isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700/50"
                  )}
                >
                  <div className="flex items-center gap-x-3">
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </div>
                  {openSubmenu === link.label ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {openSubmenu === link.label && (
                  <div className="pl-7 pt-2 space-y-1">
                    {link.subLinks.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={onLinkClick} // Call on sub-link click as well
                        className={cn(
                          "block text-sm py-1.5 rounded-md px-3 transition-colors",
                          pathname === sub.href
                            ? "text-green-400 font-semibold"
                            : "hover:text-gray-300"
                        )}
                      >
                        - {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={link.label}
              href={link.href || "#"}
              onClick={onLinkClick} // Call on regular link click
              className={cn(
                "flex items-center gap-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700/50"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
