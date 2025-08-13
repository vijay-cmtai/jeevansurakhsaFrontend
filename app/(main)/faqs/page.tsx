"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Phone, Mail, MessageCircle, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

// Function to get all FAQ data based on the current language
const getFaqData = (t: (key: string) => string) => [
  {
    id: "membership",
    title: t("faq.section1.title"),
    icon: "👥",
    color: "from-blue-500 to-blue-600",
    questions: [
      { question: t("faq.section1.q1.q"), answer: t("faq.section1.q1.a") },
      { question: t("faq.section1.q2.q"), answer: t("faq.section1.q2.a") },
      { question: t("faq.section1.q3.q"), answer: t("faq.section1.q3.a") },
      { question: t("faq.section1.q4.q"), answer: t("faq.section1.q4.a") },
      { question: t("faq.section1.q5.q"), answer: t("faq.section1.q5.a") },
      { question: t("faq.section1.q6.q"), answer: t("faq.section1.q6.a") },
      { question: t("faq.section1.q7.q"), answer: t("faq.section1.q7.a") },
      { question: t("faq.section1.q8.q"), answer: t("faq.section1.q8.a") },
      { question: t("faq.section1.q9.q"), answer: t("faq.section1.q9.a") },
      { question: t("faq.section1.q10.q"), answer: t("faq.section1.q10.a") },
    ],
  },
  {
    id: "contributions",
    title: t("faq.section2.title"),
    icon: "💰",
    color: "from-green-500 to-green-600",
    questions: [
      { question: t("faq.section2.q1.q"), answer: t("faq.section2.q1.a") },
      { question: t("faq.section2.q2.q"), answer: t("faq.section2.q2.a") },
      { question: t("faq.section2.q3.q"), answer: t("faq.section2.q3.a") },
      { question: t("faq.section2.q4.q"), answer: t("faq.section2.q4.a") },
      { question: t("faq.section2.q5.q"), answer: t("faq.section2.q5.a") },
      { question: t("faq.section2.q6.q"), answer: t("faq.section2.q6.a") },
      { question: t("faq.section2.q7.q"), answer: t("faq.section2.q7.a") },
      { question: t("faq.section2.q8.q"), answer: t("faq.section2.q8.a") },
      { question: t("faq.section2.q9.q"), answer: t("faq.section2.q9.a") },
      // The new question is included here
      { question: t("faq.section2.q10.q"), answer: t("faq.section2.q10.a") },
    ],
  },
  {
    id: "payments",
    title: t("faq.section3.title"),
    icon: "💳",
    color: "from-purple-500 to-purple-600",
    questions: [
      { question: t("faq.section3.q1.q"), answer: t("faq.section3.q1.a") },
      { question: t("faq.section3.q2.q"), answer: t("faq.section3.q2.a") },
      { question: t("faq.section3.q3.q"), answer: t("faq.section3.q3.a") },
      { question: t("faq.section3.q4.q"), answer: t("faq.section3.q4.a") },
      { question: t("faq.section3.q5.q"), answer: t("faq.section3.q5.a") },
      { question: t("faq.section3.q6.q"), answer: t("faq.section3.q6.a") },
      { question: t("faq.section3.q7.q"), answer: t("faq.section3.q7.a") },
      { question: t("faq.section3.q8.q"), answer: t("faq.section3.q8.a") },
    ],
  },
  {
    id: "process",
    title: t("faq.section4.title"),
    icon: "📊",
    color: "from-orange-500 to-orange-600",
    questions: [
      { question: t("faq.section4.q1.q"), answer: t("faq.section4.q1.a") },
      { question: t("faq.section4.q2.q"), answer: t("faq.section4.q2.a") },
      { question: t("faq.section4.q3.q"), answer: t("faq.section4.q3.a") },
      { question: t("faq.section4.q4.q"), answer: t("faq.section4.q4.a") },
      { question: t("faq.section4.q5.q"), answer: t("faq.section4.q5.a") },
      { question: t("faq.section4.q6.q"), answer: t("faq.section4.q6.a") },
      { question: t("faq.section4.q7.q"), answer: t("faq.section4.q7.a") },
      { question: t("faq.section4.q8.q"), answer: t("faq.section4.q8.a") },
    ],
  },
  {
    id: "legal",
    title: t("faq.section5.title"),
    icon: "⚖️",
    color: "from-red-500 to-red-600",
    questions: [
      { question: t("faq.section5.q1.q"), answer: t("faq.section5.q1.a") },
      { question: t("faq.section5.q2.q"), answer: t("faq.section5.q2.a") },
      { question: t("faq.section5.q3.q"), answer: t("faq.section5.q3.a") },
      { question: t("faq.section5.q4.q"), answer: t("faq.section5.q4.a") },
      { question: t("faq.section5.q5.q"), answer: t("faq.section5.q5.a") },
      { question: t("faq.section5.q6.q"), answer: t("faq.section5.q6.a") },
      { question: t("faq.section5.q7.q"), answer: t("faq.section5.q7.a") },
      { question: t("faq.section5.q8.q"), answer: t("faq.section5.q8.a") },
    ],
  },
  {
    id: "support",
    title: t("faq.section6.title"),
    icon: "💬",
    color: "from-indigo-500 to-indigo-600",
    questions: [
      { question: t("faq.section6.q1.q"), answer: t("faq.section6.q1.a") },
      { question: t("faq.section6.q2.q"), answer: t("faq.section6.q2.a") },
      { question: t("faq.section6.q3.q"), answer: t("faq.section6.q3.a") },
      { question: t("faq.section6.q5.q"), answer: t("faq.section6.q5.a") },
      { question: t("faq.section6.q6.q"), answer: t("faq.section6.q6.a") },
      { question: t("faq.section6.q7.q"), answer: t("faq.section6.q7.a") },
      { question: t("faq.section6.q8.q"), answer: t("faq.section6.q8.a") },
    ],
  },
];

