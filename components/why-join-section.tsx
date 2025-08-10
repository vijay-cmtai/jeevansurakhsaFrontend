"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function WhyJoinSection() {
  const features = [
    {
      icon: "	https://jeevansamarth.com/wp-content/uploads/2023/08/h15-i1.png",
      title: "Financial Security",
      description:
        "Ensure your family is protected in unforeseen circumstances.",
    },
    {
      icon: "	https://jeevansamarth.com/wp-content/uploads/2023/08/h15-i2.png",
      title: "Transparent Operations",
      description: "No middlemen; direct transfers to the needy patient.",
    },
    {
      icon: "https://jeevansamarth.com/wp-content/uploads/2023/08/h15-i2.png",
      title: "Community Strength",
      description:
        "Be part of a network that supports each other in times of need.",
    },
    {
      icon: "	https://jeevansamarth.com/wp-content/uploads/2023/08/h15-i3.png",
      title: "Quick Disbursement",
      description: "Funds are distributed promptly after verification.",
    },
    {
      icon: "		https://jeevansamarth.com/wp-content/uploads/2023/08/h15-i3.png",
      title: "Affordable Model",
      description:
        "Start small, contribute less over time, and benefit from collective security.",
    },
    {
      icon: "https://jeevansamarth.com/wp-content/uploads/2023/08/h15-i2.png",
      title: "Membership Growth Benefits Everyone",
      description: "More members mean lower contributions per case.",
    },
  ];

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
            Why Join Jeevan Suraksha Social Security Collective?
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
          {features.map((feature, index) => (
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
                  alt={`${feature.title} icon`}
                  width={60}
                  height={60}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
