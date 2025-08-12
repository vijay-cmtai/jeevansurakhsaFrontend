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
    <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
    <div className="space-y-3 text-gray-600 leading-relaxed">{children}</div>
  </div>
);

export default function RefundPolicyPage() {
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
              {t("refund.hero.title")}
            </h1>
            <div className="flex items-center justify-center space-x-2 text-sm mt-4 text-gray-300 font-mono">
              <span className="text-yellow-400 font-semibold">HOME</span>
              <span>&gt;</span>
              <span className="text-white">{t("refund.hero.breadcrumb")}</span>
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
              {t("refund.content.effectiveDate")}
            </p>
            <p className="mb-10 leading-relaxed">{t("refund.content.intro")}</p>

            <div className="space-y-8">
              <PolicySection title={t("refund.section.eligibility.title")}>
                <p>{t("refund.section.eligibility.p1")}</p>
                <p>{t("refund.section.eligibility.p2")}</p>
              </PolicySection>

              <PolicySection title={t("refund.section.nonRefundable.title")}>
                <p>{t("refund.section.nonRefundable.p1")}</p>
                <p>{t("refund.section.nonRefundable.p2")}</p>
              </PolicySection>

              <PolicySection title={t("refund.section.process.title")}>
                <p>{t("refund.section.process.p1")}</p>
                <p>{t("refund.section.process.p2")}</p>
              </PolicySection>

              <PolicySection title={t("refund.section.contact.title")}>
                <p>{t("refund.section.contact.p1")}</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {t("refund.section.contact.visitUs")}
                    </h3>
                    <p className="mt-1">
                      {t("refund.section.contact.address.l1")}
                    </p>
                    <p>{t("refund.section.contact.address.l2")}</p>
                    <p>{t("refund.section.contact.address.l3")}</p>
                    <p>{t("refund.section.contact.address.l4")}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {t("refund.section.contact.mailUs")}
                    </h3>
                    <p className="mt-1">{t("refund.section.contact.email")}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {t("refund.section.contact.phoneUs")}
                    </h3>
                    <p className="mt-1">{t("refund.section.contact.phone")}</p>
                  </div>
                </div>
              </PolicySection>
            </div>

            <div className="mt-12 border-t pt-6">
              <p className="text-center text-sm text-gray-600">
                {t("refund.content.conclusion")}
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
