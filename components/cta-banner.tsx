"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTABanner() {
  return (
    <section className="relative py-24 px-4 bg-[#112A64] overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage: "url('/cta-background-pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          Be Part of the Change
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-lg text-white/90 max-w-3xl mx-auto mb-10"
        >
          Join us in building a collective that stands by you and your loved
          ones. Secure your family's future today!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Button
            asChild
            className="bg-white text-blue-800 hover:bg-gray-200 rounded-full px-10 py-4 font-bold text-sm tracking-widest transition-transform transform hover:scale-105"
          >
            <Link href="/register">REGISTER NOW</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
