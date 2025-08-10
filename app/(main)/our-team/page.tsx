"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext"; // Step 1: Hook import karein

//================================================================
// 1. OUR TEAM HEADER COMPONENT
//================================================================
function OurTeamHeader() {
  const { t } = useLanguage();
  const backgroundImageUrl =
    "https://jeevan.atlix.in/wp-content/uploads/2025/03/10.jpg";

  return (
    <section className="relative w-full h-72 bg-gray-900">
      <img
        src={backgroundImageUrl}
        alt="Team background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />
      <div className="relative h-full flex flex-col items-center justify-center text-white z-20 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-extrabold drop-shadow-lg"
        >
          {t("ourTeam.hero.title")}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-4 flex items-center space-x-3 text-base tracking-wider drop-shadow-md"
        >
          <Link
            href="/"
            className="font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            {t("ourTeam.hero.breadcrumbHome")}
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-gray-100 font-semibold">
            {t("ourTeam.hero.breadcrumbOurTeam")}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

//================================================================
// 2. TEAM MEMBER CARD COMPONENT
//================================================================
interface TeamMemberCardProps {
  imageUrl: string;
  nameKey: string; // name ko nameKey se replace kiya
  roleKey: string; // role ko roleKey se replace kiya
  delay: number;
}

function TeamMemberCard({
  imageUrl,
  nameKey,
  roleKey,
  delay,
}: TeamMemberCardProps) {
  const { t } = useLanguage();
  const translatedName = t(nameKey);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="w-full aspect-square rounded-lg overflow-hidden mx-auto relative">
        <Image
          src={imageUrl}
          alt={t("ourTeam.card.altText")}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center"
        />
      </div>
      <h3 className="mt-4 text-base font-bold text-blue-900">
        {translatedName}
      </h3>
      <p className="mt-1 text-xs text-gray-500 uppercase tracking-wide">
        {t(roleKey)}
      </p>
    </motion.div>
  );
}

//================================================================
// 3. TEAM DATA
//================================================================
const allTeamMembers = [
  {
    id: 1,
    nameKey: "ourTeam.member1.name",
    roleKey: "ourTeam.member1.role",
    imageUrl:
      "https://jeevansuraksha.org/wp-content/uploads/2025/04/irshad-235x300-1-150x150.webp",
    category: "Our Team",
  },
  {
    id: 2,
    nameKey: "ourTeam.member2.name",
    roleKey: "ourTeam.member2.role",
    imageUrl:
      "https://jeevansuraksha.org/wp-content/uploads/2025/04/shiva-238x300-1-150x150.webp",
    category: "Our Team",
  },
  {
    id: 3,
    nameKey: "ourTeam.member3.name",
    roleKey: "ourTeam.member3.role",
    imageUrl:
      "https://jeevansuraksha.org/wp-content/uploads/2025/04/Shaik-Khaleel-218x300-1-150x150.webp",
    category: "Our Team",
  },
  {
    id: 4,
    nameKey: "ourTeam.member4.name",
    roleKey: "ourTeam.member4.role",
    imageUrl:
      "https://jeevansuraksha.org/wp-content/uploads/2025/04/Panuganti_Krishnaiah-297x300-1-150x150.webp",
    category: "Board",
  },
  {
    id: 5,
    nameKey: "ourTeam.member5.name",
    roleKey: "ourTeam.member5.role",
    imageUrl:
      "https://jeevansuraksha.org/wp-content/uploads/2025/04/Gawhar-Saleem-Zeeshan-233x300-1-150x150.webp",
    category: "Advisors",
  },
  {
    id: 6,
    nameKey: "ourTeam.member6.name",
    roleKey: "ourTeam.member6.role",
    imageUrl:
      "https://jeevansuraksha.org/wp-content/uploads/2025/04/Mohammed_Shafi-241x300-1-150x150.webp",
    category: "Advisors",
  },
  {
    id: 7,
    nameKey: "ourTeam.member7.name",
    roleKey: "ourTeam.member7.role",
    imageUrl:
      "https://jeevansuraksha.org/wp-content/uploads/2025/04/Lakshmikanth_Madhavaram-233x300-1-150x150.webp",
    category: "Advisors",
  },
];

//================================================================
// 4. MAIN TEAM SECTION
//================================================================
function OurTeamSection() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("Our Team");

  const tabs = [
    { id: "Our Team", labelKey: "ourTeam.tabs.ourTeam" },
    { id: "Board", labelKey: "ourTeam.tabs.board" },
    { id: "Advisors", labelKey: "ourTeam.tabs.advisors" },
  ];

  const filteredMembers = allTeamMembers.filter(
    (member) => member.category === activeTab
  );

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-16 p-1.5 bg-white border border-gray-200 rounded-lg max-w-sm mx-auto shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 focus:outline-none ${
                activeTab === tab.id
                  ? "bg-green-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member, index) => (
                <TeamMemberCard
                  key={member.id}
                  imageUrl={member.imageUrl}
                  nameKey={member.nameKey}
                  roleKey={member.roleKey}
                  delay={index * 0.1}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                {t("ourTeam.noMembers")}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

//================================================================
// 5. FINAL PAGE COMPONENT
//================================================================
export default function OurTeamPage() {
  return (
    <>
      <OurTeamHeader />
      <OurTeamSection />
    </>
  );
}
