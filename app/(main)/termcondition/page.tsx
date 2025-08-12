"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

// Helper component for each section of the terms
const TermSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mt-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
    <div className="space-y-4 text-gray-700 leading-relaxed">{children}</div>
  </div>
);

export default function TermsAndConditionsPage() {
  const { t } = useLanguage();
  const companyName = "Jeevan Suraksha Social Security Collective";

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="py-32 bg-cover bg-center text-white relative"
        style={{
          backgroundImage:
            "url('https://jeevansamarth.com/wp-content/uploads/2025/03/10.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/70 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {t("terms.hero.title")}
            </h1>
            <div className="flex items-center justify-center space-x-2 text-sm mt-4 text-gray-300 font-mono">
              <span className="text-yellow-400 font-semibold">HOME</span>
              <span>&gt;</span>
              <span className="text-white">{t("terms.hero.breadcrumb")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <main className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {t("terms.content.title")}
            </h1>
            {/* === BADLAAV YAHAN HAI === */}
            <p className="text-gray-600 mb-10">
              {t("terms.content.intro.p1")} <strong>{companyName}</strong>
              {t("terms.content.intro.p2")}
            </p>

            <div className="space-y-10">
              <TermSection title={t("terms.section.acceptance.title")}>
                <p>{t("terms.section.acceptance.p1")}</p>
              </TermSection>

              <TermSection title={t("terms.section.useOfWebsite.title")}>
                <p>{t("terms.section.useOfWebsite.p1")}</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>{t("terms.section.useOfWebsite.l1")}</li>
                  <li>{t("terms.section.useOfWebsite.l2")}</li>
                  <li>{t("terms.section.useOfWebsite.l3")}</li>
                </ul>
              </TermSection>

              <TermSection
                title={t("terms.section.intellectualProperty.title")}
              >
                {/* === BADLAAV YAHAN HAI === */}
                <p>
                  {t("terms.section.intellectualProperty.p1")}{" "}
                  <strong>{companyName}</strong>{" "}
                  {t("terms.section.intellectualProperty.p2")}
                </p>
              </TermSection>

              <TermSection title={t("terms.section.userContributions.title")}>
                <p>{t("terms.section.userContributions.p1")}</p>
              </TermSection>

              <TermSection title={t("terms.section.thirdParty.title")}>
                <p>{t("terms.section.thirdParty.p1")}</p>
              </TermSection>

              <TermSection title={t("terms.section.liability.title")}>
                {/* === BADLAAV YAHAN HAI === */}
                <p>
                  {t("terms.section.liability.p1")}{" "}
                  <strong>{companyName}</strong>{" "}
                  {t("terms.section.liability.p2")}
                </p>
              </TermSection>

              <TermSection title={t("terms.section.indemnification.title")}>
                {/* === BADLAAV YAHAN HAI === */}
                <p>
                  {t("terms.section.indemnification.p1")}{" "}
                  <strong>{companyName}</strong>
                  {t("terms.section.indemnification.p2")}
                </p>
              </TermSection>

              <TermSection title={t("terms.section.governingLaw.title")}>
                <p>{t("terms.section.governingLaw.p1")}</p>
              </TermSection>

              <TermSection title={t("terms.section.contact.title")}>
                <p>{t("terms.section.contact.p1")}</p>
                {/* === BADLAAV YAHAN HAI === */}
                <p className="font-semibold">{companyName}</p>
              </TermSection>
            </div>

            <div className="mt-12 border-t pt-6">
              <p className="text-center text-gray-600">
                {t("terms.content.thankYou")}
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
