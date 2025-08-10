"use client";

import Link from "next/link";
import Image from "next/image"; // Image component ko import karein
import { MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Logo and About */}
          <div className="space-y-4">
            {/* LOGO SECTION UPDATED */}
            <Link href="/" className="inline-block">
              <Image
                src="https://jeevansuraksha.org/wp-content/uploads/2025/04/white-1024x336-1.webp" // Safed logo for dark background
                alt="Jeevan Suraksha Logo"
                width={180} // Size ko adjust karein
                height={60}
                className="h-auto"
              />
            </Link>
            <p className="text-gray-400 leading-relaxed pt-2">
              A community-driven initiative providing financial security through
              collective support and mutual care during challenging times.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-700 pb-2">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-gray-400">
                  Health Guard Foundation
                  <br />
                  1-63, Amadabakula (Village),
                  <br />
                  Kothakota (Mandal), Wanaparty (District),
                  <br />
                  Telangana, India - 509381
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a
                  href="mailto:info@jeevansuraksha.org"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  info@jeevansuraksha.org
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a
                  href="tel:+917816058717"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  +91-78160 58717
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-700 pb-2">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/who-we-are"
                className="text-gray-400 hover:text-white transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/faqs"
                className="text-gray-400 hover:text-white transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/our-collectives"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Collectives
              </Link>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/report-claim"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Report Claim
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Jeevan Suraksha Social Security
            Collective. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
