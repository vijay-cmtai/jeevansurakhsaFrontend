"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Flag Icon Components
const IndianFlagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 600"
    width="24"
    height="16"
  >
    <rect width="900" height="600" fill="#f93" />
    <rect width="900" height="200" y="200" fill="#fff" />
    <rect width="900" height="200" y="400" fill="#128807" />
    <g transform="translate(450 300)">
      <circle r="90" fill="#000080" />
      <circle r="80" fill="#fff" />
      <circle r="35" fill="#000080" />
      <g id="d">
        <g id="c">
          <g id="b">
            <g id="a" fill="#000080">
              <circle r="9" transform="rotate(7.5 -90 0)" />
              <path d="M0 17.5l-3.5 17.5h7z" />
            </g>
            <use href="#a" transform="rotate(15)" />
          </g>
          <use href="#b" transform="rotate(30)" />
        </g>
        <use href="#c" transform="rotate(60)" />
      </g>
      <use href="#d" transform="rotate(120)" />
      <use href="#d" transform="rotate(240)" />
    </g>
  </svg>
);

const UKFlagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 30"
    width="24"
    height="16"
  >
    <clipPath id="t">
      <path d="M0 0v30h60V0z" />
    </clipPath>
    <path d="M0 0v30h60V0z" fill="#00247d" />
    <path
      d="M0 0l60 30m0-30L0 30"
      stroke="#fff"
      strokeWidth="6"
      clipPath="url(#t)"
    />
    <path
      d="M0 0l60 30m0-30L0 30"
      stroke="#cf142b"
      strokeWidth="4"
      clipPath="url(#t)"
    />
    <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
    <path d="M30 0v30M0 15h60" stroke="#cf142b" strokeWidth="6" />
  </svg>
);

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Language Switcher State
  const languages = [
    { code: "en", name: "English", Icon: UKFlagIcon },
    { code: "te", name: "Telugu", Icon: IndianFlagIcon },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]); // English default
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/who-we-are", label: "Who We Are" },
    { href: "/our-team", label: "Our Team" },
    { href: "/faqs", label: "FAQ'S" },
    {
      href: "/our-collectives",
      label: "Our Collectives",
      dropdown: [
        {
          href: "/it-govt-employees-collective",
          label: "IT & Govt. Employees Collective",
        },
        {
          href: "/private-employees-business-owners",
          label: "Private Employees & Business Owners",
        },
      ],
    },
    { href: "/report-claim", label: "Report Claim" },
    { href: "/donate", label: "Donate Us" },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
  };

  return (
    // --- YAHAN BADLAV KIYA GAYA HAI ---
    <motion.nav
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo-1024x336.webp"
              alt="Jeevan Suraksha Logo"
              width={1024}
              height={336}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Right side items container */}
          <div className="flex items-center gap-x-6">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-x-8">
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
                    onClick={() => setActiveLink(link.label)}
                    className={`flex items-center text-base font-bold transition-colors duration-200 ${
                      activeLink === link.label
                        ? "text-blue-500"
                        : "text-gray-800 hover:text-blue-500"
                    }`}
                  >
                    {link.label}
                    {link.dropdown && (
                      <ChevronDown
                        size={16}
                        className={`ml-1 text-gray-500 transition-transform duration-200 ${
                          openDropdown === link.label ? "rotate-180" : ""
                        }`}
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
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-md shadow-lg border border-gray-200 z-50"
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
            </div>

            {/* Language Switcher */}
            <div className="hidden lg:flex relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <selectedLanguage.Icon />
                <span className="font-semibold text-sm text-gray-700">
                  {selectedLanguage.name}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform duration-200 ${isLangDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isLangDropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute top-full right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                  >
                    <div className="p-1">
                      {languages
                        .filter((lang) => lang.code !== selectedLanguage.code)
                        .map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setSelectedLanguage(lang);
                              setIsLangDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                          >
                            <lang.Icon />
                            {lang.name}
                          </button>
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
