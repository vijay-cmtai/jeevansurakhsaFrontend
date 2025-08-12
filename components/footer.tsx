"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="https://jeevansuraksha.org/wp-content/uploads/2025/04/white-1024x336-1.webp"
                alt="Jeevan Suraksha Logo"
                width={180}
                height={60}
                className="h-auto"
              />
            </Link>
            <p className="text-gray-400 leading-relaxed pt-2">
              {t("footer.about")}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-700 pb-2">
              {t("footer.contactInfo")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-gray-400 whitespace-pre-line">
                  {t("footer.address")}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a
                  href={`mailto:${t("topHeader.email")}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("topHeader.email")}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a
                  href={`tel:${t("topHeader.phone")}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("topHeader.phone")}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-700 pb-2">
              {t("footer.quickLinks")}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.link.home")}
              </Link>
              <Link
                href="/who-we-are"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.link.about")}
              </Link>
              <Link
                href="/faqs"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.link.faq")}
              </Link>
              <Link
                href="/our-collectives"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.link.collectives")}
              </Link>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.link.contact")}
              </Link>
              {/* === BADLAAV YAHAN KIYE GAYE HAIN === */}
              <Link
                href="/termcondition" // Folder name se match kiya gaya
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.link.terms")}
              </Link>
              <Link
                href="/policy" // Folder name se match kiya gaya
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.link.privacy")}
              </Link>
              <Link
                href="/returnandrefund" // Naya link add kiya gaya
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.link.refund")}
              </Link>
              {/* === BADLAAV KHATAM === */}
              <Link
                href="/report-claim"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.link.reportClaim")}
              </Link>
              <Link
                href="/volunteers"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.link.volunteers")}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p className="text-gray-400">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
