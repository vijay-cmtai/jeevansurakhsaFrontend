"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext"; // Step 1: Hook import karein

export function AboutSection() {
  const { t } = useLanguage(); // Step 2: 't' function ko use karein

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="https://jeevan.atlix.in/wp-content/uploads/2025/03/photo_2025-03-19_09-44-55.jpg"
              alt="Family under umbrella"
              className="w-full h-auto rounded-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Step 3: Saare text ko 't' function se replace karein */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t("about.title")}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("about.p1")}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("about.p2")}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("about.p3")}
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              {t("common.button.readMore")}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
