"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function AboutSection() {
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              About Our Initiative
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Jeevan Suraksha Social Security Collective is a revolutionary
              approach to community-based financial security. We believe that
              when people come together, they can create a safety net that
              protects everyone in times of need.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our collective operates on the principle of mutual support, where
              small contributions from many members create substantial financial
              assistance for families facing the loss of a loved one.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Through transparent operations and community-driven governance, we
              ensure that every member feels secure knowing their family will be
              supported when it matters most.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              Read More
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
