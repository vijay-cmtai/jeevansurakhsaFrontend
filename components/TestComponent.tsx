"use client";

import { useTranslations } from "next-intl";

export default function TestComponent() {
  // हम सिर्फ Navbar सेक्शन से 'home' की को ट्रांसलेट करने की कोशिश करेंगे
  const t = useTranslations("Navbar");

  return (
    <div
      style={{ padding: "20px", backgroundColor: "lightgreen", margin: "20px" }}
    >
      <h1>Test Component Loaded Successfully!</h1>
      <p>Test Title: {t("home")}</p>
    </div>
  );
}
