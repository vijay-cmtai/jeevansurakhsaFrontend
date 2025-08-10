"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext"; // Step 1: Hook import karein

// Step 3: Data ko translation keys ke saath define karein
const featuresData = [
  {
    icon: "https://jeevansamarth.com/wp-content/uploads/2023/08/h15-i1.png",
    titleKey: "whyJoin.feature1.title",
    descriptionKey: "whyJoin.feature1.desc",
  },
  {
    icon: "https://jeevansamarth.com/wp-content/uploads/2023/08/h15-i2.png",
    titleKey: "whyJoin.feature2.title",
    descriptionKey: "whyJoin.feature2.desc",
  },
  {
    icon: "https://jeevansamarth.com/wp-content/uploads/2023/08/h15-i2.png",
    titleKey: "whyJoin.feature3.title",
    descriptionKey: "whyJoin.feature3.desc",
  },
  {
    icon: "https://jeevansamarth.com/wp-content/uploads/2023/08/h15-i3.png",
    titleKey: "whyJoin.feature4.title",
    descriptionKey: "whyJoin.feature4.desc",
  },
  {
    icon: "https://jeevansamarth.com/wp-content/uploads/2023/08/h15-i3.png",
    titleKey: "whyJoin.feature5.title",
    descriptionKey: "whyJoin.feature5.desc",
  },
  {
    icon: "https://jeevansamarth.com/wp-content/uploads/2023/08/h15-i2.png",
    titleKey: "whyJoin.feature6.title",
    descriptionKey: "whyJoin.feature6.desc",
  },
];

export function WhyJoinSection() {
  const { t } = useLanguage(); // Step 2: 't' function ko use karein

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
            {t("whyJoin.title")}
          </h2>
          <Image
            src="https://jeevansamarth.com/wp-content/uploads/2025/03/ss.png"
            alt="Hands holding a paper family cutout"
            width={400}
            height={250}
            className="mx-auto"
          />
        </motion.div>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: (index % 2) * 0.1 + Math.floor(index / 2) * 0.2,
              }}
              viewport={{ once: true }}
              className="bg-[#F0F5FF] rounded-xl p-6 flex items-center space-x-5"
            >
              <div className="flex-shrink-0">
                <Image
                  src={feature.icon}
                  alt={t(feature.titleKey)} // Alt text ko bhi translate karein
                  width={60}
                  height={60}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t(feature.descriptionKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
