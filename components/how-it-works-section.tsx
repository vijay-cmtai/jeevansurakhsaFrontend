"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    "Pay registration fee ₹100 and renewal ₹100",
    "Scheme starts with 1,000 members",
    "Contributions only after a member passes (₹500 onwards)",
    "Funds are disbursed directly to nominee",
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
          How It Works?
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* बाईं ओर का हिस्सा वैसा ही है */}
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
                  Jeevan Suraksha portal allows members to track contributions
                  and payments.
                </p>
              </div>
            </div>

            <p className="text-lg font-bold text-orange-600 mt-6">
              Join today and be part of a community that cares!
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
