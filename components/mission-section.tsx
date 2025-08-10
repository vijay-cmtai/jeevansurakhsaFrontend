"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext"; // Step 1: Hook import karein

export function MissionSection() {
  const { t } = useLanguage(); // Step 2: 't' function ko use karein

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
        >
          {/* Step 3: Text ko 't' function se replace karein */}
          {t("mission.title")}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <img
            src="https://jeevansamarth.com/wp-content/uploads/2022/06/home13-ib-1.png"
            className="block mx-auto"
            alt="Our Mission Graphic"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto"
        >
          {/* Step 3: Text ko 't' function se replace karein */}
          {t("mission.text")}
        </motion.p>
      </div>
    </section>
  );
}
