"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Next.js Image component
import { motion, AnimatePresence } from "framer-motion";

//================================================================
// 1. OUR TEAM HEADER COMPONENT (Final Version with Lighter Overlay)
//================================================================
function OurTeamHeader() {
  const backgroundImageUrl =
    "https://jeevan.atlix.in/wp-content/uploads/2025/03/10.jpg";

  return (
    <section className="relative w-full h-72 bg-gray-900">
      {/* Background Image */}
      <img
        src={backgroundImageUrl}
        alt="Team background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Lighter Dark Overlay (40% opacity) */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white z-20 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-extrabold drop-shadow-lg"
        >
          Our Team
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
            HOME
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-gray-100 font-semibold">OUR TEAM</span>
        </motion.div>
      </div>
    </section>
  );
}

//================================================================
// 2. TEAM MEMBER CARD COMPONENT (Using next/image)
//================================================================
interface TeamMemberCardProps {
  imageUrl: string;
  name: string;
  role: string;
  delay: number;
}

function TeamMemberCard({ imageUrl, name, role, delay }: TeamMemberCardProps) {
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
          alt={`Profile of ${name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center"
        />
      </div>
      <h3 className="mt-4 text-base font-bold text-blue-900">{name}</h3>
      <p className="mt-1 text-xs text-gray-500 uppercase tracking-wide">
        {role}
      </p>
    </motion.div>
  );
}
const allTeamMembers = [
  {
    id: 1,
    name: "MOHAMMED ALI IRSHAD",
    role: "CHAIRMAN & MANAGING TRUSTEE",
    imageUrl:
      "https://jeevansuraksha.org/wp-content/uploads/2025/04/irshad-235x300-1-150x150.webp",
    category: "Our Team",
  },
  {
    id: 2,
    name: "SHIVA SWAROOP GOUD",
    role: "TRUSTEE & CHIEF OPERATING OFFICER",
    imageUrl:
      "https://jeevansuraksha.org/wp-content/uploads/2025/04/shiva-238x300-1-150x150.webp",
    category: "Our Team",
  },
  {
    id: 3,
    name: "SHAIK KHALEEL",
    role: "PROGRAM MANAGER",
    imageUrl:
      "https://jeevansuraksha.org/wp-content/uploads/2025/04/Shaik-Khaleel-218x300-1-150x150.webp",
    category: "Our Team",
  },
  {
    id: 4,
    name: "PANUGANTI KRISHNAIAH",
    role: "CHIEF RELATIONS OFFICER",
    imageUrl:
      "https://jeevansuraksha.org/wp-content/uploads/2025/04/Panuganti_Krishnaiah-297x300-1-150x150.webp",
    category: "Board",
  },
  {
    id: 5,
    name: "GAWHAR SALEEM ZEESHAN",
    role: "ADVISORY BOARD MEMBER",
    imageUrl:
      "https://jeevansuraksha.org/wp-content/uploads/2025/04/Gawhar-Saleem-Zeeshan-233x300-1-150x150.webp",
    category: "Advisors",
  },
  {
    id: 6,
    name: "MOHAMMED SHAFI",
    role: "ADVISORY BOARD MEMBER",
    imageUrl:
      "https://jeevansuraksha.org/wp-content/uploads/2025/04/Mohammed_Shafi-241x300-1-150x150.webp",
    category: "Advisors",
  },

  {
    id: 7,
    name: "Lakshmikanth Madhavaram",
    role: "ADVISORY BOARD MEMBER",
    imageUrl:
      "https://jeevansuraksha.org/wp-content/uploads/2025/04/Lakshmikanth_Madhavaram-233x300-1-150x150.webp",
    category: "Advisors",
  },
];

//================================================================
// 4. MAIN TEAM SECTION (With functional tabs)
//================================================================
function OurTeamSection() {
  const [activeTab, setActiveTab] = useState("Our Team");
  const tabs = ["Our Team", "Board", "Advisors"];

  const filteredMembers = allTeamMembers.filter(
    (member) => member.category === activeTab
  );

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-16 p-1.5 bg-white border border-gray-200 rounded-lg max-w-sm mx-auto shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 focus:outline-none ${
                activeTab === tab
                  ? "bg-green-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
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
                  name={member.name}
                  role={member.role}
                  delay={index * 0.1}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No members in this category yet.
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