export default function FAQsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("all");

  const faqSections = getFaqData(t);

  const searchFilteredSections = faqSections
    .map((section) => ({
      ...section,
      questions: section.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(
      (section) => activeSection === "all" || section.id === activeSection
    )
    .filter((section) => section.questions.length > 0);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="py-32 bg-cover bg-center text-white relative"
        style={{
          backgroundImage:
            "url('https://jeevansamarth.com/wp-content/uploads/2025/03/10.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold">
              {t("faq.hero.title")}
            </h1>
            <div className="flex items-center justify-center space-x-2 text-sm mt-4 text-gray-300">
              <span className="text-orange-400 font-semibold">
                {t("faq.hero.breadcrumbHome")}
              </span>
              <span>•</span>
              <span>{t("faq.hero.breadcrumbFaq")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50 shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full lg:w-auto lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t("faq.search.placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={activeSection === "all" ? "default" : "outline"}
                onClick={() => setActiveSection("all")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${activeSection === "all" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-600 hover:bg-blue-50 border-gray-300"}`}
              >
                {t("faq.search.allTopics")}
              </Button>
              {faqSections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "outline"}
                  onClick={() => setActiveSection(section.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${activeSection === section.id ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-600 hover:bg-blue-50 border-gray-300"}`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchFilteredSections.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {t("faq.search.noResultsTitle")}
              </h3>
              <p className="text-gray-500">
                {t("faq.search.noResultsSubtitle")}
              </p>
            </div>
          ) : (
            searchFilteredSections.map((section, sectionIndex) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <div className="text-center mb-10">
                  <div
                    className={`inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r ${section.color} text-white shadow-lg mb-4`}
                  >
                    <span className="text-2xl mr-3">{section.icon}</span>
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  </div>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
                </div>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <Accordion
                    type="single"
                    collapsible
                    className="divide-y divide-gray-100"
                  >
                    {section.questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${section.id}-${index}`}
                        className="border-0"
                      >
                        <AccordionTrigger className="text-left font-semibold text-gray-800 hover:no-underline px-8 py-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group">
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full bg-gradient-to-r ${section.color} text-white flex items-center justify-center text-sm font-bold mr-4 group-hover:scale-110 transition-transform`}
                            >
                              {index + 1}
                            </div>
                            <span className="group-hover:text-blue-700 transition-colors">
                              {faq.question}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-8 pb-8 pt-2">
                          <div className="ml-12 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-l-4 border-blue-400">
                            <p className="text-gray-700 leading-relaxed text-base">
                              {faq.answer}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <MessageCircle className="h-12 w-12 text-blue-300 mr-4" />
              <h2 className="text-4xl font-bold">{t("faq.support.title")}</h2>
            </div>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t("faq.support.subtitle")}
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.a
                href={`tel:${t("faq.support.phone")}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group"
              >
                <Phone className="h-8 w-8 text-blue-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">
                  {t("faq.support.callUs")}
                </h3>
                <p className="text-blue-200">{t("faq.support.phone")}</p>
              </motion.a>
              <motion.a
                href={`mailto:${t("faq.support.email")}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group"
              >
                <Mail className="h-8 w-8 text-blue-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">
                  {t("faq.support.emailUs")}
                </h3>
                <p className="text-blue-200">{t("faq.support.email")}</p>
              </motion.a>

              {/* === BADLAAV YAHAN KIYA GAYA HAI === */}
              <motion.a
                href="https://wa.me/917816058717" // WhatsApp link
                target="_blank" // Naye tab mein open hoga
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group"
              >
                <MessageCircle className="h-8 w-8 text-blue-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">
                  {t("faq.support.liveChat")}
                </h3>
                <p className="text-blue-200">{t("faq.support.chatHours")}</p>
              </motion.a>
            </div>
            <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-2xl mx-auto">
              <p className="text-blue-100 text-sm">
                <strong>{t("faq.support.hoursLabel")}</strong>{" "}
                {t("faq.support.hoursValue")}
                <br />
                <strong>{t("faq.support.languagesLabel")}</strong>{" "}
                {t("faq.support.languagesValue")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
