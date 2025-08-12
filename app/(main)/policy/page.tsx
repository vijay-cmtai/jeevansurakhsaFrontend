"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

// Helper component for each section of the policy
const PolicySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mt-8">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="space-y-4 text-gray-600 leading-relaxed">{children}</div>
  </div>
);

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

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
              {t("privacy.hero.title")}
            </h1>
            <div className="flex items-center justify-center space-x-2 text-sm mt-4 text-gray-300 font-mono">
              <span className="text-yellow-400 font-semibold">HOME</span>
              <span>&gt;</span>
              <span className="text-white">{t("privacy.hero.breadcrumb")}</span>
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
            className="text-gray-700"
          >
            <p className="text-sm text-gray-500 italic mb-6">
              {t("privacy.content.effectiveDate")}
            </p>
            <p className="mb-10 leading-relaxed">
              {t("privacy.content.intro")}
            </p>

            <div className="space-y-8">
              <PolicySection title={t("privacy.section.collect.title")}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("privacy.section.collect.personal"),
                  }}
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("privacy.section.collect.nonPersonal"),
                  }}
                />
              </PolicySection>

              <PolicySection title={t("privacy.section.use.title")}>
                <ul className="list-disc list-outside pl-5 space-y-2">
                  <li>{t("privacy.section.use.l1")}</li>
                  <li>{t("privacy.section.use.l2")}</li>
                  <li>{t("privacy.section.use.l3")}</li>
                  <li>{t("privacy.section.use.l4")}</li>
                </ul>
              </PolicySection>

              <PolicySection title={t("privacy.section.sharing.title")}>
                <p>{t("privacy.section.sharing.p1")}</p>
                <p>{t("privacy.section.sharing.p2")}</p>
              </PolicySection>

              <PolicySection title={t("privacy.section.security.title")}>
                <p>{t("privacy.section.security.p1")}</p>
                <p>{t("privacy.section.security.p2")}</p>
              </PolicySection>

              <PolicySection title={t("privacy.section.rights.title")}>
                <p>{t("privacy.section.rights.p1")}</p>
                <p>{t("privacy.section.rights.p2")}</p>
              </PolicySection>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
