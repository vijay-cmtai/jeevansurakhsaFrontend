"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext"; // Step 1: Hook import karein

export default function WhoWeArePage() {
  const { t } = useLanguage(); // Step 2: 't' function ko use karein
  const [activeTab, setActiveTab] = useState("foundation");

  // TabContent component mein koi badlav nahi hai, woh dynamic data lega
  const TabContent = ({ id, title, children }) => (
    <AnimatePresence mode="wait">
      {activeTab === id && (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative py-24 bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "url('https://jeevansamarth.com/wp-content/uploads/2025/03/10.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl font-bold mb-2"
          >
            {t("whoWeAre.hero.title")}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center space-x-2 text-sm text-gray-300"
          >
            <span className="text-orange-400">
              {t("whoWeAre.hero.breadcrumbHome")}
            </span>
            <span>•</span>
            <span>{t("whoWeAre.hero.breadcrumbAbout")}</span>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* ... (Image Div mein koi badlav nahi) ... */}
            <motion.div>
              <Image
                src="https://jeevan.atlix.in/wp-content/uploads/2025/03/2149191379.jpg"
                alt="Hand protecting family cutout"
                width={600}
                height={800}
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-800">
                {t("whoWeAre.about.title")}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                {/* Note: `<span>` tags ko preserve karne ke liye, humne poore paragraph ko translate kiya hai. */}
                <p>{t("whoWeAre.about.p1")}</p>
                <p>{t("whoWeAre.about.p2")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabbed Mission Section */}
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        {/* ... (Background Image mein koi badlav nahi) ... */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              {t("whoWeAre.mission.title")}
            </h2>
          </motion.div>
          <div className="flex justify-center space-x-2 md:space-x-4 mb-10">
            {/* Tabs */}
            <button
              onClick={() => setActiveTab("foundation")}
              className={`px-4 py-2 md:px-6 md:py-3 ... ${activeTab === "foundation" ? "bg-blue-600 text-white..." : "bg-white..."}`}
            >
              {t("whoWeAre.mission.tab1")}
            </button>
            <button
              onClick={() => setActiveTab("mission")}
              className={`px-4 py-2 md:px-6 md:py-3 ... ${activeTab === "mission" ? "bg-blue-600 text-white..." : "bg-white..."}`}
            >
              {t("whoWeAre.mission.tab2")}
            </button>
            <button
              onClick={() => setActiveTab("vision")}
              className={`px-4 py-2 md:px-6 md:py-3 ... ${activeTab === "vision" ? "bg-blue-600 text-white..." : "bg-white..."}`}
            >
              {t("whoWeAre.mission.tab3")}
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {/* Tab Content */}
                <TabContent
                  id="foundation"
                  title={t("whoWeAre.mission.foundationTitle")}
                >
                  <p>{t("whoWeAre.mission.foundationP1")}</p>
                  <p>{t("whoWeAre.mission.foundationP2")}</p>
                </TabContent>
                <TabContent
                  id="mission"
                  title={t("whoWeAre.mission.missionTitle")}
                >
                  <p>{t("whoWeAre.mission.missionP")}</p>
                </TabContent>
                <TabContent
                  id="vision"
                  title={t("whoWeAre.mission.visionTitle")}
                >
                  <p>{t("whoWeAre.mission.visionP")}</p>
                </TabContent>
              </div>
              {/* ... (Image div mein koi badlav nahi) ... */}
              <motion.div>
                <Image
                  src="https://jeevansamarth.com/wp-content/uploads/2020/11/paper-family-composition-wooden-background-with-copy-space.jpg"
                  alt="Hands protecting family on wooden background"
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
