// === Next.js ke zaroori imports ===
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

// === Providers jo hum add kar rahe hain ===
import { ReduxProvider } from "@/lib/redux/provider";
import { LanguageProvider } from "@/context/LanguageContext";

// === Aapke UI components ===
import { TopHeader } from "@/components/TopHeader";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Font ko initialize karna
const inter = Inter({ subsets: ["latin"] });

// Website ke SEO aur Title ke liye metadata
export const metadata: Metadata = {
  title: "Jeevan Suraksha - Social Security Collective",
  description: "An initiative by Health Guard Foundation...",
};

// Yeh aapka final Root Layout hai
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Step 1: Sabse bahar data providers rakhein */}
        <ReduxProvider>
          {/* Step 2: Uske andar UI se related providers */}
          <LanguageProvider>
            {/* Ab aapke common UI components */}
            <TopHeader />
            <Navbar />

            {/* Page ka specific content yahan render hoga */}
            <main>{children}</main>

            <Footer />
          </LanguageProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
