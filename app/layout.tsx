import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Only import the provider here
import { ReduxProvider } from "@/lib/redux/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jeevan Suraksha - Social Security Collective",
  description: "An initiative by Health Guard Foundation...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
