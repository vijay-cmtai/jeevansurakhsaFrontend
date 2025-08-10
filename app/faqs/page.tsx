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

export default function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("all");

  const faqSections = [
    {
      id: "membership",
      title: "Membership & Eligibility",
      icon: "👥",
      color: "from-blue-500 to-blue-600",
      questions: [
        {
          question: "Who can join Jeevan Suraksha?",
          answer:
            "Any Indian citizen residing in Telangana & Andhra Pradesh or a permanent resident of Telangana or Andhra Pradesh working anywhere in the world can enroll, provided they are between 18 and 60 years of age and are not terminally ill at the time of enrollment. Membership approval is subject to verification. In exceptional cases that may not be eligible initially, the membership will be declined and the amount refunded. The verification process may take up to one week, with refunds processed within 21 days.",
        },
        {
          question: "Can NRIs join Jeevan Suraksha?",
          answer:
            "Yes, Non-Resident Indians (NRIs) who are permanent residents of Telangana or Andhra Pradesh can join Jeevan Suraksha, provided they meet all other eligibility criteria including age requirements and health conditions.",
        },
        {
          question: "Can I enroll multiple times under different names?",
          answer:
            "No, each individual can only have one active membership under their legal name. Multiple enrollments under different names or identities are strictly prohibited and may result in membership termination.",
        },
        {
          question: "What details are required during enrollment?",
          answer:
            "During enrollment, you need to provide personal details including full name, date of birth, contact information, address proof, PAN card details, nominee information, and employment details. All information must be accurate and verifiable.",
        },
        {
          question: "Can I change my nominee later?",
          answer:
            "Yes, you can change your nominee details by logging into your member portal and updating the nominee information. Changes will be effective after verification and confirmation from our team.",
        },
        {
          question: "Do I need to undergo any medical examination?",
          answer:
            "No medical examination is required for enrollment. However, you must declare any pre-existing terminal illnesses during registration. False declarations may result in claim rejection.",
        },
        {
          question: "What happens if I take a break from contributing?",
          answer:
            "If you miss contributions for more than 3 consecutive claims, your membership may be suspended. You can reactivate by paying the missed contributions along with a reactivation fee.",
        },
        {
          question: "Can I transfer my membership to a family member?",
          answer:
            "Memberships are non-transferable. Each individual must apply separately for their own membership. However, family members can join as separate members.",
        },
        {
          question:
            "What happens if I relocate outside Telangana & Andhra Pradesh?",
          answer:
            "If you relocate permanently outside Telangana & Andhra Pradesh, you can continue your membership but must update your address details in the member portal within 30 days of relocation.",
        },
        {
          question:
            "Can a member move from one collective to another collective?",
          answer:
            "Yes, members can request to move between collectives based on their changed circumstances. The transfer is subject to approval and may involve additional documentation and fees.",
        },
      ],
    },
    {
      id: "contributions",
      title: "Contributions & Payouts",
      icon: "💰",
      color: "from-green-500 to-green-600",
      questions: [
        {
          question:
            "How is the corpus amount of ₹25 lakhs, ₹50 lakhs, or ₹1 crore generated?",
          answer:
            "Jeevan Suraksha is not a term insurance plan but a collective contribution scheme where members contribute to support a fellow member's family in times of need. The fund payout depends on the total contributions from active members at the time. While the goal is to provide ₹25 lakhs, the payout does not guarantee a fixed amount, as it is based on collective participation.",
        },
        {
          question: "How much do I need to contribute per death claim?",
          answer:
            "The contribution amount per death claim varies based on the collective you join and the total number of active members. Generally, contributions range from ₹25 to ₹500 per claim, with the amount decreasing as membership grows.",
        },
        {
          question: "Is there a limit to the number of claims in a year?",
          answer:
            "There is no predetermined limit to the number of claims in a year. The number of claims depends on natural circumstances. However, the collective is designed to handle multiple claims efficiently through the contribution system.",
        },
        {
          question:
            "What happens if multiple members pass away at the same time?",
          answer:
            "In case of multiple simultaneous claims, each claim will be processed separately. Members will be required to contribute for each claim according to the collective's contribution structure.",
        },
        {
          question: "How will my members receive the payout?",
          answer:
            "Payouts are made directly to the nominee's bank account through NEFT/RTGS transfer after verification of all required documents and completion of the claim process.",
        },
        {
          question: "What happens if required contributions are not met?",
          answer:
            "If the required contributions are not met within the specified timeframe, the payout may be delayed until sufficient funds are collected. Members are encouraged to contribute promptly to ensure timely payouts.",
        },
        {
          question: "Are there any exclusions to the payout?",
          answer:
            "Payouts may be excluded in cases of suicide within the first year of membership, death due to pre-existing terminal illnesses not declared during enrollment, or death due to illegal activities.",
        },
        {
          question: "What happens if a member's death is under investigation?",
          answer:
            "If a member's death is under legal investigation, the payout will be held until the investigation is concluded and proper clearance is obtained from relevant authorities.",
        },
        {
          question:
            "Can the trust make changes to the structure of the collective?",
          answer:
            "Yes, the trust reserves the right to make structural changes to ensure the sustainability and effectiveness of the collective. Members will be notified of any significant changes in advance.",
        },
      ],
    },
    {
      id: "payments",
      title: "Membership Payments & Withdrawal",
      icon: "💳",
      color: "from-purple-500 to-purple-600",
      questions: [
        {
          question: "What are the membership fees?",
          answer:
            "The membership fee includes a one-time registration fee of ₹100 and an annual renewal fee of ₹100. These fees cover administrative costs and platform maintenance.",
        },
        {
          question: "How do I pay my contributions?",
          answer:
            "Contributions can be paid through the member portal using various payment methods including UPI, net banking, debit/credit cards, and digital wallets. Payment notifications will be sent via SMS and email.",
        },
        {
          question: "Can I withdraw from the collective?",
          answer:
            "Yes, you can withdraw from the collective at any time by submitting a withdrawal request through the member portal. However, membership fees and contributions made are non-refundable.",
        },
        {
          question: "What happens to my contributions if I withdraw?",
          answer:
            "Contributions made towards previous claims are non-refundable as they have already been disbursed to beneficiaries. Only unused membership fees may be considered for partial refund in exceptional cases.",
        },
        {
          question: "Is there a cooling-off period?",
          answer:
            "Yes, there is a 15-day cooling-off period from the date of enrollment during which you can cancel your membership and receive a full refund of membership fees, provided no claims have been made.",
        },
        {
          question: "How are payment reminders sent?",
          answer:
            "Payment reminders are sent via SMS, email, and push notifications through the mobile app. Reminders are sent 7 days before the due date and continue until payment is made.",
        },
        {
          question: "What happens if I miss a payment deadline?",
          answer:
            "If you miss a payment deadline, a grace period of 15 days is provided. After this period, your membership may be suspended, and reactivation will require payment of pending amounts plus a reactivation fee.",
        },
        {
          question: "Can I pay contributions in advance?",
          answer:
            "Currently, the system is designed for claim-based contributions. Advance payments are not accepted as the contribution amount may vary based on membership size at the time of each claim.",
        },
      ],
    },
    {
      id: "process",
      title: "Process & Tracking",
      icon: "📊",
      color: "from-orange-500 to-orange-600",
      questions: [
        {
          question: "How do I track my membership status?",
          answer:
            "You can track your membership status, contribution history, and claim details through the member portal or mobile app. Real-time updates are provided for all activities related to your membership.",
        },
        {
          question: "What is the claim process?",
          answer:
            "To initiate a claim, the nominee must submit the death certificate, member ID, nominee identification documents, and bank details through the member portal or by contacting our support team. The claim is then verified and processed within 7-10 working days.",
        },
        {
          question: "How long does claim processing take?",
          answer:
            "Claim processing typically takes 7-10 working days from the submission of complete documentation. This includes verification, contribution collection, and fund disbursement to the nominee.",
        },
        {
          question: "Can I track the status of a claim?",
          answer:
            "Yes, claim status can be tracked in real-time through the member portal. You will receive updates at each stage of the claim process, including document verification, contribution collection, and payout processing.",
        },
        {
          question: "What documents are required for claim processing?",
          answer:
            "Required documents include the original death certificate, member ID card, nominee identification proof (Aadhar/PAN), bank account details, and relationship proof if required. All documents must be clear and legible.",
        },
        {
          question: "How will I know when a contribution is required?",
          answer:
            "You will receive immediate notifications via SMS, email, and app notifications when a contribution is required. The notification will include the amount, deadline, and payment instructions.",
        },
        {
          question: "Can I view other members' information?",
          answer:
            "No, member information is confidential and protected. You can only view your own membership details and contribution history. General statistics about the collective may be shared without personal information.",
        },
        {
          question: "How do I update my personal information?",
          answer:
            "Personal information can be updated through the member portal under the 'Profile' section. Some changes may require document verification and approval from the administrative team.",
        },
      ],
    },
    {
      id: "legal",
      title: "Legal & Compliance",
      icon: "⚖️",
      color: "from-red-500 to-red-600",
      questions: [
        {
          question: "Is Jeevan Suraksha legally compliant?",
          answer:
            "Yes, Jeevan Suraksha operates under the legal framework governing collective social security schemes in India. It is registered as a trust and complies with all applicable laws and regulations.",
        },
        {
          question: "What are the terms and conditions?",
          answer:
            "Detailed terms and conditions are available on our website and member portal. These cover membership rules, contribution obligations, claim procedures, and dispute resolution mechanisms. All members must agree to these terms during enrollment.",
        },
        {
          question: "How is member data protected?",
          answer:
            "Member data is protected using industry-standard security measures including encryption, secure servers, and access controls. We comply with data protection regulations and do not share personal information with third parties without consent.",
        },
        {
          question: "What happens in case of disputes?",
          answer:
            "Disputes are resolved through a structured grievance mechanism. Members can raise concerns through the member portal, and unresolved issues are escalated to an independent arbitration panel.",
        },
        {
          question: "Are there any regulatory approvals?",
          answer:
            "Jeevan Suraksha operates as a collective social security scheme under the trust structure. We maintain compliance with all applicable regulations and work closely with legal advisors to ensure ongoing compliance.",
        },
        {
          question: "What is the governing law?",
          answer:
            "The collective is governed by Indian laws, specifically the laws of Telangana state where the trust is registered. Any legal disputes will be subject to the jurisdiction of Telangana courts.",
        },
        {
          question: "How are funds managed and audited?",
          answer:
            "All funds are managed through designated trust accounts and are subject to regular internal and external audits. Financial statements are made available to members annually.",
        },
        {
          question: "What happens if the trust is dissolved?",
          answer:
            "In the unlikely event of trust dissolution, all collected funds will be distributed among active members proportionally after settling any pending claims and administrative expenses.",
        },
      ],
    },
    {
      id: "support",
      title: "Communication & Support",
      icon: "💬",
      color: "from-indigo-500 to-indigo-600",
      questions: [
        {
          question: "How can I contact customer support?",
          answer:
            "Customer support is available through multiple channels: phone (+91 98765 43210), email (support@jeevansuraksha.org), live chat on the website, and through the mobile app. Support is available Monday to Friday, 9 AM to 6 PM.",
        },
        {
          question: "What languages is support available in?",
          answer:
            "Customer support is available in English, Hindi, Telugu, and Tamil. Our support team is trained to assist members in their preferred language for better communication.",
        },
        {
          question: "How do I receive updates about the collective?",
          answer:
            "Updates are sent through SMS, email newsletters, app notifications, and posted on the member portal. You can customize your communication preferences in the member portal settings.",
        },
        {
          question: "Is there a mobile app available?",
          answer:
            "Yes, the Jeevan Suraksha mobile app is available for both Android and iOS devices. The app provides full access to member services, contribution payments, claim tracking, and support features.",
        },
        {
          question: "How often will I receive communications?",
          answer:
            "Regular communications include monthly newsletters, contribution requests when claims arise, annual reports, and important updates. Emergency communications are sent as needed for urgent matters.",
        },
        {
          question: "Can I opt out of certain communications?",
          answer:
            "Yes, you can customize your communication preferences in the member portal. However, certain critical communications related to contributions and claims cannot be opted out of.",
        },
        {
          question: "How do I provide feedback or suggestions?",
          answer:
            "Feedback and suggestions can be submitted through the member portal, mobile app, or by emailing feedback@jeevansuraksha.org. We value member input and regularly review suggestions for service improvements.",
        },
        {
          question: "Are there member meetings or events?",
          answer:
            "Yes, we organize quarterly member meetings in major cities and annual general meetings. These events provide opportunities for members to interact, learn about collective performance, and provide feedback.",
        },
      ],
    },
  ];

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
        className="py-32 bg-cover bg-center text-white relative" // py-24 को py-32 कर दिया है
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
            <h1 className="text-5xl md:text-6xl font-bold">FAQ</h1>
            <div className="flex items-center justify-center space-x-2 text-sm mt-4 text-gray-300">
              <span className="text-orange-400 font-semibold">HOME</span>
              <span>•</span>
              <span>FAQ</span>
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
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl w-full"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={activeSection === "all" ? "default" : "outline"}
                onClick={() => setActiveSection("all")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeSection === "all"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-blue-50 border-gray-300"
                }`}
              >
                All Topics
              </Button>
              {faqSections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "outline"}
                  onClick={() => setActiveSection(section.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-blue-50 border-gray-300"
                  }`}
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
                No FAQs found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms or browse all categories.
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
              <h2 className="text-4xl font-bold">Still Have Questions?</h2>
            </div>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              Our dedicated support team is here to help you with any additional
              questions or concerns about your membership.
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.a
                href="tel:+919876543210"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group"
              >
                <Phone className="h-8 w-8 text-blue-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-blue-200">+91 98765 43210</p>
              </motion.a>

              <motion.a
                href="mailto:support@jeevansuraksha.org"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group"
              >
                <Mail className="h-8 w-8 text-blue-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-blue-200">support@jeevansuraksha.org</p>
              </motion.a>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group"
              >
                <MessageCircle className="h-8 w-8 text-blue-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-blue-200">Available 9 AM - 6 PM</p>
              </motion.div>
            </div>

            <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-2xl mx-auto">
              <p className="text-blue-100 text-sm">
                <strong>Support Hours:</strong> Monday to Friday, 9:00 AM - 6:00
                PM IST
                <br />
                <strong>Languages:</strong> English, Hindi, Telugu, Tamil
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
