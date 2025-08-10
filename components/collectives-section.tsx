"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext"; // Step 1: Hook import karein

// Step 3: Data ko translation keys ke saath define karein
const collectivesData = [
  {
    titleKey: "collectives.item1.title",
    descriptionKey: "collectives.item1.desc",
    image:
      "https://jeevansamarth.com/wp-content/uploads/2025/03/2150038840-800x588.jpg",
  },
  {
    titleKey: "collectives.item2.title",
    descriptionKey: "collectives.item2.desc",
    image:
      "https://jeevansamarth.com/wp-content/uploads/2023/08/h14-2-740x545.jpg",
  },
  {
    titleKey: "collectives.item3.title",
    descriptionKey: "collectives.item3.desc",
    image:
      "https://jeevansamarth.com/wp-content/uploads/2020/10/donation_12-740x545.jpg",
  },
];

export function CollectivesSection() {
  const { t } = useLanguage(); // Step 2: 't' function ko use karein

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("collectives.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("collectives.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectivesData.map((collective, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <img
                    src={collective.image || "/placeholder.svg"}
                    alt={t(collective.titleKey)} // Alt text ko bhi translate karein
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-3">
                    {t(collective.titleKey)}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {t(collective.descriptionKey)}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
