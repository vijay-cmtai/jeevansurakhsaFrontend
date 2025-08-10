"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext"; // Step 1: Hook import karein

export function HowItWorksSection() {
  const { t } = useLanguage(); // Step 2: 't' function ko use karein

  // Step 3: Steps array ko 't' function se define karein
  const steps = [
    t("howItWorks.step1"),
    t("howItWorks.step2"),
    t("howItWorks.step3"),
    t("howItWorks.step4"),
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
        >
          {t("howItWorks.title")}
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <ArrowRight className="h-6 w-6 text-blue-600 mt-1" />
                </div>
                <p className="text-lg text-gray-700">{step}</p>
              </div>
            ))}

            <div className="bg-blue-600 rounded-lg p-6 mt-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-white" />
                <p className="text-white font-semibold">
                  {t("howItWorks.portalInfo")}
                </p>
              </div>
            </div>

            <p className="text-lg font-bold text-orange-600 mt-6">
              {t("howItWorks.joinToday")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="w-4/5">
              <img
                src="/how.png"
                alt="How it works"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
