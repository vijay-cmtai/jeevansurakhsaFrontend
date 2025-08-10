"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function WhoWeArePage() {
  const [activeTab, setActiveTab] = useState("foundation");
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
            About Us
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center space-x-2 text-sm text-gray-300"
          >
            <span className="text-orange-400">HOME</span>
            <span>•</span>
            <span>ABOUT US</span>
          </motion.div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
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
              <h2 className="text-3xl font-bold text-gray-800">About Us</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <span className="font-semibold text-gray-800">
                    Jeevan Suraksha Social Security Collective
                  </span>
                  , an initiative of{" "}
                  <span className="font-semibold text-gray-800">
                    Health Guard Foundation
                  </span>
                  , is a community-driven initiative designed to provide
                  financial support to families during their most challenging
                  times. By uniting individuals under a collective social
                  security model, we ensure that each member contributes a small
                  amount to create a substantial fund that supports the family
                  of a fellow member.
                </p>
                <p>
                  We are managing multiple collectives to extend this support to
                  every segment of society because every family and every life
                  is invaluable. Our mission is to safeguard families from
                  financial distress after the loss of their primary earner,
                  fostering a compassionate and resilient community. With many
                  individuals contributing a small amount, we create a robust
                  safety net that delivers a significant impact. Together, we
                  ensure that no one faces hardship alone.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Tabbed Mission Section */}
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        <Image
          src="/images/mission-bg-person.png"
          alt="background person"
          width={800}
          height={800}
          className="absolute -bottom-40 -left-60 z-0 opacity-[0.07] pointer-events-none"
        />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Our Mission is to Help People
            </h2>
          </motion.div>
          <div className="flex justify-center space-x-2 md:space-x-4 mb-10">
            {["foundation", "mission", "vision"].map((tabId) => (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg font-semibold transition-all duration-300 border-2 ${
                  activeTab === tabId
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                }`}
              >
                {tabId === "foundation"
                  ? "What is Health Guard Foundation?"
                  : tabId === "mission"
                    ? "Our Mission"
                    : "Our Vision"}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <TabContent
                  id="foundation"
                  title="What is Health Guard Foundation?"
                >
                  <p>
                    Health Guard Foundation (HGF), an NGO registered in
                    Telangana, India, founded with the vision of creating a
                    community-driven safety net. HGF aim to provide instant
                    financial assistance to individuals during health crises,
                    regardless of their background or income level.
                  </p>
                  <p>
                    Our initiative is simple yet powerful—members contribute ₹10
                    per month, pooling resources into a common fund. When a
                    medical emergency strikes, this fund becomes a lifeline,
                    ensuring that urgent care is accessible without financial
                    stress.
                  </p>
                </TabContent>
                <TabContent id="mission" title="Our Mission">
                  <p>
                    To build a caring and supportive community where members
                    stand together to provide financial security to
                    beneficiaries through small contributions, ensuring no
                    family faces hardship alone during their most challenging
                    times.
                  </p>
                </TabContent>
                <TabContent id="vision" title="Our Vision">
                  <p>
                    To create a nationwide network of social security
                    collectives that provides comprehensive financial protection
                    to every family, fostering a society where mutual support
                    and community care are the foundation of security.
                  </p>
                </TabContent>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
              >
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
