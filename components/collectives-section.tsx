"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CollectivesSection() {
  const collectives = [
    {
      title: "IT Professionals & Govt. Employees",
      description:
        "Tailored for professionals in technology and government sectors with higher contribution capacity.",
      image:
        "https://jeevansamarth.com/wp-content/uploads/2025/03/2150038840-800x588.jpg",
    },
    {
      title: "General Public & Business Owners",
      description:
        "Designed for the general public and small business owners seeking affordable security.",
      image:
        "https://jeevansamarth.com/wp-content/uploads/2023/08/h14-2-740x545.jpg",
    },
    {
      title: "Other Collectives (Upcoming)",
      description:
        "More specialized collectives coming soon based on community needs and feedback.",
      image:
        "https://jeevansamarth.com/wp-content/uploads/2020/10/donation_12-740x545.jpg",
    },
  ];

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
            Multiple Collectives for Different Member Groups
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Different collectives based on financial capacity and preferences.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectives.map((collective, index) => (
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
                    alt={collective.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-3">
                    {collective.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {collective.description}
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
