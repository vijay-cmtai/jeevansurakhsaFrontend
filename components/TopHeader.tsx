"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  ChevronRight,
  UserPlus,
  HeartHandshake,
} from "lucide-react";

const FacebookIcon = () => (
  <svg
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.142v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z" />
  </svg>
);
const TwitterIcon = () => (
  <svg
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085c.645 1.956 2.523 3.379 4.75 3.419a9.9 9.9 0 01-6.117 2.107c-.397 0-.79-.023-1.175-.068a13.963 13.963 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);
const YoutubeIcon = () => (
  <svg
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
const InstagramIcon = () => (
  <svg
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.447c-3.117 0-3.486.01-4.71.066-2.88.132-4.017 1.256-4.148 4.148-.056 1.223-.066 1.595-.066 4.71s.01 3.486.066 4.71c.131 2.893 1.266 4.017 4.148 4.148 1.223.056 1.594.066 4.71.066s3.486-.01 4.71-.066c2.893-.131 4.017-1.266 4.148-4.148.056-1.223.066-1.594.066-4.71s-.01-3.486-.066-4.71c-.131-2.893-1.266-4.017-4.148-4.148-1.223-.056-1.594-.066-4.71-.066zm0 2.92c-3.105 0-5.625 2.52-5.625 5.625s2.52 5.625 5.625 5.625 5.625-2.52 5.625-5.625-2.52-5.625-5.625-5.625zm0 9.81c-2.308 0-4.185-1.877-4.185-4.185s1.877-4.185 4.185-4.185 4.185 1.877 4.185 4.185-1.877 4.185-4.185 4.185zm4.868-10.202c-.78 0-1.414.634-1.414 1.414s.634 1.414 1.414 1.414 1.414-.634 1.414-1.414c0-.78-.634-1.414-1.414-1.414z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M22.23 0H1.77C.79 0 0 .79 0 1.77v20.46C0 23.21.79 24 1.77 24h20.46c.98 0 1.77-.79 1.77-1.77V1.77C24 .79 23.21 0 22.23 0zM7.06 20.45H3.53V9h3.53v11.45zM5.3 7.43c-1.15 0-2.08-.93-2.08-2.08s.93-2.08 2.08-2.08 2.08.93 2.08 2.08-.93 2.08-2.08 2.08zm15.15 13.02h-3.53V14.8c0-1.35-.02-3.08-1.88-3.08-1.88 0-2.17 1.47-2.17 2.98v5.75h-3.53V9h3.39v1.56h.05c.47-.89 1.62-1.82 3.34-1.82 3.58 0 4.24 2.36 4.24 5.42v6.29z" />
  </svg>
);

export function TopHeader() {
  return (
    // Yeh component sirf desktop par dikhega (lg screen size se upar)
    <div className="bg-[#212529] text-white hidden lg:block">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
        <div className="flex items-center gap-x-6">
          {/* Social Icons */}
          <div className="flex items-center gap-x-2">
            <a
              href="#"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-[#55ACEE] flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <FacebookIcon />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="w-8 h-8 rounded-full bg-[#55ACEE] flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <TwitterIcon />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="w-8 h-8 rounded-full bg-[#55ACEE] flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <YoutubeIcon />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-[#55ACEE] flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <InstagramIcon />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-full bg-[#55ACEE] flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <LinkedinIcon />
            </a>
          </div>
          {/* Contact Info */}
          <div className="flex items-center gap-x-6 text-sm font-medium">
            <a
              href="tel:+917816058717"
              className="flex items-center gap-x-2 hover:text-gray-300 transition-colors"
            >
              <Phone size={16} />
              <span>+91-78160 58717</span>
            </a>
            <a
              href="mailto:info@jeevansuraksha.org"
              className="flex items-center gap-x-2 hover:text-gray-300 transition-colors"
            >
              <Mail size={16} />
              <span>info@jeevansuraksha.org</span>
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-x-3">
          <Button
            asChild
            className="bg-[#55ACEE] hover:bg-[#4A99D4] rounded-full text-sm font-semibold px-5 h-9"
          >
            <Link href="/login">
              Login <ChevronRight size={16} className="ml-1" />
            </Link>
          </Button>
          <Button
            asChild
            className="bg-[#55ACEE] hover:bg-[#4A99D4] rounded-full text-sm font-semibold px-5 h-9"
          >
            <Link href="/register">
              Apply For Membership <UserPlus size={16} className="ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            className="bg-[#55ACEE] hover:bg-[#4A99D4] rounded-full text-sm font-semibold px-5 h-9"
          >
            <Link href="/donate">
              Donate Us <HeartHandshake size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
