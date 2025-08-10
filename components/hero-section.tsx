"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming you use shadcn/ui
import { useState, useEffect } from "react";

// Data extracted directly from the provided HTML inspect code
const slides = [
  {
    id: 1,
    title: "Jeevan Suraksha Social Security Collective",
    subtitle:
      "Jeevan Suraksha Social Security Collective, an initiative of Health Guard Foundation, is a community-driven initiative designed to provide financial support to families during their most challenging times.",
    image:
      "https://jeevansuraksha.org/wp-content/uploads/slider/cache/1c1e1b2c2a9c924e80338d69bb51656d/10-scaled.jpg",
  },
  {
    id: 2,
    title: "Jeevan Suraksha Social Security Collective",
    subtitle:
      "Jeevan Suraksha Social Security Collective, an initiative of Health Guard Foundation, is a community-driven initiative designed to provide financial support to families during their most challenging times.",
    image:
      "https://jeevansuraksha.org/wp-content/uploads/slider/cache/3f9b264077696e3329e2f558c2dab81a/home-1_slider-2_2-11.jpg",
  },
];

// Animation variants for the sliding effect
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

// Animation variants for the text content
const textVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (slideIndex: number) => {
    setDirection(slideIndex > currentSlide ? 1 : -1);
    setCurrentSlide(slideIndex);
  };

  // Autoplay functionality, as seen in the original slider (8-second interval)
  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    // The original slider has a fixed height of 600px on desktop.
    // This setup uses 600px as a base and expands to screen height on larger devices.
    <section className="relative h-[600px] md:h-screen w-full flex items-center justify-center overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
        />
      </AnimatePresence>

      {/* Adding a subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text Content Container */}
      <div className="relative z-10 text-center text-white px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[currentSlide].id}
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="max-w-4xl"
          >
            <h1
              className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg"
              style={{ fontFamily: "Quicksand, sans-serif" }}
            >
              {slides[currentSlide].title}
            </h1>
            <p
              className="mt-4 text-base md:text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              {slides[currentSlide].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Left Arrow */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 md:left-8 z-20 bg-black/20 text-white/70 rounded-full hover:bg-black/40 hover:text-white h-10 w-10"
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      {/* Right Arrow */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 md:right-8 z-20 bg-black/20 text-white/70 rounded-full hover:bg-black/40 hover:text-white h-10 w-10"
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Bottom Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-110"
                : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
