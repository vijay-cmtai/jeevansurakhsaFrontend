"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, ChevronDown, UserPlus, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";

// --- Reusable Language Switcher Component ---
type LanguageOption = { code: LanguageCode; nameKey: string; flag: string };
const languages: LanguageOption[] = [
  { code: "en", nameKey: "language.english", flag: "🇬🇧" },
  { code: "te", nameKey: "language.telugu", flag: "🇮🇳" },
];

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const selectedLanguage =
    languages.find((lang) => lang.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-x-2 w-full sm:w-[150px] justify-between h-10 rounded-md border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 px-3"
        >
          <div className="flex items-center gap-x-2">
            <span className="text-xl">{selectedLanguage.flag}</span>
            <span className="font-semibold text-sm">
              {t(selectedLanguage.nameKey)}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => setLanguage(lang.code)}
            className="flex items-center gap-x-2 cursor-pointer"
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="font-semibold text-sm">{t(lang.nameKey)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// --- Main Navbar Component ---
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("navbar.home") },
    { href: "/who-we-are", label: t("navbar.whoWeAre") },
    { href: "/our-team", label: t("navbar.ourTeam") },
    { href: "/faqs", label: t("navbar.faqs") },
    {
      href: "#",
      label: t("navbar.collectives"),
      dropdown: [
        {
          href: "/it-govt-employees-collective",
          label: t("navbar.itGovtCollective"),
        },
        {
          href: "/private-employees-business-owners",
          label: t("navbar.privateBusinessCollective"),
        },
      ],
    },
    { href: "/report-claim", label: t("navbar.reportClaim") },
    { href: "/donate", label: t("navbar.donate") },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white w-full transition-shadow duration-300",
        isScrolled && "shadow-md"
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile-Specific Header Section (This remains as is) */}
        <div className="lg:hidden py-3 border-b">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="outline"
              className="rounded-full border-[#55ACEE] text-[#55ACEE] h-10 px-4"
            >
              Translate This Website
            </Button>
            <LanguageSwitcher />
          </div>
          <div className="flex items-center gap-3">
            <Button
              asChild
              className="flex-1 bg-[#55ACEE] hover:bg-[#4A99D4] rounded-full text-sm font-semibold h-11 justify-center"
            >
              <Link href="/register">{t("common.button.applyMembership")}</Link>
            </Button>
            <Button
              asChild
              className="flex-1 bg-[#55ACEE] hover:bg-[#4A99D4] rounded-full text-sm font-semibold h-11 justify-center"
            >
              <Link href="/login">
                {t("common.button.login")}{" "}
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logoo.webp"
              alt="Jeevan Suraksha Logo"
              width={180}
              height={60}
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-x-6">
            {" "}
            {/* Changed gap-x-8 to gap-x-6 */}
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() =>
                  link.dropdown && setOpenDropdown(link.label)
                }
                onMouseLeave={() => link.dropdown && setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center text-base font-bold transition-colors duration-200",
                    pathname === link.href
                      ? "text-blue-500"
                      : "text-gray-800 hover:text-blue-500"
                  )}
                >
                  {link.label}
                  {link.dropdown && (
                    <ChevronDown
                      size={16}
                      className={cn(
                        "ml-1 text-gray-500 transition-transform duration-200",
                        openDropdown === link.label && "rotate-180"
                      )}
                    />
                  )}
                </Link>
                <AnimatePresence>
                  {link.dropdown && openDropdown === link.label && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-md shadow-lg border z-50"
                    >
                      <div className="p-2">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block w-full text-left px-4 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            {/* --- 🚨 CODE FIX: Language switcher added for desktop view --- */}
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="p-4">
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block font-semibold text-gray-800 py-2.5 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
