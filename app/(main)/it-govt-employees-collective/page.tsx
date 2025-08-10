"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

//================================================================
// HEADER BANNER COMPONENT
//================================================================
function CollectiveHeader() {
  const { t } = useLanguage();
  const backgroundImageUrl =
    "https://jeevan.atlix.in/wp-content/uploads/2025/03/10.jpg";

  return (
    <section className="relative w-full h-80 bg-gray-900">
      <img
        src={backgroundImageUrl}
        alt="IT and Government Professionals working"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
      <div className="relative h-full flex flex-col items-center justify-center text-white z-20 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold drop-shadow-lg"
        >
          {t("itGovtCollective.hero.title")}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 flex items-center space-x-2 text-sm tracking-widest uppercase"
        >
          <Link
            href="/"
            className="font-semibold text-amber-400 hover:text-amber-300"
          >
            {t("itGovtCollective.hero.breadcrumbHome")}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-200 font-semibold">
            {t("itGovtCollective.hero.breadcrumbCollective")}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

//================================================================
// REUSABLE COMPONENTS FOR THE PAGE (ERROR FIXED)
//================================================================
const SectionTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
    {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
  </div>
);

// === ERROR FIXED: Extra {} hata diye gaye ===
const HowItWorksCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
    <h3 className="font-bold text-lg text-blue-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

// === ERROR FIXED: Extra {} hata diye gaye ===
const BenefitItem = ({ htmlContent }: { htmlContent: string }) => (
  <li className="flex items-start gap-x-3">
    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
    <span
      className="text-gray-700"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  </li>
);

// === ERROR FIXED: Extra {} hata diye gaye ===
const ContributionTable = ({
  data,
  title,
  headers,
}: {
  data: any[];
  title: string;
  headers: any;
}) => (
  <div>
    <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
      {title}
    </h3>
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full text-center">
        <thead className="bg-[#4a5568] text-white">
          <tr>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
              {headers.members}
            </th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
              {headers.contribution}
            </th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
              {headers.corpus}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className="even:bg-gray-50 hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                {row.members}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                ₹{row.contribution}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">
                {row.corpus}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

//================================================================
// MAIN PAGE COMPONENT
//================================================================
export default function ITGovtCollectivePage() {
  const { t } = useLanguage();

  const tableData1Cr = [
    { members: "2,000", contribution: "500", corpus: "10 Lakhs" },
    { members: "5,000", contribution: "400", corpus: "20 Lakhs" },
    { members: "10,000", contribution: "400", corpus: "40 Lakhs" },
    { members: "25,000", contribution: "400", corpus: "1 Crore" },
    { members: "50,000", contribution: "200", corpus: "1 Crore" },
  ];

  const tableData50L = [
    { members: "1,000", contribution: "300", corpus: "3 Lakhs" },
    { members: "2,000", contribution: "300", corpus: "6 Lakhs" },
    { members: "5,000", contribution: "300", corpus: "15 Lakhs" },
    { members: "10,000", contribution: "300", corpus: "30 Lakhs" },
    { members: "25,000", contribution: "200", corpus: "50 Lakhs" },
    { members: "50,000", contribution: "100", corpus: "50 Lakhs" },
  ];

  const howItWorksData = [
    {
      titleKey: "itGovtCollective.howItWorks.card1.title",
      descriptionKey: "itGovtCollective.howItWorks.card1.description",
    },
    {
      titleKey: "itGovtCollective.howItWorks.card2.title",
      descriptionKey: "itGovtCollective.howItWorks.card2.description",
    },
    {
      titleKey: "itGovtCollective.howItWorks.card3.title",
      descriptionKey: "itGovtCollective.howItWorks.card3.description",
    },
    {
      titleKey: "itGovtCollective.howItWorks.card4.title",
      descriptionKey: "itGovtCollective.howItWorks.card4.description",
    },
    {
      titleKey: "itGovtCollective.howItWorks.card5.title",
      descriptionKey: "itGovtCollective.howItWorks.card5.description",
    },
  ];

  const benefitsData = [
    "itGovtCollective.benefits.item1",
    "itGovtCollective.benefits.item2",
    "itGovtCollective.benefits.item3",
  ];

  const pledgeData = [
    "itGovtCollective.pledge.item1",
    "itGovtCollective.pledge.item2",
    "itGovtCollective.pledge.item3",
    "itGovtCollective.pledge.item4",
    "itGovtCollective.pledge.item5",
    "itGovtCollective.pledge.item6",
  ];

  const disclaimerData = [
    "itGovtCollective.disclaimer.item1",
    "itGovtCollective.disclaimer.item2",
    "itGovtCollective.disclaimer.item3",
  ];

  const tableHeaders = {
    members: t("itGovtCollective.table.headerMembers"),
    contribution: t("itGovtCollective.table.headerContribution"),
    corpus: t("itGovtCollective.table.headerCorpus"),
  };

  return (
    <div>
      <CollectiveHeader />
      <main>
        {/* Intro Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              {t("itGovtCollective.intro.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {t("itGovtCollective.intro.description")}
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <SectionTitle title={t("itGovtCollective.howItWorks.title")} />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {howItWorksData.map((card, index) => (
                <HowItWorksCard
                  key={index}
                  title={t(card.titleKey)}
                  description={t(card.descriptionKey)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Contribution Tables */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 space-y-16">
            <ContributionTable
              data={tableData1Cr}
              title={t("itGovtCollective.table.title1Cr")}
              headers={tableHeaders}
            />
            <ContributionTable
              data={tableData50L}
              title={t("itGovtCollective.table.title50L")}
              headers={tableHeaders}
            />
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <SectionTitle title={t("itGovtCollective.benefits.title")} />
            <ul className="space-y-4">
              {benefitsData.map((itemKey, index) => (
                <BenefitItem key={index} htmlContent={t(itemKey)} />
              ))}
            </ul>
          </div>
        </section>

        {/* Pledge Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden order-last lg:order-first">
              <img
                src="https://jeevan.atlix.in/wp-content/uploads/2025/03/photo_2025-03-19_09-44-55.jpg"
                alt="A person thinking"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <SectionTitle title={t("itGovtCollective.pledge.title")} />
              <ul className="space-y-3 text-gray-600">
                {pledgeData.map((itemKey, index) => (
                  <BenefitItem key={index} htmlContent={t(itemKey)} />
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <SectionTitle title={t("itGovtCollective.disclaimer.title")} />
            <ul className="space-y-3 text-gray-600 text-sm list-disc list-inside">
              {disclaimerData.map((itemKey, index) => (
                <li key={index}>{t(itemKey)}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
