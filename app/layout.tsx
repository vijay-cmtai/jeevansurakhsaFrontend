import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TopHeader } from "@/components/TopHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jeevan Suraksha - Social Security Collective",
  description:
    "An initiative by Health Guard Foundation, a community-driven effort to provide financial support to families during their most challenging times.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* TopHeader aur Navbar ab alag alag hain */}
        <TopHeader />
        <Navbar />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
