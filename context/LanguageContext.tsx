"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type LanguageCode = "en" | "te";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// --- English Translations ---
const enTranslations: Record<string, string> = {
  // Common Buttons
  "common.button.readMore": "Read More",
  "common.button.registerNow": "REGISTER NOW",
  "common.button.login": "Login",
  "common.button.applyMembership": "Join Community",
  "common.button.donateUs": "Donate Us",

  // Navbar
  "navbar.home": "Home",
  "navbar.whoWeAre": "Who We Are",
  "navbar.ourTeam": "Our Team",
  "navbar.faqs": "FAQ'S",
  "navbar.collectives": "Our Collectives",
  "navbar.itGovtCollective": "IT & Govt. Employees Collective",
  "navbar.privateBusinessCollective": "Private Employees & Business Owners",
  "navbar.reportClaim": "Report Claim",
  "navbar.donate": "Donate Us",
  "language.english": "English",
  "language.telugu": "Telugu",

  // Top Header
  "topHeader.phone": "+91-78160 58717",
  "topHeader.email": "info@jeevansuraksha.org",

  // Hero Section
  "hero.title": "Jeevan Suraksha Social Security Collective",
  "hero.subtitle":
    "Jeevan Suraksha Social Security Collective, an initiative of Health Guard Foundation, is a community-driven initiative designed to provide financial support to families during their most challenging times.",

  // About Section
  "about.title": "About Our Initiative",
  "about.p1":
    "Jeevan Suraksha Social Security Collective is a revolutionary approach to community-based financial security. We believe that when people come together, they can create a safety net that protects everyone in times of need.",
  "about.p2":
    "Our collective operates on the principle of mutual support, where small contributions from many members create substantial financial assistance for families facing the loss of a loved one.",
  "about.p3":
    "Through transparent operations and community-driven governance, we ensure that every member feels secure knowing their family will be supported when it matters most.",

  // How It Works Section
  "howItWorks.title": "How It Works?",
  "howItWorks.step1": "Pay registration fee ₹100 and renewal ₹100",
  "howItWorks.step2": "Scheme starts with 1,000 members",
  "howItWorks.step3": "Contributions only after a member passes (₹500 onwards)",
  "howItWorks.step4": "Funds are disbursed directly to nominee",
  "howItWorks.portalInfo":
    "Jeevan Suraksha portal allows members to track contributions and payments.",
  "howItWorks.joinToday": "Join today and be part of a community that cares!",

  // Mission Section
  "mission.title": "Our Mission",
  "mission.text":
    "To build a caring and supportive community where members stand together to provide financial security to beneficiaries through small contributions.",

  // Collectives Section
  "collectives.title": "Multiple Collectives for Different Member Groups",
  "collectives.subtitle":
    "Different collectives based on financial capacity and preferences.",
  "collectives.item1.title": "IT Professionals & Govt. Employees",
  "collectives.item1.desc":
    "Tailored for professionals in technology and government sectors with higher contribution capacity.",
  "collectives.item2.title": "General Public & Business Owners",
  "collectives.item2.desc":
    "Designed for the general public and small business owners seeking affordable security.",
  "collectives.item3.title": "Other Collectives (Upcoming)",
  "collectives.item3.desc":
    "More specialized collectives coming soon based on community needs and feedback.",

  // Why Join Section
  "whyJoin.title": "Why Join Jeevan Suraksha Social Security Collective?",
  "whyJoin.feature1.title": "Financial Security",
  "whyJoin.feature1.desc":
    "Ensure your family is protected in unforeseen circumstances.",
  "whyJoin.feature2.title": "Transparent Operations",
  "whyJoin.feature2.desc":
    "No middlemen; direct transfers to the needy patient.",
  "whyJoin.feature3.title": "Community Strength",
  "whyJoin.feature3.desc":
    "Be part of a network that supports each other in times of need.",
  "whyJoin.feature4.title": "Quick Disbursement",
  "whyJoin.feature4.desc": "Funds are distributed promptly after verification.",
  "whyJoin.feature5.title": "Affordable Model",
  "whyJoin.feature5.desc":
    "Start small, contribute less over time, and benefit from collective security.",
  "whyJoin.feature6.title": "Membership Growth Benefits Everyone",
  "whyJoin.feature6.desc": "More members mean lower contributions per case.",

  // Contribution Table Section
  "contribution.table.title":
    "Contribution Calculation Based on Membership Growth",
  "contribution.table.subtitle":
    "The total amount collected per case depends on the number of active members contributing. Below is an estimate of how the per-member contribution reduces as membership increases:",
  "contribution.table.header1": "Total Members",
  "contribution.table.header2": "Contribution Per Member (₹)",
  "contribution.table.header3": "Total Collected Fund (₹)",
  "contribution.table.illustration": "Illustration Table",

  // CTA Banner
  "cta.title": "Be Part of the Change",
  "cta.subtitle":
    "Join us in building a collective that stands by you and your loved ones. Secure your family's future today!",

  // Footer
  "footer.about":
    "A community-driven initiative providing financial security through collective support and mutual care during challenging times.",
  "footer.contactInfo": "Contact Information",
  "footer.address":
    "Health Guard Foundation\n1-63, Amadabakula (Village),\nKothakota (Mandal), Wanaparty (District),\nTelangana, India - 509381",
  "footer.quickLinks": "Quick Links",
  "footer.link.home": "Home",
  "footer.link.about": "About Us",
  "footer.link.faq": "FAQ",
  "footer.link.collectives": "Collectives",
  "footer.link.contact": "Contact",
  "footer.link.terms": "Terms & Condition",
  "footer.link.privacy": "Privacy Policy",
  "footer.link.reportClaim": "Report Claim",
  "footer.link.refund": "Refund and Return Policy",
  "footer.link.volunteers": "Volunteers",
  "footer.copyright":
    "© {year} Jeevan Suraksha Social Security Collective. All rights reserved.",

  // Who We Are Page
  "whoWeAre.hero.title": "About Us",
  "whoWeAre.hero.breadcrumbHome": "HOME",
  "whoWeAre.hero.breadcrumbAbout": "ABOUT US",
  "whoWeAre.about.title": "About Us",
  "whoWeAre.about.p1":
    "Jeevan Suraksha Social Security Collective, an initiative of Health Guard Foundation, is a community-driven initiative designed to provide financial support to families during their most challenging times. By uniting individuals under a collective social security model, we ensure that each member contributes a small amount to create a substantial fund that supports the family of a fellow member.",
  "whoWeAre.about.p2":
    "We are managing multiple collectives to extend this support to every segment of society because every family and every life is invaluable. Our mission is to safeguard families from financial distress after the loss of their primary earner, fostering a compassionate and resilient community. With many individuals contributing a small amount, we create a robust safety net that delivers a significant impact. Together, we ensure that no one faces hardship alone.",
  "whoWeAre.mission.title": "Our Mission is to Help People",
  "whoWeAre.mission.tab1": "What is Health Guard Foundation?",
  "whoWeAre.mission.tab2": "Our Mission",
  "whoWeAre.mission.tab3": "Our Vision",
  "whoWeAre.mission.foundationTitle": "What is Health Guard Foundation?",

  "whoWeAre.mission.foundationP1":
    "Health Guard Foundation (HGF), an NGO registered in Telangana, India, founded by IT Employees with the vision of creating a community-driven safety net. HGF aim to provide instant financial assistance to individuals during health crises, regardless of their background or income level.",
  "whoWeAre.mission.foundationP2":
    "Our initiative is simple yet powerful—members contribute ₹2010 per month, pooling resources into a common fund. When a medical emergency strikes, this fund becomes a lifeline, ensuring that urgent care is accessible without financial stress.",

  "whoWeAre.mission.missionTitle": "Our Mission",
  "whoWeAre.mission.missionP":
    "To build a caring and supportive community where members stand together to provide financial security to beneficiaries through small contributions, ensuring no family faces hardship alone during their most challenging times.",
  "whoWeAre.mission.visionTitle": "Our Vision",
  "whoWeAre.mission.visionP":
    "To create a nationwide network of social security collectives that provides comprehensive financial protection to every family, fostering a society where mutual support and community care are the foundation of security.",
  // Our Team Page
  "ourTeam.hero.title": "Our Team",
  "ourTeam.hero.breadcrumbHome": "HOME",
  "ourTeam.hero.breadcrumbOurTeam": "OUR TEAM",
  "ourTeam.tabs.ourTeam": "Our Team",
  "ourTeam.tabs.board": "Board",
  "ourTeam.tabs.advisors": "Advisors",
  "ourTeam.card.altPrefix": "Profile of ",
  "ourTeam.noMembers": "No members in this category yet.",

  // Team Member Details
  "ourTeam.member1.name": "MOHAMMED ALI IRSHAD",
  "ourTeam.member1.role": "CHAIRMAN & MANAGING TRUSTEE",
  "ourTeam.member2.name": "SHIVA SWAROOP GOUD",
  "ourTeam.member2.role": "TRUSTEE & CHIEF OPERATING OFFICER",
  "ourTeam.member3.name": "SHAIK KHALEEL",
  "ourTeam.member3.role": "PROGRAM MANAGER",
  "ourTeam.member4.name": "PANUGANTI KRISHNAIAH",
  "ourTeam.member4.role": "CHIEF RELATIONS OFFICER",
  "ourTeam.member5.name": "GAWHAR SALEEM ZEESHAN",
  "ourTeam.member5.role": "ADVISORY BOARD MEMBER",
  "ourTeam.member6.name": "MOHAMMED SHAFI",
  "ourTeam.member6.role": "ADVISORY BOARD MEMBER",
  "ourTeam.member7.name": "Lakshmikanth Madhavaram",
  "ourTeam.member7.role": "ADVISORY BOARD MEMBER",

  // FAQ Page
  "faq.hero.title": "FAQ",
  "faq.hero.breadcrumbHome": "HOME",
  "faq.hero.breadcrumbFaq": "FAQ",
  "faq.search.placeholder": "Search FAQs...",
  "faq.search.allTopics": "All Topics",
  "faq.search.noResultsTitle": "No FAQs found",
  "faq.search.noResultsSubtitle":
    "Try adjusting your search terms or browse all categories.",
  "faq.support.title": "Still Have Questions?",
  "faq.support.subtitle":
    "Our dedicated support team is here to help you with any additional questions or concerns about your membership.",
  "faq.support.callUs": "Call Us",
  "faq.support.emailUs": "Email Us",
  "faq.support.liveChat": "Live Chat",
  "faq.support.chatHours": "Available 9 AM - 6 PM",
  "faq.support.hoursLabel": "Support Hours:",
  "faq.support.hoursValue": "Monday to Friday, 9:00 AM - 6:00 PM IST",
  "faq.support.languagesLabel": "Languages:",
  "faq.support.languagesValue": "English, Hindi, Telugu, Tamil",
  "faq.support.phone": "+91 78160 58717",
  "faq.support.email": "support@jeevansuraksha.org",

  // FAQ Section Titles
  "faq.section1.title": "Membership & Eligibility",
  "faq.section2.title": "Contributions & Payouts",
  "faq.section3.title": "Membership Payments & Withdrawal",
  "faq.section4.title": "Process & Tracking",
  "faq.section5.title": "Legal & Compliance",
  "faq.section6.title": "Communication & Support",

  // Section 1: Membership & Eligibility
  "faq.section1.q1.q": "Who can join Jeevan Suraksha?",
  "faq.section1.q1.a":
    "Indian citizens who currently reside in Telangana, Andhra Pradesh, Karnataka, or Tamil Nadu, or are permanent residents of any of these states working anywhere in the world, are eligible to apply, provided they meet the following conditions,Age between 18 and 60yearsNot terminally ill at the time of enrolment Important Notes:All applications are subject to a verification process, which may take up to one week.In exceptional cases where eligibility cannot be confirmed, the application will be declined, and the full amount refunded.Refunds will be processed within 21 days of rejection.Payouts will be processed separately for each state, in accordance with the respective state’s members.",
  "faq.section1.q2.q": "Can NRIs join Jeevan Suraksha?",
  "faq.section1.q2.a":
    "Yes, Non-Resident Indians (NRIs) who are permanent residents of Telangana, Andhra Pradesh, Karnataka & Tamil Nadu can join Jeevan Suraksha, provided they meet all other eligibility criteria including age requirements and health conditions.",
  "faq.section1.q3.q": "Can I enroll multiple times under different names?",
  "faq.section1.q3.a":
    "No, each individual can only have one active membership under their legal name. Multiple enrollments under different names or identities are strictly prohibited and may result in membership termination.",
  "faq.section1.q4.q": "What details are required during enrollment?",
  "faq.section1.q4.a":
    "During enrollment, you need to provide personal details including full name, date of birth, contact information, address proof, PAN card details, nominee information, and employment details. All information must be accurate and verifiable.",
  "faq.section1.q5.q": "Can I change my nominee later?",
  "faq.section1.q5.a":
    "Yes, you can change your nominee details by logging into your member portal and updating the nominee information. Changes will be effective after verification and confirmation from our team.",
  "faq.section1.q6.q": "Do I need to undergo any medical examination?",
  "faq.section1.q6.a":
    "No medical examination is required for enrollment. However, you must declare any pre-existing terminal illnesses during registration. False declarations may result in claim rejection.",
  "faq.section1.q7.q": "What happens if I take a break from contributing?",
  "faq.section1.q7.a":
    "If you miss contributions for more than 3 consecutive claims, your membership may be suspended. You can reactivate by paying the missed contributions along with a reactivation fee.",
  "faq.section1.q8.q": "Can I transfer my membership to a family member?",
  "faq.section1.q8.a":
    "Memberships are non-transferable. Each individual must apply separately for their own membership. However, family members can join as separate members.",
  "faq.section1.q9.q":
    "What happens if I relocate outside Telangana, Andhra Pradesh, Karnataka & Tamil Nadu?",
  "faq.section1.q9.a":
    "If you relocate permanently outside Telangana, Andhra Pradesh, Karnataka & Tamil Nadu, you can continue your membership but must update your address details in the member portal within 30 days of relocation.",
  "faq.section1.q10.q":
    "Can a member move from one collective to another collective?",
  "faq.section1.q10.a":
    "Members may request to transfer between collectives due to changed circumstances; however, any transfer is subject to prior written approval and may require additional documentation and applicable fees.",

  // Section 2: Contributions & Payouts
  "faq.section2.q1.q":
    "How is the corpus amount of ₹25 lakhs, ₹50 lakhs, or ₹1 crore generated?",
  "faq.section2.q1.a":
    "Jeevan Suraksha is not a term insurance plan. It is a collective contribution scheme where members voluntarily contribute to a common fund to support the families of fellow members in times of need. The payout amount is determined by the total contributions from active members at the time of the claim. While the objective is to provide a payout ranging from ₹25 lakhs to ₹1 crore, the actual amount received may vary based on collective participation and available funds.The scheme operates in various states, including Telangana, Andhra Pradesh, Karnataka, and Tamil Nadu. Each state's collective operates independently, and the availability and payout amounts may differ based on regional participation and contributions. For example, the Telangana collective's payout depends on the number of Telangana members in each collective.",
  "faq.section2.q2.q": "How much do I need to contribute per death claim?",
  "faq.section2.q2.a":
    "The contribution amount per death claim varies based on the collective you join and the total number of active members. Generally, contributions range from ₹25 to ₹500 per claim, with the amount decreasing as membership grows.",
  "faq.section2.q3.q": "Is there a limit to the number of claims in a year?",
  "faq.section2.q3.a":
    "There is no predetermined limit to the number of claims in a year. The number of claims depends on natural circumstances. However, the collective is designed to handle multiple claims efficiently through the contribution system.",
  "faq.section2.q4.q":
    "What happens if multiple members pass away at the same time?",
  "faq.section2.q4.a":
    "In case of multiple simultaneous claims, each claim will be processed separately. Members will be required to contribute for each claim according to the collective's contribution structure.",
  "faq.section2.q5.q": "How will my members receive the payout?",
  "faq.section2.q5.a":
    "Payouts are made directly to the nominee's bank account through NEFT/RTGS transfer after verification of all required documents and completion of the claim process.",
  "faq.section2.q6.q": "What happens if required contributions are not met?",
  "faq.section2.q6.a":
    "If the required contributions are not met within the specified timeframe, the payout may be delayed until sufficient funds are collected. Members are encouraged to contribute promptly to ensure timely payouts.",
  "faq.section2.q7.q": "Are there any exclusions to the payout?",
  "faq.section2.q7.a":
    "Payouts may be excluded in cases of suicide within the first year of membership, death due to pre-existing terminal illnesses not declared during enrollment, or death due to illegal activities.",
  "faq.section2.q8.q":
    "What happens if a member's death is under investigation?",
  "faq.section2.q8.a":
    "If a member's death is under legal investigation, the payout will be held until the investigation is concluded and proper clearance is obtained from relevant authorities.",
  "faq.section2.q9.q":
    "Can the trust make changes to the structure of the collective?",
  "faq.section2.q9.a":
    "Yes, the trust reserves the right to make structural changes to ensure the sustainability and effectiveness of the collective. Members will be notified of any significant changes in advance.",
  "faq.section2.q10.q":
    "How is the payout amount determined if contributors are from different states?",
  "faq.section2.q10.a":
    "Payouts are calculated separately for each state and depend only on the number of active contributing members from the nominee's state at the time of the claim. Contributions from members of other states are not included in the payout.",

  // Section 3: Membership Payments & Withdrawal
  "faq.section3.q1.q": "What are the membership fees?",
  "faq.section3.q1.a":
    "The membership fee includes a one-time registration fee of ₹100 and an annual renewal fee of ₹100. These fees cover administrative costs and platform maintenance.",
  "faq.section3.q2.q": "How do I pay my contributions?",
  "faq.section3.q2.a":
    "Contributions can be paid through the member portal using various payment methods including UPI, net banking, debit/credit cards, and digital wallets. Payment notifications will be sent via SMS and email.",
  "faq.section3.q3.q": "Can I withdraw from the collective?",
  "faq.section3.q3.a":
    "Yes, you can withdraw from the collective at any time by submitting a withdrawal request through the member portal. However, membership fees and contributions made are non-refundable.",
  "faq.section3.q4.q": "What happens to my contributions if I withdraw?",
  "faq.section3.q4.a":
    "Contributions made towards previous claims are non-refundable as they have already been disbursed to beneficiaries. Only unused membership fees may be considered for partial refund in exceptional cases.",
  "faq.section3.q5.q": "Is there a cooling-off period?",
  "faq.section3.q5.a":
    "Upon joining the Jeevan Suraksha scheme, there is a 90-day cooling-off period during which no claims can be made. This period allows for the identification of any members who may have joined with pre-existing terminal illnesses, ensuring the integrity of the collective fund. After this 90-day period, members become eligible to file claims, provided all other conditions are met.",
  "faq.section3.q6.q": "How are payment reminders sent?",
  "faq.section3.q6.a":
    "Payment reminders are sent via SMS, email, and push notifications through the mobile app. Reminders are sent 7 days before the due date and continue until payment is made.",
  "faq.section3.q7.q": "What happens if I miss a payment deadline?",
  "faq.section3.q7.a":
    "If you miss a payment deadline, a grace period of 15 days is provided. After this period, your membership may be suspended, and reactivation will require payment of pending amounts plus a reactivation fee.",
  "faq.section3.q8.q": "Can I pay contributions in advance?",
  "faq.section3.q8.a":
    "Currently, the system is designed for claim-based contributions. Advance payments are not accepted as the contribution amount may vary based on membership size at the time of each claim.",

  // Section 4: Process & Tracking
  "faq.section4.q1.q": "How do I track my membership status?",
  "faq.section4.q1.a":
    "You can track your membership status, contribution history, and claim details through the member portal or mobile app. Real-time updates are provided for all activities related to your membership.",
  "faq.section4.q2.q": "What is the claim process?",
  "faq.section4.q2.a":
    "To initiate a claim, the nominee must submit the death certificate, member ID, nominee identification documents, and bank details through the member portal or by contacting our support team. The claim is then verified and processed within 7-10 working days.",
  "faq.section4.q3.q": "How long does claim processing take?",
  "faq.section4.q3.a":
    "Claim processing typically takes 7-10 working days from the submission of complete documentation. This includes verification, contribution collection, and fund disbursement to the nominee.",
  "faq.section4.q4.q": "Can I track the status of a claim?",
  "faq.section4.q4.a":
    "Yes, claim status can be tracked in real-time through the member portal. You will receive updates at each stage of the claim process, including document verification, contribution collection, and payout processing.",
  "faq.section4.q5.q": "What documents are required for claim processing?",
  "faq.section4.q5.a":
    "Required documents include the original death certificate, member ID card, nominee identification proof (Aadhar/PAN), bank account details, and relationship proof if required. All documents must be clear and legible.",
  "faq.section4.q6.q": "How will I know when a contribution is required?",
  "faq.section4.q6.a":
    "You will receive immediate notifications via SMS, email, and app notifications when a contribution is required. The notification will include the amount, deadline, and payment instructions.",
  "faq.section4.q7.q": "Can I view other members' information?",
  "faq.section4.q7.a":
    "No, member information is confidential and protected. You can only view your own membership details and contribution history. General statistics about the collective may be shared without personal information.",
  "faq.section4.q8.q": "How do I update my personal information?",
  "faq.section4.q8.a":
    "Personal information can be updated through the member portal under the 'Profile' section. Some changes may require document verification and approval from the administrative team.",

  // Section 5: Legal & Compliance
  "faq.section5.q1.q": "Is Jeevan Suraksha legally compliant?",
  "faq.section5.q1.a":
    "Jeevan Suraksha is a collective contribution scheme initiated by the Health Guard Foundation, a registered trust in Telangana. The foundation holds 12A and 80G certifications, ensuring compliance with Indian tax laws and enabling donors to claim tax exemptions. It operates under the legal framework governing Trusts in India.",
  "faq.section5.q2.q": "What are the terms and conditions?",
  "faq.section5.q2.a":
    "Detailed terms and conditions are available on our website and member portal. These cover membership rules, contribution obligations, claim procedures, and dispute resolution mechanisms. All members must agree to these terms during enrollment.",
  "faq.section5.q3.q": "How is member data protected?",
  "faq.section5.q3.a":
    "Member data is protected using industry-standard security measures including encryption, secure servers, and access controls. We comply with data protection regulations and do not share personal information with third parties without consent.",
  "faq.section5.q4.q": "What happens in case of disputes?",
  "faq.section5.q4.a":
    "Disputes are resolved through a structured grievance mechanism. Members can raise concerns through the member portal, and unresolved issues are escalated to an independent arbitration panel.",
  "faq.section5.q5.q": "Are there any regulatory approvals?",
  "faq.section5.q5.a":
    "Jeevan Suraksha operates as a collective social security scheme under the trust structure. We maintain compliance with all applicable regulations and work closely with legal advisors to ensure ongoing compliance.",
  "faq.section5.q6.q": "What is the governing law?",
  "faq.section5.q6.a":
    "The collective is governed by Indian laws, specifically the laws of Telangana state where the trust is registered. Any legal disputes will be subject to the jurisdiction of Telangana courts.",
  "faq.section5.q7.q": "How are funds managed and audited?",
  "faq.section5.q7.a":
    "All funds are managed through designated trust accounts and are subject to regular internal and external audits. Financial statements are made available to members annually.",
  "faq.section5.q8.q": "What happens if the trust is dissolved?",
  "faq.section5.q8.a":
    "In the unlikely event of trust dissolution, all collected funds will be distributed among active members proportionally after settling any pending claims and administrative expenses.",

  // Section 6: Communication & Support
  "faq.section6.q1.q": "How can I contact customer support?",
  "faq.section6.q1.a":
    "Customer support is available through multiple channels: phone / WhatsApp (+91 78160 58717), email (support@jeevansuraksha.org), live chat on the website, and through the mobile app. Support is available Monday to Friday, 9 AM to 6 PM.",
  "faq.section6.q2.q": "What languages is support available in?",
  "faq.section6.q2.a":
    "Customer support is available in English, Hindi, Telugu, and Tamil. Our support team is trained to assist members in their preferred language for better communication.",
  "faq.section6.q3.q": "How do I receive updates about the collective?",
  "faq.section6.q3.a":
    "Updates are sent through SMS, email newsletters, app notifications, and posted on the member portal. You can customize your communication preferences in the member portal settings.",
  "faq.section6.q5.q": "How often will I receive communications?",
  "faq.section6.q5.a":
    "Regular communications include monthly newsletters, contribution requests when claims arise, annual reports, and important updates. Emergency communications are sent as needed for urgent matters.",
  "faq.section6.q6.q": "Can I opt out of certain communications?",
  "faq.section6.q6.a":
    "Yes, you can customize your communication preferences in the member portal. However, certain critical communications related to contributions and claims cannot be opted out of.",
  "faq.section6.q7.q": "How do I provide feedback or suggestions?",
  "faq.section6.q7.a":
    "Feedback and suggestions can be submitted through the member portal, mobile app, or by emailing feedback@jeevansuraksha.org. We value member input and regularly review suggestions for service improvements.",
  "faq.section6.q8.q": "Are there member meetings or events?",
  "faq.section6.q8.a":
    "Yes, we organize quarterly member meetings in major cities and annual general meetings. These events provide opportunities for members to interact, learn about collective performance, and provide feedback.",
  // Report Claim Page
  "reportClaim.hero.title": "Report a Claim",
  "reportClaim.hero.breadcrumbHome": "HOME",
  "reportClaim.hero.breadcrumbReportClaim": "REPORT CLAIM",

  "reportClaim.form.title": "Report Claim Form",
  "reportClaim.form.subtitle":
    "To report the demise of a member, please fill out the form below with accurate details.",
  "reportClaim.form.label.registrationNo": "Deceased Member's Registration No.",
  "reportClaim.form.label.deceasedPhoto": "Deceased Member's Photo",
  "reportClaim.form.label.dateOfDeath": "Date of Death",
  "reportClaim.form.label.deathCertificate": "Death Certificate (PDF/Image)",
  "reportClaim.form.heading.nominee": "Nominee Details",
  "reportClaim.form.label.nomineeName": "Nominee's Full Name (as per bank)",
  "reportClaim.form.label.nomineeAccount": "Nominee's Bank Account Number",
  "reportClaim.form.button.submit": "Submit Claim",
  "reportClaim.form.button.submitting": "Submitting...",
  "reportClaim.form.error.required": "This field is required",
  "reportClaim.form.success":
    "Claim reported successfully! We will review it shortly.",
  "reportClaim.form.error.general": "Failed to report claim. Please try again.",

  "reportClaim.activeClaims.title": "Active Claims",
  "reportClaim.activeClaims.subtitle":
    "Contribute to support the families of our departed members.",
  "reportClaim.activeClaims.loading": "Loading active claims...",
  "reportClaim.activeClaims.noClaims": "No active claims at the moment.",
  "reportClaim.activeClaims.deceased": "Deceased Name & Photo",
  "reportClaim.activeClaims.nominee": "Nominee Name",
  "reportClaim.activeClaims.plan": "Contribution Plan",
  "reportClaim.activeClaims.amount": "Contribution Amount Required",

  // IT & Govt Collective Page
  "itGovtCollective.hero.title": "IT & Govt. Employees Collective",
  "itGovtCollective.hero.breadcrumbHome": "HOME",
  "itGovtCollective.hero.breadcrumbCollective":
    "IT & GOVT. EMPLOYEES COLLECTIVE",
  "itGovtCollective.intro.title":
    "₹1 Crore & ₹50 Lakhs Collectives – IT & Govt. Employees",
  "itGovtCollective.intro.description":
    "The ₹1 Crore & ₹50 Lakhs Collectives are a support initiative exclusively for IT professionals and government employees. The goal is to create a financial safety net for the families of members in case of an unfortunate demise. Each member pledges to contribute a small amount when a fellow member passes away, ensuring their family receives support immediately.",
  "itGovtCollective.howItWorks.title": "How It Works",
  "itGovtCollective.howItWorks.card1.title": "Membership Enrollment",
  "itGovtCollective.howItWorks.card1.description":
    "IT professionals and Government employees can join this collective by paying a nominal registration and an annual renewal fee of ₹100/-. Need to upload their valid employee ID and nominee details.",
  "itGovtCollective.howItWorks.card2.title": "Pledge to Support",
  "itGovtCollective.howItWorks.card2.description":
    "Each member pledges to contribute a specific amount upon the unfortunate demise of a fellow member.",
  "itGovtCollective.howItWorks.card3.title": "Fund Transfer",
  "itGovtCollective.howItWorks.card3.description":
    "Once a member's demise is verified, all other members contribute their pledged amount, and the total fund is transferred directly to the nominee of the deceased member.",
  "itGovtCollective.howItWorks.card4.title": "Threshold for Launch",
  "itGovtCollective.howItWorks.card4.description":
    "The collective will officially launch once a minimum of 1,000 members have enrolled.",
  "itGovtCollective.howItWorks.card5.title":
    "Decreasing Contribution Over Time",
  "itGovtCollective.howItWorks.card5.description":
    "As the number of members grows, the individual contribution per demise will reduce while ensuring the total collected fund reaches the goal.",
  "itGovtCollective.table.title1Cr":
    "Contribution Table – Illustration Purpose – ₹1 Crore Collective",
  "itGovtCollective.table.title50L":
    "Contribution Table – Illustration Purpose – ₹50 Lakhs Collective",
  "itGovtCollective.table.headerMembers": "Number of Members",
  "itGovtCollective.table.headerContribution": "Contribution Per Member (₹)",
  "itGovtCollective.table.headerCorpus": "Total Corpus Raised (₹)",
  "itGovtCollective.benefits.title": "Key Benefits",
  "itGovtCollective.benefits.item1":
    "<strong>Affordable Contribution:</strong> The larger the collective, the lower the per-person contribution.",
  "itGovtCollective.benefits.item2":
    "<strong>Direct & Transparent:</strong> Funds go directly to the deceased member's nominee without intermediaries.",
  "itGovtCollective.benefits.item3":
    "<strong>Strong Community Support:</strong> A collective effort ensuring financial security among IT and government employees.",
  "itGovtCollective.pledge.title": "Pledge",
  "itGovtCollective.pledge.item1":
    "<strong>Support Fellow Members:</strong> Contributing promptly and consistently to this collective's fund.",
  "itGovtCollective.pledge.item2":
    "<strong>Maintain Integrity:</strong> Providing accurate personal information and adhering to the collective's guidelines.",
  "itGovtCollective.pledge.item3":
    "<strong>Promote Transparency:</strong> Engaging in open communication and participating in decision-making processes.",
  "itGovtCollective.pledge.item4":
    "<strong>Foster Community Growth:</strong> Encouraging others to join and strengthen our collective.",
  "itGovtCollective.pledge.item5":
    "<strong>Respect Confidentiality:</strong> Honouring the privacy of fellow members with utmost care.",
  "itGovtCollective.pledge.item6":
    "<strong>Demonstrate Solidarity:</strong> Recognizing that our strength lies in unity, I will stand with my fellow members.",
  "itGovtCollective.disclaimer.title": "Important Disclaimer",
  "itGovtCollective.disclaimer.item1":
    "The total contribution per claim depends on the number of active contributors at the time of the request.",
  "itGovtCollective.disclaimer.item2":
    "The full claim value promises the IT & Govt. plan is assured; the actual amount depends on contributions received.",
  "itGovtCollective.disclaimer.item3":
    "If the required amount is not collected, the nominee will receive only the total contributed by the active members.",

  // Private & Business Collective Page
  "privateCollective.hero.title": "Private Employees & Business Owners",
  "privateCollective.hero.breadcrumbHome": "HOME",
  "privateCollective.hero.breadcrumbCollective":
    "PRIVATE EMPLOYEES & BUSINESS OWNERS",
  "privateCollective.intro.title":
    "₹1 Crore, ₹50 Lakhs & ₹25 Lakhs Collectives – Private Employees & Business Owners",
  "privateCollective.intro.description":
    "The ₹1 Crore, ₹50 Lakhs, & ₹25 Lakhs Collectives are a support initiative exclusively for all private employees and business owners. The goal is to create a financial safety net for the families of members in case of an unfortunate demise. Each member pledges to contribute a small amount when a fellow member passes away, ensuring their family receives support immediately.",
  "privateCollective.howItWorks.title": "How It Works",
  "privateCollective.howItWorks.card1.title": "Membership Enrollment",
  "privateCollective.howItWorks.card1.description":
    "General Public & Business owners can join this collective by paying a nominal registration and an annual renewal fee of ₹100/-. Need to upload their Aadhaar/VoterId/License/Passport, etc., and nominee details.",
  "privateCollective.howItWorks.card2.title": "Pledge to Support",
  "privateCollective.howItWorks.card2.description":
    "Each member pledges to contribute a specific amount upon the unfortunate demise of a fellow member.",
  "privateCollective.howItWorks.card3.title": "Fund Transfer",
  "privateCollective.howItWorks.card3.description":
    "Once a member's demise is verified, all other members contribute their pledged amount, and the total fund is transferred directly to the nominee of the deceased member.",
  "privateCollective.howItWorks.card4.title": "Threshold for Launch",
  "privateCollective.howItWorks.card4.description":
    "The collective will officially launch once a minimum of 1,000 members have enrolled.",
  "privateCollective.howItWorks.card5.title":
    "Decreasing Contribution Over Time",
  "privateCollective.howItWorks.card5.description":
    "As the number of members grows, the individual contribution per demise will reduce while ensuring the total collected fund reaches the goal.",
  "privateCollective.table.title1Cr":
    "Contribution Table – Illustration Purpose – ₹1 Crore Collective",
  "privateCollective.table.title50L":
    "Contribution Table – Illustration Purpose – ₹50 Lakhs Collective",
  "privateCollective.table.title25L":
    "Contribution Table – Illustration Purpose – ₹25 Lakhs Collective",
  "privateCollective.table.headerMembers": "Number of Members",
  "privateCollective.table.headerContribution": "Contribution Per Member (₹)",
  "privateCollective.table.headerCorpus": "Total Corpus Raised (₹)",
  "privateCollective.benefits.title": "Key Benefits",
  "privateCollective.benefits.item1":
    "<strong>Affordable Contribution:</strong> The larger the collective, the lower the per-person contribution.",
  "privateCollective.benefits.item2":
    "<strong>Direct & Transparent:</strong> Funds go directly to the deceased member's nominee without intermediaries.",
  "privateCollective.benefits.item3":
    "<strong>Strong Community Support:</strong> A collective effort ensuring financial security for all community members.",
  "privateCollective.join.title": "Join the Movement",
  "privateCollective.join.description":
    "To become a member of the ₹1 Crore Collective and safeguard your family's financial future, sign up today and take the pledge!",
  "privateCollective.pledge.title": "Pledge",
  "privateCollective.pledge.item1":
    "<strong>Support Fellow Members:</strong> Contributing promptly and consistently to this collective's fund to ensure timely assistance to the nominees of deceased fellow members.",
  "privateCollective.pledge.item2":
    "<strong>Maintain Integrity:</strong> Providing accurate personal information, adhering to the collective's guidelines, and refraining from any actions that may compromise the trust and welfare of the community.",
  "privateCollective.pledge.item3":
    "<strong>Promote Transparency:</strong> Engaging in open communication, participating in decision-making processes when possible, and supporting the collective's efforts to maintain clear and accessible records.",
  "privateCollective.pledge.item4":
    "<strong>Foster Community Growth:</strong> Encouraging others to join and strengthen our collective, thereby enhancing our capacity to support one another in times of need.",
  "privateCollective.pledge.item5":
    "<strong>Respect Confidentiality:</strong> Honouring the privacy of fellow members and handling all personal information with the utmost care and discretion.",
  "privateCollective.pledge.item6":
    "<strong>Demonstrate Solidarity:</strong> Recognizing that our strength lies in unity, I will stand with my fellow members, offering support and compassion beyond financial contributions.",
  "privateCollective.pledge.finalPara":
    "By taking this pledge, I affirm my dedication to the values and mission of the Jeevan Suraksha Social Security Collective, understanding that our shared commitment ensures the well-being and security of all members.",
  "privateCollective.disclaimer.title": "Important Disclaimer",
  "privateCollective.disclaimer.item1":
    "The total contribution per claim depends on the number of active contributors at the time of the request.",
  "privateCollective.disclaimer.item2":
    "The full claim value is not guaranteed; the actual amount depends on contributions received.",
  "privateCollective.disclaimer.item3":
    "If the required amount is not collected, the nominee will receive only the total contributed by the active members.",
  // Terms & Conditions Page
  "terms.hero.title": "Terms & Conditions",
  "terms.hero.breadcrumb": "TERMS & CONDITIONS",
  "terms.content.title": "Terms and Conditions",
  "terms.content.intro":
    "Welcome to {companyName}. By accessing and using our website, you agree to the following terms and conditions. Please read them carefully. If you do not agree with these terms, please do not use our website.",
  "terms.content.thankYou":
    "Thank you for visiting our website and supporting our mission.",
  "terms.section.acceptance.title": "1. Acceptance of Terms",
  "terms.section.acceptance.p1":
    "By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and any applicable laws and regulations. We may update these terms from time to time, and it is your responsibility to review them periodically.",
  "terms.section.useOfWebsite.title": "2. Use of Website",
  "terms.section.useOfWebsite.p1":
    "You agree to use our website for lawful purposes only. You must not use our site to:",
  "terms.section.useOfWebsite.l1":
    "Engage in any unlawful activity or violate any applicable laws or regulations.",
  "terms.section.useOfWebsite.l2":
    "Transmit harmful or malicious content, including viruses, malware, or other harmful code.",
  "terms.section.useOfWebsite.l3":
    "Impersonate any person or entity or misrepresent your affiliation with any person or entity.",
  "terms.section.intellectualProperty.title": "3. Intellectual Property",
  "terms.section.intellectualProperty.p1":
    "All content on our website, including text, images, logos, and other materials, is the property of {companyName} or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.",
  "terms.section.userContributions.title": "4. User Contributions",
  "terms.section.userContributions.p1":
    "If you submit any content or materials to our website, such as comments or feedback, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, and distribute such content. You represent and warrant that you have the rights to grant this license and that your content does not infringe any third-party rights.",
  "terms.section.thirdParty.title": "5. Links to Third-Party Websites",
  "terms.section.thirdParty.p1":
    "Our website may contain links to third-party websites for your convenience. We do not endorse or take responsibility for the content or practices of these sites. Accessing and using third-party websites is at your own risk.",
  "terms.section.liability.title": "6. Limitation of Liability",
  "terms.section.liability.p1":
    "To the fullest extent permitted by law, {companyName} shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of our website or any content on our site. We make no warranties or representations about the accuracy, reliability, or completeness of the content on our site.",
  "terms.section.indemnification.title": "7. Indemnification",
  "terms.section.indemnification.p1":
    "You agree to indemnify and hold harmless {companyName}, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, or expenses arising out of your use of our website or violation of these terms.",
  "terms.section.governingLaw.title": "8. Governing Law",
  "terms.section.governingLaw.p1":
    "These Terms and Conditions are governed by and construed in accordance with the laws, without regard to its conflict of law principles. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts.",
  "terms.section.contact.title": "9. Contact Information",
  "terms.section.contact.p1":
    "If you have any questions or concerns about these Terms and Conditions, please contact us at:",
  "terms.section.contact.p2": "{companyName}",
  // Refund Policy Page
  "refund.hero.title": "Refund and Return Policy",
  "refund.hero.breadcrumb": "REFUND AND RETURN POLICY",
  "refund.content.effectiveDate": "Effective Date: March 23, 2025",
  "refund.content.intro":
    "At Jeevan Suraksha Social Security Collective, an initiative of Health Guard Foundation, we strive to ensure transparency in our financial transactions. This Refund Policy explains the conditions under which refunds may be granted.",
  "refund.content.conclusion":
    "By using our services, you agree to the terms outlined in these policies.",
  "refund.section.eligibility.title": "1. Eligibility for Refunds",
  "refund.section.eligibility.p1":
    "Refunds may be issued in cases of erroneous transactions or duplicate payments.",
  "refund.section.eligibility.p2":
    "Refunds will be considered only if the request is made within 72 hours of making membership charges before claiming your receipt which ever happens first.",
  "refund.section.nonRefundable.title": "2. Non-Refundable Transactions",
  "refund.section.nonRefundable.p1":
    "Any transactional charges are non-refundable.",
  "refund.section.nonRefundable.p2":
    "Claims and benefits once processed are non-reversible.",
  "refund.section.process.title": "3. Refund Process",
  "refund.section.process.p1":
    "Users must submit a formal request with transaction details and supporting documents.",
  "refund.section.process.p2":
    "Refunds, if approved, will be processed within 72 hours through the original payment method.",
  "refund.section.contact.title": "4. Contact Information",
  "refund.section.contact.p1":
    "For questions regarding our Privacy Policy, Terms of Use, or Refund Policy, please contact us at:",
  "refund.section.contact.visitUs": "Visit Us:",
  "refund.section.contact.address.l1": "1-63, Amadabakula (Village),",
  "refund.section.contact.address.l2": "Kothakota (Mandal),",
  "refund.section.contact.address.l3": "Wanaparthy (District),",
  "refund.section.contact.address.l4": "Telangana, India",
  "refund.section.contact.mailUs": "Mail Us:",
  "refund.section.contact.email": "info@healthguard.org.in",
  "refund.section.contact.phoneUs": "Phone Us:",
  "refund.section.contact.phone": "+91 7816068717",
  // Privacy Policy Page
  "privacy.hero.title": "Privacy Policy",
  "privacy.hero.breadcrumb": "PRIVACY POLICY",
  "privacy.content.effectiveDate": "Effective Date: March 23, 2025",
  "privacy.content.intro":
    'Jeevan Suraksha Social Security Collective, a part of Health Guard Foundation, ("we," "our," "us") is committed to protecting the privacy and security of our users\' information. This Privacy Policy explains how we collect, use, disclose, and protect your information when you interact with our services.',
  "privacy.section.collect.title": "1. Information We Collect",
  "privacy.section.collect.personal":
    "<strong>Personal Information:</strong> Name, contact details, date of birth, government-issued identification, financial details, and other related information.",
  "privacy.section.collect.nonPersonal":
    "<strong>Non-Personal Information:</strong> Browser type, IP address, and usage data collected through cookies and analytics tools.",
  "privacy.section.use.title": "2. How We Use Your Information",
  "privacy.section.use.l1": "To provide, maintain, and improve our services.",
  "privacy.section.use.l2": "To process applications, payments, and claims.",
  "privacy.section.use.l3":
    "To communicate updates, notifications, and marketing materials.",
  "privacy.section.use.l4": "To comply with legal obligations.",
  "privacy.section.sharing.title": "3. Sharing of Information",
  "privacy.section.sharing.p1":
    "We do not sell or rent personal information to third parties.",
  "privacy.section.sharing.p2":
    "Information may be shared with government agencies, legal authorities, or service providers where required by law.",
  "privacy.section.security.title": "4. Security Measures",
  "privacy.section.security.p1":
    "We implement industry-standard security measures to safeguard your information.",
  "privacy.section.security.p2":
    "However, no online service is 100% secure; users are advised to take personal security precautions.",
  "privacy.section.rights.title": "5. Your Rights",
  "privacy.section.rights.p1":
    "You may request access, correction, or deletion of your personal data.",
  "privacy.section.rights.p2":
    "You may opt out of receiving promotional communications.",
  // Homepage Contact Form
  "contactForm.title": "Have a Question? Get in Touch!",
  "contactForm.subtitle":
    "We are here to help and answer any question you might have. We look forward to hearing from you.",
  "contactForm.label.name": "Full Name *",
  "contactForm.label.email": "Email Address *",
  "contactForm.label.phone": "Phone Number *",
  "contactForm.label.message": "Message *",
  "contactForm.error.nameRequired": "Name is required.",
  "contactForm.error.emailRequired": "A valid email is required.",
  "contactForm.error.phoneRequired": "Phone number is required.",
  "contactForm.error.messageRequired": "Message cannot be empty.",
  "contactForm.button.submitting": "Submitting...",
  "contactForm.button.send": "Send Message",
  "contactForm.status.success":
    "Thank you for your message! We will get back to you soon.",
  "contactForm.status.errorPrefix": "Error:",
  "contactForm.status.networkError":
    "An error occurred. Please try again later.",
};

// --- Telugu Translations ---
const teTranslations: Record<string, string> = {
  // Common Buttons
  "common.button.readMore": "మరింత చదవండి",
  "common.button.registerNow": "ఇప్పుడే నమోదు చేసుకోండి",
  "common.button.login": "లాగిన్",
  "common.button.applyMembership": "సభ్యత్వం కోసం దరఖాస్తు చేసుకోండి",
  "common.button.donateUs": "మాకు విరాళం ఇవ్వండి",

  // Navbar
  "navbar.home": "హోమ్",
  "navbar.whoWeAre": "మేము ఎవరము",
  "navbar.ourTeam": "మా బృందం",
  "navbar.faqs": "ప్రశ్నలు",
  "navbar.collectives": "మా సమూహాలు",
  "navbar.itGovtCollective": "ఐటి & ప్రభుత్వ ఉద్యోగుల సమూహం",
  "navbar.privateBusinessCollective": "ప్రైవేట్ ఉద్యోగులు & వ్యాపార యజమానులు",
  "navbar.reportClaim": "క్లెయిమ్ నివేదించండి",
  "navbar.donate": "మాకు విరాళం ఇవ్వండి",
  "language.english": "English",
  "language.telugu": "తెలుగు",

  // Top Header
  "topHeader.phone": "+91-78160 58717",
  "topHeader.email": "info@jeevansuraksha.org",

  // Hero Section
  "hero.title": "జీవన్ సురక్ష సోషల్ సెక్యూరిటీ కలెక్టివ్",
  "hero.subtitle":
    "జీవన్ సురక్ష సోషల్ సెక్యూరిటీ కలెక్టివ్, హెల్త్ గార్డ్ ఫౌండేషన్ యొక్క ఒక చొరవ, కుటుంబాలకు వారి అత్యంత సవాలు సమయాల్లో ఆర్థిక సహాయం అందించడానికి రూపొందించబడిన ఒక సమాజ-ఆధారిత చొరవ.",

  // About Section
  "about.title": "మా చొరవ గురించి",
  "about.p1":
    "జీవన్ సురక్ష సోషల్ సెక్యూరిటీ కలెక్టివ్ అనేది సమాజ-ఆధారిత ఆర్థిక భద్రతకు ఒక విప్లవాత్మక విధానం. ప్రజలు కలిసి వచ్చినప్పుడు, వారు అవసరమైన సమయాల్లో ప్రతిఒక్కరినీ రక్షించే ఒక భద్రతా వలయాన్ని సృష్టించగలరని మేము నమ్ముతున్నాము.",
  "about.p2":
    "మా కలెక్టివ్ పరస్పర మద్దతు సూత్రంపై పనిచేస్తుంది, ఇక్కడ చాలా మంది సభ్యుల నుండి చిన్న విరాళాలు ప్రియమైన వారిని కోల్పోయిన కుటుంబాలకు గణనీయమైన ఆర్థిక సహాయాన్ని సృష్టిస్తాయి.",
  "about.p3":
    "పారదర్శక కార్యకలాపాలు మరియు సమాజ-ఆధారిత పాలన ద్వారా, ప్రతి సభ్యుడు తమ కుటుంబానికి అత్యంత ముఖ్యమైనప్పుడు మద్దతు లభిస్తుందని తెలిసి సురక్షితంగా భావించేలా మేము నిర్ధారిస్తాము.",

  // How It Works Section
  "howItWorks.title": "ఇది ఎలా పనిచేస్తుంది?",
  "howItWorks.step1": "నమోదు రుసుము ₹100 మరియు పునరుద్ధరణ ₹100 చెల్లించండి",
  "howItWorks.step2": "పథకం 1,000 మంది సభ్యులతో ప్రారంభమవుతుంది",
  "howItWorks.step3":
    "ఒక సభ్యుడు మరణించిన తర్వాత మాత్రమే విరాళాలు (₹500 నుండి)",
  "howItWorks.step4": "నిధులు నేరుగా నామినీకి పంపిణీ చేయబడతాయి",
  "howItWorks.portalInfo":
    "జీవన్ సురక్ష పోర్టల్ సభ్యులకు విరాళాలు మరియు చెల్లింపులను ట్రాక్ చేయడానికి అనుమతిస్తుంది.",
  "howItWorks.joinToday":
    "ఈరోజే చేరండి మరియు శ్రద్ధ వహించే సమాజంలో భాగం అవ్వండి!",

  // Mission Section
  "mission.title": "మా లక్ష్యం",
  "mission.text":
    "చిన్న విరాళాల ద్వారా లబ్ధిదారులకు ఆర్థిక భద్రతను అందించడానికి సభ్యులు కలిసి నిలబడే ఒక శ్రద్ధగల మరియు సహాయక సమాజాన్ని నిర్మించడం.",

  // Collectives Section
  "collectives.title": "వివిధ సభ్యుల సమూహాల కోసం బహుళ కలెక్టివ్‌లు",
  "collectives.subtitle":
    "ఆర్థిక సామర్థ్యం మరియు ప్రాధాన్యతల ఆధారంగా విభిన్న కలెక్టివ్‌లు.",
  "collectives.item1.title": "ఐటి నిపుణులు & ప్రభుత్వ ఉద్యోగులు",
  "collectives.item1.desc":
    "అధిక విరాళ సామర్థ్యంతో సాంకేతిక మరియు ప్రభుత్వ రంగాలలోని నిపుణుల కోసం రూపొందించబడింది.",
  "collectives.item2.title": "సాధారణ ప్రజలు & వ్యాపార యజమానులు",
  "collectives.item2.desc":
    "సరసమైన భద్రతను కోరుకునే సాధారణ ప్రజలు మరియు చిన్న వ్యాపార యజమానుల కోసం రూపొందించబడింది.",
  "collectives.item3.title": "ఇతర కలెక్టివ్‌లు (రాబోయేవి)",
  "collectives.item3.desc":
    "సమాజ అవసరాలు మరియు అభిప్రాయాల ఆధారంగా మరిన్ని ప్రత్యేకమైన కలెక్టివ్‌లు త్వరలో రాబోతున్నాయి.",

  // Why Join Section
  "whyJoin.title": "జీవన్ సురక్ష సోషల్ సెక్యూరిటీ కలెక్టివ్‌లో ఎందుకు చేరాలి?",
  "whyJoin.feature1.title": "ఆర్థిక భద్రత",
  "whyJoin.feature1.desc":
    "ఊహించని పరిస్థితులలో మీ కుటుంబం రక్షించబడుతుందని నిర్ధారించుకోండి.",
  "whyJoin.feature2.title": "పారదర్శక కార్యకలాపాలు",
  "whyJoin.feature2.desc": "మధ్యవర్తులు లేరు; అవసరమైన రోగికి నేరుగా బదిలీలు.",
  "whyJoin.feature3.title": "సమాజ బలం",
  "whyJoin.feature3.desc":
    "అవసరమైన సమయాల్లో ఒకరికొకరు మద్దతు ఇచ్చే నెట్‌వర్క్‌లో భాగం అవ్వండి.",
  "whyJoin.feature4.title": "త్వరిత పంపిణీ",
  "whyJoin.feature4.desc": "ధృవీకరణ తర్వాత నిధులు తక్షణమే పంపిణీ చేయబడతాయి.",
  "whyJoin.feature5.title": "సరసమైన నమూనా",
  "whyJoin.feature5.desc":
    "చిన్నగా ప్రారంభించండి, కాలక్రమేణా తక్కువ విరాళం ఇవ్వండి మరియు సామూహిక భద్రత నుండి ప్రయోజనం పొందండి.",
  "whyJoin.feature6.title": "సభ్యత్వ పెరుగుదల అందరికీ ప్రయోజనం చేకూరుస్తుంది",
  "whyJoin.feature6.desc":
    "ఎక్కువ మంది సభ్యులు అంటే ప్రతి కేసుకు తక్కువ విరాళాలు.",

  // Contribution Table Section
  "contribution.table.title": "సభ్యత్వ పెరుగుదల ఆధారంగా విరాళాల గణన",
  "contribution.table.subtitle":
    "ప్రతి కేసుకు సేకరించిన మొత్తం మొత్తం చురుకైన సభ్యుల సంఖ్యపై ఆధారపడి ఉంటుంది. సభ్యత్వం పెరిగేకొద్దీ ప్రతి సభ్యుని విరాళం ఎలా తగ్గుతుందో ఇక్కడ ఒక అంచనా ఉంది:",
  "contribution.table.header1": "మొత్తం సభ్యులు",
  "contribution.table.header2": "ప్రతి సభ్యునికి విరాళం (₹)",
  "contribution.table.header3": "మొత్తం సేకరించిన నిధి (₹)",
  "contribution.table.illustration": "వివరణ పట్టిక",

  // CTA Banner
  "cta.title": "మార్పులో భాగం అవ్వండి",
  "cta.subtitle":
    "మీకు మరియు మీ ప్రియమైన వారికి అండగా నిలిచే ఒక కలెక్టివ్‌ను నిర్మించడంలో మాతో చేరండి. ఈరోజే మీ కుటుంబ భవిష్యత్తును భద్రపరచుకోండి!",
  // Footer
  "footer.about":
    "సవాళ్లతో కూడిన సమయాల్లో సామూహిక మద్దతు మరియు పరస్పర శ్రద్ధ ద్వారా ఆర్థిక భద్రతను అందించే సమాజ-ఆధారిత చొరవ.",
  "footer.contactInfo": "సంప్రదింపు సమాచారం",
  "footer.address":
    "హెల్త్ గార్డ్ ఫౌండేషన్\n1-63, అమడబకుల (గ్రామం),\nకొత్తకోట (మండలం), వనపర్తి (జిల్లా),\nతెలంగాణ, భారతదేశం - 509381",
  "footer.quickLinks": "త్వరిత లింకులు",
  "footer.link.home": "హోమ్",
  "footer.link.about": "మా గురించి",
  "footer.link.faq": "ప్రశ్నలు",
  "footer.link.collectives": "కలెక్టివ్‌లు",
  "footer.link.contact": "సంప్రదించండి",
  "footer.link.terms": "నిబంధనలు",
  "footer.link.privacy": "గోప్యత",
  "footer.link.reportClaim": "క్లెయిమ్ నివేదించండి",
  "footer.link.refund": "వాపసు మరియు రిటర్న్ విధానం", // Yeh add kiya gaya hai
  "footer.link.volunteers": "వాలంటీర్లు", // Yeh add kiya gaya hai
  "footer.copyright":
    "© {year} జీవన్ సురక్ష సోషల్ సెక్యూరిటీ కలెక్టివ్. అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.",

  /// Who We Are Page
  "whoWeAre.hero.title": "మా గురించి",
  "whoWeAre.hero.breadcrumbHome": "హోమ్",
  "whoWeAre.hero.breadcrumbAbout": "మా గురించి",
  "whoWeAre.about.title": "మా గురించి",
  "whoWeAre.about.p1":
    "జీవన్ సురక్ష సోషల్ సెక్యూరిటీ కలెక్టివ్, హెల్త్ గార్డ్ ఫౌండేషన్ యొక్క ఒక చొరవ, కుటుంబాలకు వారి అత్యంత సవాలు సమయాల్లో ఆర్థిక సహాయం అందించడానికి రూపొందించబడిన ఒక సమాజ-ఆధారిత చొరవ. ఒక సామూహిక సామాజిక భద్రతా నమూనా కింద వ్యక్తులను ఏకం చేయడం ద్వారా, ప్రతి సభ్యుడు ఒక తోటి సభ్యుని కుటుంబాన్ని ఆదుకునే గణనీయమైన నిధిని సృష్టించడానికి ఒక చిన్న మొత్తాన్ని అందించేలా మేము నిర్ధారిస్తాము.",
  "whoWeAre.about.p2":
    "ప్రతి కుటుంబం మరియు ప్రతి జీవితం అమూల్యమైనది కాబట్టి సమాజంలోని ప్రతి వర్గానికి ఈ మద్దతును విస్తరించడానికి మేము బహుళ కలెక్టివ్‌లను నిర్వహిస్తున్నాము. మా లక్ష్యం వారి ప్రాథమిక సంపాదకుడిని కోల్పోయిన తర్వాత కుటుంబాలను ఆర్థిక ఇబ్బందుల నుండి రక్షించడం, ఒక కరుణామయ మరియు స్థితిస్థాపక సమాజాన్ని పెంపొందించడం. చాలా మంది వ్యక్తులు ఒక చిన్న మొత్తాన్ని అందించడంతో, మేము ఒక గణనీయమైన ప్రభావాన్ని అందించే ఒక బలమైన భద్రతా వలయాన్ని సృష్టిస్తాము. కలిసి, ఎవరూ ఒంటరిగా కష్టాలను ఎదుర్కోకుండా మేము నిర్ధారిస్తాము.",
  "whoWeAre.mission.title": "ప్రజలకు సహాయం చేయడమే మా లక్ష్యం",
  "whoWeAre.mission.tab1": "హెల్త్ గార్డ్ ఫౌండేషన్ అంటే ఏమిటి?",
  "whoWeAre.mission.tab2": "మా లక్ష్యం",
  "whoWeAre.mission.tab3": "మా దృష్టి",
  "whoWeAre.mission.foundationTitle": "హెల్త్ గార్డ్ ఫౌండేషన్ అంటే ఏమిటి?",

  "whoWeAre.mission.foundationP1":
    "హెల్త్ గార్డ్ ఫౌండేషన్ (HGF), తెలంగాణ, భారతదేశంలో నమోదు చేయబడిన ఒక NGO, ఒక సమాజ-ఆధారిత భద్రతా వలయాన్ని సృష్టించే దృష్టితో ఐటీ ఉద్యోగులచే స్థాపించబడింది. HGF వారి నేపథ్యం లేదా ఆదాయ స్థాయితో సంబంధం లేకుండా, ఆరోగ్య సంక్షోభాల సమయంలో వ్యక్తులకు తక్షణ ఆర్థిక సహాయం అందించాలని లక్ష్యంగా పెట్టుకుంది.",
  "whoWeAre.mission.foundationP2":
    "మా చొరవ సరళమైనది ఇంకా శక్తివంతమైనది—సభ్యులు నెలకు ₹2010 అందిస్తారు, వనరులను ఒక ఉమ్మడి నిధిలోకి సమీకరిస్తారు. ఒక వైద్య అత్యవసర పరిస్థితి సంభవించినప్పుడు, ఈ నిధి ఒక జీవనాధారంగా మారుతుంది, ఆర్థిక ఒత్తిడి లేకుండా అత్యవసర సంరక్షణ అందుబాటులో ఉండేలా నిర్ధారిస్తుంది.",

  "whoWeAre.mission.missionTitle": "మా లక్ష్యం",
  "whoWeAre.mission.missionP":
    "చిన్న విరాళాల ద్వారా లబ్ధిదారులకు ఆర్థిక భద్రతను అందించడానికి సభ్యులు కలిసి నిలబడే ఒక శ్రద్ధగల మరియు సహాయక సమాజాన్ని నిర్మించడం, వారి అత్యంత సవాలు సమయాల్లో ఏ కుటుంబం ఒంటరిగా కష్టాలను ఎదుర్కోకుండా నిర్ధారించడం.",
  "whoWeAre.mission.visionTitle": "మా దృష్టి",
  "whoWeAre.mission.visionP":
    "ప్రతి కుటుంబానికి సమగ్ర ఆర్థిక రక్షణను అందించే సామాజిక భద్రతా కలెక్టివ్‌ల దేశవ్యాప్త నెట్‌వర్క్‌ను సృష్టించడం, పరస్పర మద్దతు మరియు సమాజ సంరక్షణ భద్రతకు పునాదిగా ఉన్న సమాజాన్ని పెంపొందించడం.",

  // Our Team Page
  "ourTeam.hero.title": "మా బృందం",
  "ourTeam.hero.breadcrumbHome": "హోమ్",
  "ourTeam.hero.breadcrumbOurTeam": "మా బృందం",
  "ourTeam.tabs.ourTeam": "మా బృందం",
  "ourTeam.tabs.board": "బోర్డ్",
  "ourTeam.tabs.advisors": "సలహాదారులు",
  "ourTeam.card.altPrefix": "యొక్క ప్రొఫైల్ ", // {name} hata diya
  "ourTeam.noMembers": "ఈ వర్గంలో ఇంకా సభ్యులు లేరు.",

  // Team Member Details
  "ourTeam.member1.name": "మొహమ్మద్ అలీ ఇర్షాద్",
  "ourTeam.member1.role": "చైర్మన్ & మేనేజింగ్ ట్రస్టీ",
  "ourTeam.member2.name": "శివ స్వరూప్ గౌడ్",
  "ourTeam.member2.role": "ట్రస్టీ & చీఫ్ ఆపరేటింగ్ ఆఫీసర్",
  "ourTeam.member3.name": "షేక్ ఖలీల్",
  "ourTeam.member3.role": "ప్రోగ్రామ్ మేనేజర్",
  "ourTeam.member4.name": "పనుగంటి కృష్ణయ్య",
  "ourTeam.member4.role": "చీఫ్ రిలేషన్స్ ఆఫీసర్",
  "ourTeam.member5.name": "గౌహర్ సలీం జీషన్",
  "ourTeam.member5.role": "సలహా బోర్డు సభ్యులు",
  "ourTeam.member6.name": "మొహమ్మద్ షఫీ",
  "ourTeam.member6.role": "సలహా బోర్డు సభ్యులు",
  "ourTeam.member7.name": "లక్ష్మీకాంత్ మాధవరం",
  "ourTeam.member7.role": "సలహా బోర్డు సభ్యులు",

  // FAQ Page
  "faq.hero.title": "తరచుగా అడిగే ప్రశ్నలు",
  "faq.hero.breadcrumbHome": "హోమ్",
  "faq.hero.breadcrumbFaq": "ప్రశ్నలు",
  "faq.search.placeholder": "ప్రశ్నలను వెతకండి...",
  "faq.search.allTopics": "అన్ని విషయాలు",
  "faq.search.noResultsTitle": "ప్రశ్నలు కనుగొనబడలేదు",
  "faq.search.noResultsSubtitle":
    "మీ శోధన పదాలను సర్దుబాటు చేయడానికి ప్రయత్నించండి లేదా అన్ని వర్గాలను బ్రౌజ్ చేయండి.",
  "faq.support.title": "ఇంకా ప్రశ్నలు ఉన్నాయా?",
  "faq.support.subtitle":
    "మీ సభ్యత్వానికి సంబంధించిన ఏవైనా అదనపు ప్రశ్నలు లేదా ఆందోళనలతో మీకు సహాయం చేయడానికి మా ప్రత్యేక మద్దతు బృందం ఇక్కడ ఉంది.",
  "faq.support.callUs": "మాకు కాల్ చేయండి",
  "faq.support.emailUs": "మాకు ఇమెయిల్ చేయండి",
  "faq.support.liveChat": "లైవ్ చాట్",
  "faq.support.chatHours": "ఉదయం 9 - సాయంత్రం 6 వరకు అందుబాటులో ఉంది",
  "faq.support.hoursLabel": "మద్దతు గంటలు:",
  "faq.support.hoursValue":
    "సోమవారం నుండి శుక్రవారం వరకు, ఉదయం 9:00 - సాయంత్రం 6:00 IST",
  "faq.support.languagesLabel": "భాషలు:",
  "faq.support.languagesValue": "ఇంగ్లీష్, హిందీ, తెలుగు, తమిళం",
  "faq.support.phone": "+91 78160 58717",
  "faq.support.email": "support@jeevansuraksha.org",

  // FAQ Section Titles
  "faq.section1.title": "సభ్యత్వం & అర్హత",
  "faq.section2.title": "విరాళాలు & చెల్లింపులు",
  "faq.section3.title": "సభ్యత్వ చెల్లింపులు & ఉపసంహరణ",
  "faq.section4.title": "ప్రక్రియ & ట్రాకింగ్",
  "faq.section5.title": "చట్టపరమైన & వర్తింపు",
  "faq.section6.title": "కమ్యూనికేషన్ & మద్దతు",

  // Section 1: Membership & Eligibility
  "faq.section1.q1.q": "జీవన్ సురక్షలో ఎవరు చేరవచ్చు?",
  "faq.section1.q1.a":
    "ప్రస్తుతం తెలంగాణ, ఆంధ్రప్రదేశ్, కర్ణాటక లేదా తమిళనాడులో నివసిస్తున్న భారతీయ పౌరులు, లేదా ఈ రాష్ట్రాలలో ఏదైనా ఒకదానిలో శాశ్వత నివాసితులై ప్రపంచంలో ఎక్కడైనా పనిచేస్తున్నవారు, ఈ క్రింది షరతులను నెరవేర్చినట్లయితే దరఖాస్తు చేసుకోవడానికి అర్హులు: 18 నుండి 60 సంవత్సరాల మధ్య వయస్సు ఉండాలి, నమోదు సమయంలో ప్రాణాంతక వ్యాధులతో బాధపడుతూ ఉండరాదు. ముఖ్య గమనికలు: అన్ని దరఖాస్తులు ధృవీకరణ ప్రక్రియకు లోబడి ఉంటాయి, దీనికి ఒక వారం వరకు పట్టవచ్చు. అర్హతను నిర్ధారించలేని అసాధారణమైన సందర్భాలలో, దరఖాస్తు తిరస్కరించబడుతుంది మరియు పూర్తి మొత్తం వాపసు చేయబడుతుంది. తిరస్కరించిన 21 రోజులలోపు వాపసులు ప్రాసెస్ చేయబడతాయి. చెల్లింపులు ప్రతి రాష్ట్రానికి విడివిడిగా, సంబంధిత రాష్ట్ర సభ్యులకు అనుగుణంగా ప్రాసెస్ చేయబడతాయి.",
  "faq.section1.q2.q": "ఎన్నారైలు జీవన్ సురక్షలో చేరవచ్చా?",
  "faq.section1.q2.a":
    "అవును, తెలంగాణ, ఆంధ్రప్రదేశ్, కర్ణాటక & తమిళనాడులో శాశ్వత నివాసితులైన ప్రవాస భారతీయులు (ఎన్నారైలు) వయస్సు అవసరాలు మరియు ఆరోగ్య పరిస్థితులతో సహా అన్ని ఇతర అర్హత ప్రమాణాలను నెరవేర్చినట్లయితే జీవన్ సురక్షలో చేరవచ్చు.",
  "faq.section1.q3.q": "నేను వేర్వేరు పేర్లతో బహుళసార్లు నమోదు చేసుకోగలనా?",
  "faq.section1.q3.a":
    "లేదు, ప్రతి వ్యక్తి వారి చట్టపరమైన పేరుతో ఒకే ఒక క్రియాశీల సభ్యత్వాన్ని కలిగి ఉండగలరు. వేర్వేరు పేర్లు లేదా గుర్తింపులతో బహుళ నమోదులు ఖచ్చితంగా నిషేధించబడ్డాయి మరియు సభ్యత్వ రద్దుకు దారితీయవచ్చు.",
  "faq.section1.q4.q": "నమోదు సమయంలో ఏ వివరాలు అవసరం?",
  "faq.section1.q4.a":
    "నమోదు సమయంలో, మీరు పూర్తి పేరు, పుట్టిన తేదీ, సంప్రదింపు సమాచారం, చిరునామా రుజువు, పాన్ కార్డ్ వివరాలు, నామినీ సమాచారం మరియు ఉపాధి వివరాలతో సహా వ్యక్తిగత వివరాలను అందించాలి. అన్ని సమాచారం ఖచ్చితమైనది మరియు ధృవీకరించదగినదిగా ఉండాలి.",
  "faq.section1.q5.q": "నేను తరువాత నా నామినీని మార్చుకోగలనా?",
  "faq.section1.q5.a":
    "అవును, మీరు మీ సభ్యుల పోర్టల్‌లోకి లాగిన్ అయి, నామినీ సమాచారాన్ని నవీకరించడం ద్వారా మీ నామినీ వివరాలను మార్చుకోవచ్చు. మార్పులు ధృవీకరణ మరియు మా బృందం నుండి నిర్ధారణ తర్వాత ప్రభావవంతంగా ఉంటాయి.",
  "faq.section1.q6.q": "నేను ఏదైనా వైద్య పరీక్ష చేయించుకోవాలా?",
  "faq.section1.q6.a":
    "నమోదు కోసం ఎటువంటి వైద్య పరీక్ష అవసరం లేదు. అయితే, నమోదు సమయంలో మీరు ఏవైనా ముందుగా ఉన్న ప్రాణాంతక వ్యాధులను ప్రకటించాలి. తప్పుడు ప్రకటనలు క్లెయిమ్ తిరస్కరణకు దారితీయవచ్చు.",
  "faq.section1.q7.q": "నేను విరాళం ఇవ్వడంలో విరామం తీసుకుంటే ఏమి జరుగుతుంది?",
  "faq.section1.q7.a":
    "మీరు వరుసగా 3 కంటే ఎక్కువ క్లెయిమ్‌లకు విరాళాలు తప్పిపోతే, మీ సభ్యత్వం నిలిపివేయబడవచ్చు. మీరు తప్పిపోయిన విరాళాలను ఒక పునఃప్రారంభ రుసుముతో పాటు చెల్లించడం ద్వారా పునఃప్రారంభించవచ్చు.",
  "faq.section1.q8.q":
    "నేను నా సభ్యత్వాన్ని ఒక కుటుంబ సభ్యునికి బదిలీ చేయవచ్చా?",
  "faq.section1.q8.a":
    "సభ్యత్వాలు బదిలీ చేయబడవు. ప్రతి వ్యక్తి వారి స్వంత సభ్యత్వం కోసం విడిగా దరఖాస్తు చేసుకోవాలి. అయితే, కుటుంబ సభ్యులు వేర్వేరు సభ్యులుగా చేరవచ్చు.",
  "faq.section1.q9.q":
    "నేను తెలంగాణ, ఆంధ్రప్రదేశ్, కర్ణాటక & తమిళనాడు వెలుపల పునరావాసం పొందితే ఏమి జరుగుతుంది?",
  "faq.section1.q9.a":
    "మీరు తెలంగాణ, ఆంధ్రప్రదేశ్, కర్ణాటక & తమిళనాడు వెలుపల శాశ్వతంగా పునరావాసం పొందితే, మీరు మీ సభ్యత్వాన్ని కొనసాగించవచ్చు, కానీ పునరావాసం పొందిన 30 రోజులలోపు సభ్యుల పోర్టల్‌లో మీ చిరునామా వివరాలను నవీకరించాలి.",
  "faq.section1.q10.q":
    "ఒక సభ్యుడు ఒక కలెక్టివ్ నుండి మరొక కలెక్టివ్‌కు మారవచ్చా?",
  "faq.section1.q10.a":
    "సభ్యులు మారిన పరిస్థితుల కారణంగా కలెక్టివ్‌ల మధ్య బదిలీ కోసం అభ్యర్థించవచ్చు; అయితే, ఏదైనా బదిలీ ముందస్తు వ్రాతపూర్వక ఆమోదానికి లోబడి ఉంటుంది మరియు అదనపు పత్రాలు మరియు వర్తించే రుసుములు అవసరం కావచ్చు.",

  // Section 2: Contributions & Payouts
  "faq.section2.q1.q":
    "₹25 లక్షలు, ₹50 లక్షలు, లేదా ₹1 కోటి కార్పస్ మొత్తం ఎలా ఉత్పత్తి చేయబడుతుంది?",
  "faq.section2.q1.a":
    "జీవన్ సురక్ష అనేది ఒక టర్మ్ ఇన్సూరెన్స్ ప్లాన్ కాదు. ఇది ఒక సామూహిక విరాళ పథకం, ఇక్కడ సభ్యులు తోటి సభ్యుల కుటుంబాలకు అవసరమైన సమయాల్లో మద్దతు ఇవ్వడానికి స్వచ్ఛందంగా ఒక ఉమ్మడి నిధికి విరాళం ఇస్తారు. క్లెయిమ్ సమయంలో చురుకైన సభ్యుల నుండి వచ్చిన మొత్తం విరాళాల ద్వారా చెల్లింపు మొత్తం నిర్ణయించబడుతుంది. ₹25 లక్షల నుండి ₹1 కోటి వరకు చెల్లింపు అందించడం లక్ష్యం అయినప్పటికీ, వాస్తవంగా అందుకున్న మొత్తం సామూహిక భాగస్వామ్యం మరియు అందుబాటులో ఉన్న నిధులపై ఆధారపడి మారవచ్చు. ఈ పథకం తెలంగాణ, ఆంధ్రప్రదేశ్, కర్ణాటక మరియు తమిళనాడుతో సహా వివిధ రాష్ట్రాల్లో పనిచేస్తుంది. ప్రతి రాష్ట్రం యొక్క కలెక్టివ్ స్వతంత్రంగా పనిచేస్తుంది, మరియు ప్రాంతీయ భాగస్వామ్యం మరియు విరాళాల ఆధారంగా లభ్యత మరియు చెల్లింపు మొత్తాలు మారవచ్చు. ఉదాహరణకు, తెలంగాణ కలెక్టివ్ యొక్క చెల్లింపు ప్రతి కలెక్టివ్‌లోని తెలంగాణ సభ్యుల సంఖ్యపై ఆధారపడి ఉంటుంది.",
  "faq.section2.q2.q": "ప్రతి మరణ క్లెయిమ్‌కు నేను ఎంత విరాళం ఇవ్వాలి?",
  "faq.section2.q2.a":
    "ప్రతి మరణ క్లెయిమ్‌కు విరాళం మొత్తం మీరు చేరిన కలెక్టివ్ మరియు మొత్తం క్రియాశీల సభ్యుల సంఖ్యపై ఆధారపడి ఉంటుంది. సాధారణంగా, విరాళాలు ప్రతి క్లెయిమ్‌కు ₹25 నుండి ₹500 వరకు ఉంటాయి, సభ్యత్వం పెరిగేకొద్దీ మొత్తం తగ్గుతుంది.",
  "faq.section2.q3.q": "ఒక సంవత్సరంలో క్లెయిమ్‌ల సంఖ్యకు పరిమితి ఉందా?",
  "faq.section2.q3.a":
    "ఒక సంవత్సరంలో క్లెయిమ్‌ల సంఖ్యకు ముందుగా నిర్ణయించిన పరిమితి లేదు. క్లెయిమ్‌ల సంఖ్య సహజ పరిస్థితులపై ఆధారపడి ఉంటుంది. అయితే, విరాళ వ్యవస్థ ద్వారా బహుళ క్లెయిమ్‌లను సమర్థవంతంగా నిర్వహించడానికి కలెక్టివ్ రూపొందించబడింది.",
  "faq.section2.q4.q": "ఒకే సమయంలో బహుళ సభ్యులు మరణిస్తే ఏమి జరుగుతుంది?",
  "faq.section2.q4.a":
    "ఒకే సమయంలో బహుళ క్లెయిమ్‌లు వచ్చినప్పుడు, ప్రతి క్లెయిమ్ విడిగా ప్రాసెస్ చేయబడుతుంది. సభ్యులు ప్రతి క్లెయిమ్‌కు కలెక్టివ్ యొక్క విరాళ నిర్మాణానికి అనుగుణంగా విరాళం ఇవ్వవలసి ఉంటుంది.",
  "faq.section2.q5.q": "నా నామినీలు చెల్లింపును ఎలా అందుకుంటారు?",
  "faq.section2.q5.a":
    "అవసరమైన అన్ని పత్రాల ధృవీకరణ మరియు క్లెయిమ్ ప్రక్రియ పూర్తి అయిన తర్వాత, చెల్లింపులు నేరుగా నామినీ యొక్క బ్యాంకు ఖాతాకు NEFT/RTGS బదిలీ ద్వారా చేయబడతాయి.",
  "faq.section2.q6.q": "అవసరమైన విరాళాలు అందకపోతే ఏమి జరుగుతుంది?",
  "faq.section2.q6.a":
    "పేర్కొన్న సమయ వ్యవధిలో అవసరమైన విరాళాలు అందకపోతే, తగినంత నిధులు సేకరించబడే వరకు చెల్లింపు ఆలస్యం కావచ్చు. సకాలంలో చెల్లింపులు నిర్ధారించడానికి సభ్యులు తక్షణమే విరాళం ఇవ్వమని ప్రోత్సహించబడతారు.",
  "faq.section2.q7.q": "చెల్లింపుకు ఏవైనా మినహాయింపులు ఉన్నాయా?",
  "faq.section2.q7.a":
    "సభ్యత్వం యొక్క మొదటి సంవత్సరంలో ఆత్మహత్య, నమోదు సమయంలో ప్రకటించని ముందుగా ఉన్న ప్రాణాంతక వ్యాధుల కారణంగా మరణం, లేదా చట్టవిరుద్ధమైన కార్యకలాపాల కారణంగా మరణం వంటి సందర్భాలలో చెల్లింపులు మినహాయించబడవచ్చు.",
  "faq.section2.q8.q": "ఒక సభ్యుని మరణం విచారణలో ఉంటే ఏమి జరుగుతుంది?",
  "faq.section2.q8.a":
    "ఒక సభ్యుని మరణం చట్టపరమైన విచారణలో ఉంటే, విచారణ ముగిసి, సంబంధిత అధికారుల నుండి సరైన అనుమతి పొందే వరకు చెల్లింపు నిలిపివేయబడుతుంది.",
  "faq.section2.q9.q": "ట్రస్ట్ కలెక్టివ్ యొక్క నిర్మాణంలో మార్పులు చేయగలదా?",
  "faq.section2.q9.a":
    "అవును, కలెక్టివ్ యొక్క స్థిరత్వం మరియు ప్రభావశీలతను నిర్ధారించడానికి నిర్మాణ మార్పులు చేసే హక్కు ట్రస్ట్‌కు ఉంది. ఏవైనా ముఖ్యమైన మార్పుల గురించి సభ్యులకు ముందుగానే తెలియజేయబడుతుంది.",
  "faq.section2.q10.q":
    "విరాళాలు ఇచ్చేవారు వేర్వేరు రాష్ట్రాల నుండి ఉంటే చెల్లింపు మొత్తం ఎలా నిర్ణయించబడుతుంది?",
  "faq.section2.q10.a":
    "చెల్లింపులు ప్రతి రాష్ట్రానికి విడివిడిగా లెక్కించబడతాయి మరియు క్లెయిమ్ సమయంలో నామినీ యొక్క రాష్ట్రం నుండి చురుకుగా విరాళం ఇచ్చే సభ్యుల సంఖ్యపై మాత్రమే ఆధారపడి ఉంటాయి. ఇతర రాష్ట్రాల సభ్యుల నుండి వచ్చే విరాళాలు చెల్లింపులో చేర్చబడవు.",

  // Section 3: Membership Payments & Withdrawal
  "faq.section3.q1.q": "సభ్యత్వ రుసుములు ఏమిటి?",
  "faq.section3.q1.a":
    "సభ్యత్వ రుసుములో ఒక-సారి నమోదు రుసుము ₹100 మరియు వార్షిక పునరుద్ధరణ రుసుము ₹100 ఉంటాయి. ఈ రుసుములు పరిపాలనా ఖర్చులు మరియు ప్లాట్‌ఫారమ్ నిర్వహణను కవర్ చేస్తాయి.",
  "faq.section3.q2.q": "నేను నా విరాళాలను ఎలా చెల్లించాలి?",
  "faq.section3.q2.a":
    "విరాళాలు సభ్యుల పోర్టల్ ద్వారా UPI, నెట్ బ్యాంకింగ్, డెబిట్/క్రెడిట్ కార్డులు మరియు డిజిటల్ వాలెట్ల వంటి వివిధ చెల్లింపు పద్ధతులను ఉపయోగించి చెల్లించవచ్చు. చెల్లింపు నోటిఫికేషన్లు SMS మరియు ఇమెయిల్ ద్వారా పంపబడతాయి.",
  "faq.section3.q3.q": "నేను కలెక్టివ్ నుండి వైదొలగవచ్చా?",
  "faq.section3.q3.a":
    "అవును, మీరు సభ్యుల పోర్టల్ ద్వారా ఉపసంహరణ అభ్యర్థనను సమర్పించడం ద్వారా ఎప్పుడైనా కలెక్టివ్ నుండి వైదొలగవచ్చు. అయితే, సభ్యత్వ రుసుములు మరియు చేసిన విరాళాలు తిరిగి చెల్లించబడవు.",
  "faq.section3.q4.q": "నేను వైదొలిగితే నా విరాళాలకు ఏమి జరుగుతుంది?",
  "faq.section3.q4.a":
    "మునుపటి క్లెయిమ్‌ల కోసం చేసిన విరాళాలు తిరిగి చెల్లించబడవు, ఎందుకంటే అవి ఇప్పటికే లబ్ధిదారులకు పంపిణీ చేయబడ్డాయి. అసాధారణమైన సందర్భాలలో మాత్రమే ఉపయోగించని సభ్యత్వ రుసుములు పాక్షిక వాపసు కోసం పరిగణించబడతాయి.",
  "faq.section3.q5.q": "కూలింగ్-ఆఫ్ వ్యవధి ఉందా?",
  "faq.section3.q5.a":
    "జీవన్ సురక్ష పథకంలో చేరిన తర్వాత, 90-రోజుల కూలింగ్-ఆఫ్ వ్యవధి ఉంటుంది, ఈ సమయంలో ఎటువంటి క్లెయిమ్‌లు చేయలేరు. ఈ వ్యవధి, ముందుగా ఉన్న ప్రాణాంతక వ్యాధులతో చేరిన ఏవైనా సభ్యులను గుర్తించడానికి అనుమతిస్తుంది, తద్వారా సామూహిక నిధి యొక్క సమగ్రతను నిర్ధారిస్తుంది. ఈ 90-రోజుల వ్యవధి తర్వాత, అన్ని ఇతర షరతులు నెరవేర్చినట్లయితే, సభ్యులు క్లెయిమ్‌లను దాఖలు చేయడానికి అర్హులు అవుతారు.",
  "faq.section3.q6.q": "చెల్లింపు రిమైండర్లు ఎలా పంపబడతాయి?",
  "faq.section3.q6.a":
    "చెల్లింపు రిమైండర్లు SMS, ఇమెయిల్ మరియు మొబైల్ యాప్ ద్వారా పుష్ నోటిఫికేషన్ల ద్వారా పంపబడతాయి. రిమైండర్లు గడువు తేదీకి 7 రోజుల ముందు పంపబడతాయి మరియు చెల్లింపు జరిగే వరకు కొనసాగుతాయి.",
  "faq.section3.q7.q": "నేను చెల్లింపు గడువును తప్పిపోతే ఏమి జరుగుతుంది?",
  "faq.section3.q7.a":
    "మీరు చెల్లింపు గడువును తప్పిపోతే, 15 రోజుల గ్రేస్ పీరియడ్ అందించబడుతుంది. ఈ వ్యవధి తర్వాత, మీ సభ్యత్వం నిలిపివేయబడవచ్చు, మరియు పునఃప్రారంభించడానికి పెండింగ్‌లో ఉన్న మొత్తాలను మరియు ఒక పునఃప్రారంభ రుసుమును చెల్లించవలసి ఉంటుంది.",
  "faq.section3.q8.q": "నేను ముందుగానే విరాళాలు చెల్లించవచ్చా?",
  "faq.section3.q8.a":
    "ప్రస్తుతం, వ్యవస్థ క్లెయిమ్-ఆధారిత విరాళాల కోసం రూపొందించబడింది. ప్రతి క్లెయిమ్ సమయంలో సభ్యత్వ పరిమాణం ఆధారంగా విరాళం మొత్తం మారవచ్చు కాబట్టి ముందుస్తు చెల్లింపులు అంగీకరించబడవు.",

  // Section 4: Process & Tracking
  "faq.section4.q1.q": "నా సభ్యత్వ స్థితిని ఎలా ట్రాక్ చేయాలి?",
  "faq.section4.q1.a":
    "మీరు మీ సభ్యత్వ స్థితి, విరాళాల చరిత్ర మరియు క్లెయిమ్ వివరాలను సభ్యుల పోర్టల్ లేదా మొబైల్ యాప్ ద్వారా ట్రాక్ చేయవచ్చు. మీ సభ్యత్వానికి సంబంధించిన అన్ని కార్యకలాపాల కోసం నిజ-సమయ నవీకరణలు అందించబడతాయి.",
  "faq.section4.q2.q": "క్లెయిమ్ ప్రక్రియ ఏమిటి?",
  "faq.section4.q2.a":
    "ఒక క్లెయిమ్‌ను ప్రారంభించడానికి, నామినీ మరణ ధృవీకరణ పత్రం, సభ్యుని ID, నామినీ గుర్తింపు పత్రాలు మరియు బ్యాంకు వివరాలను సభ్యుల పోర్టల్ ద్వారా లేదా మా మద్దతు బృందాన్ని సంప్రదించడం ద్వారా సమర్పించాలి. క్లెయిమ్ తర్వాత ధృవీకరించబడి, 7-10 పని దినాలలో ప్రాసెస్ చేయబడుతుంది.",
  "faq.section4.q3.q": "క్లెయిమ్ ప్రాసెసింగ్ ఎంత సమయం పడుతుంది?",
  "faq.section4.q3.a":
    "క్లెయిమ్ ప్రాసెసింగ్ సాధారణంగా పూర్తి పత్రాల సమర్పణ నుండి 7-10 పని దినాలు పడుతుంది. ఇది ధృవీకరణ, విరాళాల సేకరణ మరియు నామినీకి నిధుల పంపిణీని కలిగి ఉంటుంది.",
  "faq.section4.q4.q": "నేను ఒక క్లెయిమ్ యొక్క స్థితిని ట్రాక్ చేయవచ్చా?",
  "faq.section4.q4.a":
    "అవును, క్లెయిమ్ స్థితిని సభ్యుల పోర్టల్ ద్వారా నిజ-సమయంలో ట్రాక్ చేయవచ్చు. పత్రాల ధృవీకరణ, విరాళాల సేకరణ మరియు చెల్లింపు ప్రాసెసింగ్ సహా, క్లెయిమ్ ప్రక్రియ యొక్క ప్రతి దశలో మీకు నవీకరణలు అందుతాయి.",
  "faq.section4.q5.q": "క్లెయిమ్ ప్రాసెసింగ్ కోసం ఏ పత్రాలు అవసరం?",
  "faq.section4.q5.a":
    "అవసరమైన పత్రాలలో అసలు మరణ ధృవీకరణ పత్రం, సభ్యుని ID కార్డ్, నామినీ గుర్తింపు రుజువు (ఆధార్/పాన్), బ్యాంకు ఖాతా వివరాలు మరియు అవసరమైతే సంబంధ రుజువు ఉంటాయి. అన్ని పత్రాలు స్పష్టంగా మరియు చదవగలిగేలా ఉండాలి.",
  "faq.section4.q6.q": "ఒక విరాళం అవసరమైనప్పుడు నాకు ఎలా తెలుస్తుంది?",
  "faq.section4.q6.a":
    "ఒక విరాళం అవసరమైనప్పుడు మీకు SMS, ఇమెయిల్ మరియు యాప్ నోటిఫికేషన్ల ద్వారా తక్షణ నోటిఫికేషన్లు అందుతాయి. నోటిఫికేషన్‌లో మొత్తం, గడువు మరియు చెల్లింపు సూచనలు ఉంటాయి.",
  "faq.section4.q7.q": "నేను ఇతర సభ్యుల సమాచారాన్ని చూడవచ్చా?",
  "faq.section4.q7.a":
    "లేదు, సభ్యుల సమాచారం గోప్యంగా మరియు రక్షించబడింది. మీరు మీ స్వంత సభ్యత్వ వివరాలు మరియు విరాళాల చరిత్రను మాత్రమే చూడగలరు. వ్యక్తిగత సమాచారం లేకుండా కలెక్టివ్ గురించి సాధారణ గణాంకాలు పంచుకోవచ్చు.",
  "faq.section4.q8.q": "నా వ్యక్తిగత సమాచారాన్ని ఎలా నవీకరించాలి?",
  "faq.section4.q8.a":
    "'ప్రొఫైల్' విభాగం కింద సభ్యుల పోర్టల్ ద్వారా వ్యక్తిగత సమాచారాన్ని నవీకరించవచ్చు. కొన్ని మార్పులకు పత్రాల ధృవీకరణ మరియు పరిపాలనా బృందం నుండి ఆమోదం అవసరం కావచ్చు.",

  // Section 5: Legal & Compliance
  "faq.section5.q1.q": "జీవన్ సురక్ష చట్టబద్ధంగా ఉందా?",
  "faq.section5.q1.a":
    "జీవన్ సురక్ష అనేది తెలంగాణలో నమోదైన ఒక ట్రస్ట్ అయిన హెల్త్ గార్డ్ ఫౌండేషన్ ద్వారా ప్రారంభించబడిన ఒక సామూహిక విరాళ పథకం. ఈ ఫౌండేషన్ 12A మరియు 80G సర్టిఫికేషన్‌లను కలిగి ఉంది, ఇది భారతీయ పన్ను చట్టాలకు అనుగుణంగా ఉందని నిర్ధారిస్తుంది మరియు దాతలు పన్ను మినహాయింపులను క్లెయిమ్ చేయడానికి వీలు కల్పిస్తుంది. ఇది భారతదేశంలో ట్రస్ట్‌లను నియంత్రించే చట్టపరమైన ఫ్రేమ్‌వర్క్ కింద పనిచేస్తుంది.",
  "faq.section5.q2.q": "నిబంధనలు మరియు షరతులు ఏమిటి?",
  "faq.section5.q2.a":
    "వివరణాత్మక నిబంధనలు మరియు షరతులు మా వెబ్‌సైట్ మరియు సభ్యుల పోర్టల్‌లో అందుబాటులో ఉన్నాయి. ఇవి సభ్యత్వ నియమాలు, విరాళాల బాధ్యతలు, క్లెయిమ్ విధానాలు మరియు వివాద పరిష్కార యంత్రాంగాలను కవర్ చేస్తాయి. సభ్యులందరూ నమోదు సమయంలో ఈ నిబంధనలకు అంగీకరించాలి.",
  "faq.section5.q3.q": "సభ్యుల డేటా ఎలా రక్షించబడుతుంది?",
  "faq.section5.q3.a":
    "సభ్యుల డేటా పరిశ్రమ-ప్రామాణిక భద్రతా చర్యలను ఉపయోగించి రక్షించబడుతుంది, ఇందులో ఎన్‌క్రిప్షన్, సురక్షిత సర్వర్లు మరియు యాక్సెస్ నియంత్రణలు ఉంటాయి. మేము డేటా రక్షణ నిబంధనలకు అనుగుణంగా ఉంటాము మరియు సమ్మతి లేకుండా మూడవ పక్షాలతో వ్యక్తిగత సమాచారాన్ని పంచుకోము.",
  "faq.section5.q4.q": "వివాదాల విషయంలో ఏమి జరుగుతుంది?",
  "faq.section5.q4.a":
    "వివాదాలు ఒక నిర్మాణాత్మక ఫిర్యాదుల యంత్రాంగం ద్వారా పరిష్కరించబడతాయి. సభ్యులు సభ్యుల పోర్టల్ ద్వారా ఆందోళనలను లేవనెత్తవచ్చు, మరియు పరిష్కరించని సమస్యలు ఒక స్వతంత్ర మధ్యవర్తిత్వ ప్యానెల్‌కు పంపబడతాయి.",
  "faq.section5.q5.q": "ఏవైనా నియంత్రణ ఆమోదాలు ఉన్నాయా?",
  "faq.section5.q5.a":
    "జీవన్ సురక్ష ట్రస్ట్ నిర్మాణం కింద ఒక సామూహిక సామాజిక భద్రతా పథకంగా పనిచేస్తుంది. మేము వర్తించే అన్ని నిబంధనలకు అనుగుణంగా ఉంటాము మరియు నిరంతర వర్తింపును నిర్ధారించడానికి న్యాయ సలహాదారులతో కలిసి పనిచేస్తాము.",
  "faq.section5.q6.q": "పరిపాలక చట్టం ఏమిటి?",
  "faq.section5.q6.a":
    "కలెక్టివ్ భారతీయ చట్టాల ద్వారా, ప్రత్యేకంగా ట్రస్ట్ నమోదు చేయబడిన తెలంగాణ రాష్ట్ర చట్టాల ద్వారా పరిపాలించబడుతుంది. ఏవైనా చట్టపరమైన వివాదాలు తెలంగాణ కోర్టుల అధికార పరిధికి లోబడి ఉంటాయి.",
  "faq.section5.q7.q": "నిధులు ఎలా నిర్వహించబడతాయి మరియు ఆడిట్ చేయబడతాయి?",
  "faq.section5.q7.a":
    "అన్ని నిధులు నియమించబడిన ట్రస్ట్ ఖాతాల ద్వారా నిర్వహించబడతాయి మరియు సాధారణ అంతర్గత మరియు బాహ్య ఆడిట్‌లకు లోబడి ఉంటాయి. ఆర్థిక నివేదికలు సభ్యులకు వార్షికంగా అందుబాటులో ఉంచబడతాయి.",
  "faq.section5.q8.q": "ట్రస్ట్ రద్దు చేయబడితే ఏమి జరుగుతుంది?",
  "faq.section5.q8.a":
    "ట్రస్ట్ రద్దు యొక్క అసంభవమైన సందర్భంలో, ఏవైనా పెండింగ్‌లో ఉన్న క్లెయిమ్‌లు మరియు పరిపాలనా ఖర్చులను పరిష్కరించిన తర్వాత, సేకరించిన అన్ని నిధులు క్రియాశీల సభ్యుల మధ్య దామాషా ప్రకారం పంపిణీ చేయబడతాయి.",

  // Section 6: Communication & Support
  "faq.section6.q1.q": "కస్టమర్ మద్దతును ఎలా సంప్రదించాలి?",
  "faq.section6.q1.a":
    "కస్టమర్ మద్దతు బహుళ మార్గాల ద్వారా అందుబాటులో ఉంది: ఫోన్ / వాట్సాప్ (+91 78160 58717), ఇమెయిల్ (support@jeevansuraksha.org), వెబ్‌సైట్‌లో లైవ్ చాట్, మరియు మొబైల్ యాప్ ద్వారా. మద్దతు సోమవారం నుండి శుక్రవారం వరకు, ఉదయం 9 నుండి సాయంత్రం 6 వరకు అందుబాటులో ఉంటుంది.",
  "faq.section6.q2.q": "మద్దతు ఏ భాషలలో అందుబాటులో ఉంది?",
  "faq.section6.q2.a":
    "కస్టమర్ మద్దతు ఇంగ్లీష్, హిందీ, తెలుగు మరియు తమిళంలో అందుబాటులో ఉంది. మా మద్దతు బృందం సభ్యులకు వారి ఇష్టపడే భాషలో సహాయం చేయడానికి శిక్షణ పొందింది.",
  "faq.section6.q3.q": "నేను కలెక్టివ్ గురించి నవీకరణలను ఎలా అందుకుంటాను?",
  "faq.section6.q3.a":
    "నవీకరణలు SMS, ఇమెయిల్ వార్తాలేఖలు, యాప్ నోటిఫికేషన్ల ద్వారా పంపబడతాయి మరియు సభ్యుల పోర్టల్‌లో పోస్ట్ చేయబడతాయి. మీరు సభ్యుల పోర్టల్ సెట్టింగులలో మీ కమ్యూనికేషన్ ప్రాధాన్యతలను అనుకూలీకరించవచ్చు.",
  "faq.section6.q5.q": "నేను ఎంత తరచుగా కమ్యూనికేషన్లను అందుకుంటాను?",
  "faq.section6.q5.a":
    "సాధారణ కమ్యూనికేషన్లలో నెలవారీ వార్తాలేఖలు, క్లెయిమ్‌లు వచ్చినప్పుడు విరాళాల అభ్యర్థనలు, వార్షిక నివేదికలు మరియు ముఖ్యమైన నవీకరణలు ఉంటాయి. అత్యవసర విషయాల కోసం అవసరమైనప్పుడు అత్యవసర కమ్యూనికేషన్లు పంపబడతాయి.",
  "faq.section6.q6.q": "నేను కొన్ని కమ్యూనికేషన్ల నుండి వైదొలగవచ్చా?",
  "faq.section6.q6.a":
    "అవును, మీరు సభ్యుల పోర్టల్‌లో మీ కమ్యూనికేషన్ ప్రాధాన్యతలను అనుకూలీకరించవచ్చు. అయితే, విరాళాలు మరియు క్లెయిమ్‌లకు సంబంధించిన కొన్ని క్లిష్టమైన కమ్యూనికేషన్ల నుండి వైదొలగలేరు.",
  "faq.section6.q7.q": "నేను అభిప్రాయం లేదా సూచనలను ఎలా అందించాలి?",
  "faq.section6.q7.a":
    "అభిప్రాయం మరియు సూచనలను సభ్యుల పోర్టల్, మొబైల్ యాప్ ద్వారా లేదా feedback@jeevansuraksha.org కు ఇమెయిల్ చేయడం ద్వారా సమర్పించవచ్చు. మేము సభ్యుల ఇన్‌పుట్‌ను విలువైనదిగా భావిస్తాము మరియు సేవా మెరుగుదలల కోసం సూచనలను క్రమం తప్పకుండా సమీక్షిస్తాము.",
  "faq.section6.q8.q": "సభ్యుల సమావేశాలు లేదా ఈవెంట్‌లు ఉన్నాయా?",
  "faq.section6.q8.a":
    "అవును, మేము ప్రధాన నగరాలలో త్రైమాసిక సభ్యుల సమావేశాలను మరియు వార్షిక సాధారణ సమావేశాలను నిర్వహిస్తాము. ఈ ఈవెంట్‌లు సభ్యులకు పరస్పరం సంభాషించడానికి, కలెక్టివ్ పనితీరు గురించి తెలుసుకోవడానికి మరియు అభిప్రాయాన్ని అందించడానికి అవకాశాలను అందిస్తాయి.",
  //report
  "reportClaim.hero.title": "క్లెయిమ్‌ను నివేదించండి",
  "reportClaim.hero.breadcrumbHome": "హోమ్",
  "reportClaim.hero.breadcrumbReportClaim": "క్లెయిమ్ నివేదించండి",

  "reportClaim.form.title": "క్లెయిమ్ నివేదన ఫారం",
  "reportClaim.form.subtitle":
    "సభ్యుని మరణాన్ని నివేదించడానికి, దయచేసి దిగువ ఫారమ్‌ను ఖచ్చితమైన వివరాలతో పూరించండి.",
  "reportClaim.form.label.registrationNo":
    "మరణించిన సభ్యుని రిజిస్ట్రేషన్ నెం.",
  "reportClaim.form.label.deceasedPhoto": "మరణించిన సభ్యుని ఫోటో",
  "reportClaim.form.label.dateOfDeath": "మరణించిన తేదీ",
  "reportClaim.form.label.deathCertificate": "మరణ ధృవీకరణ పత్రం (PDF/చిత్రం)",
  "reportClaim.form.heading.nominee": "నామినీ వివరాలు",
  "reportClaim.form.label.nomineeName": "నామినీ పూర్తి పేరు (బ్యాంక్ ప్రకారం)",
  "reportClaim.form.label.nomineeAccount": "నామినీ బ్యాంక్ ఖాతా నంబర్",
  "reportClaim.form.button.submit": "క్లెయిమ్ సమర్పించండి",
  "reportClaim.form.button.submitting": "సమర్పిస్తోంది...",
  "reportClaim.form.error.required": "ఈ ఫీల్డ్ అవసరం",
  "reportClaim.form.success":
    "క్లెయిమ్ విజయవంతంగా నివేదించబడింది! మేము త్వరలో సమీక్షిస్తాము.",
  "reportClaim.form.error.general":
    "క్లెయిమ్ నివేదించడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.",

  "reportClaim.activeClaims.title": "యాక్టివ్ క్లెయిమ్‌లు",
  "reportClaim.activeClaims.subtitle":
    "మన మరణించిన సభ్యుల కుటుంబాలకు మద్దతుగా విరాళం ఇవ్వండి.",
  "reportClaim.activeClaims.loading":
    "యాక్టివ్ క్లెయిమ్‌లు లోడ్ అవుతున్నాయి...",
  "reportClaim.activeClaims.noClaims":
    "ప్రస్తుతానికి యాక్టివ్ క్లెయిమ్‌లు లేవు.",
  "reportClaim.activeClaims.deceased": "మరణించిన వారి పేరు & ఫోటో",
  "reportClaim.activeClaims.nominee": "నామినీ పేరు",
  "reportClaim.activeClaims.plan": "కాంట్రిబ్యూషన్ ప్లాన్",
  "reportClaim.activeClaims.amount": "అవసరమైన కాంట్రిబ్యూషన్ మొత్తం",

  // Donate Us Page
  "donateUs.title": "జీవన్ సురక్షకు స్వాగతం",
  "donateUs.loadingGateway": "చెల్లింపు గేట్‌వే లోడ్ అవుతోంది...",
  "donateUs.processingRequest": "మీ విరాళం అభ్యర్థన ప్రాసెస్ చేయబడుతోంది...",
  "donateUs.label.name": "పేరు",
  "donateUs.error.nameRequired": "పేరు అవసరం",
  "donateUs.label.mobile": "మొబైల్ నంబర్",
  "donateUs.error.mobileRequired": "మొబైల్ నంబర్ అవసరం",
  "donateUs.error.mobilePattern":
    "దయచేసి చెల్లుబాటు అయ్యే 10-అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి",
  "donateUs.placeholder.mobile": "10-అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి",
  "donateUs.label.amount": "మొత్తాన్ని నమోదు చేయండి",
  "donateUs.error.amountRequired": "మొత్తం అవసరం",
  "donateUs.error.amountMin": "మొత్తం కనీసం ₹1 ఉండాలి",
  "donateUs.placeholder.amount": "కనీసం ₹1",
  "donateUs.label.email": "ఇమెయిల్ ఐడి (ఐచ్ఛికం)",
  "donateUs.error.emailPattern":
    "దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామాను నమోదు చేయండి",
  "donateUs.placeholder.email": "your.email@example.com",
  "donateUs.label.address": "చిరునామా (ఐచ్ఛికం)",
  "donateUs.taxInfo":
    "మీరు పన్ను మినహాయింపు పొందాలనుకుంటే, దిగువ ఫీల్డ్‌లను పూరించండి లేదా ఖాళీగా వదిలేయండి",
  "donateUs.label.pan": "పాన్ నంబర్",
  "donateUs.error.panPattern":
    "దయచేసి చెల్లుబాటు అయ్యే పాన్ నంబర్‌ను నమోదు చేయండి (ఉదా., ABCDE1234F)",
  "donateUs.placeholder.pan": "ABCDE1234F",
  "donateUs.label.bankName": "బ్యాంక్ పేరు",
  "donateUs.label.branchName": "శాఖ పేరు",
  "donateUs.button.processing": "ప్రాసెస్ అవుతోంది...",
  "donateUs.button.donateNow": "ఇప్పుడే విరాళం ఇవ్వండి",
  "donateUs.alert.sdkError":
    "చెల్లింపు గేట్‌వేను లోడ్ చేయడంలో విఫలమైంది. దయచేసి రిఫ్రెష్ చేసి మళ్ళీ ప్రయత్నించండి.",
  "donateUs.alert.paymentErrorPrefix": "చెల్లింపు లోపం:",
  "donateUs.alert.gatewayErrorPrefix": "చెల్లింపు గేట్‌వే లోపం:",
  "donateUs.alert.unknownError": "తెలియని లోపం సంభవించింది",
  "donateUs.alert.tryAgain": " దయచేసి మళ్ళీ ప్రయత్నించండి.",
  // IT & Govt Collective Page
  "itGovtCollective.hero.title": "ఐటి & ప్రభుత్వ ఉద్యోగుల కలెక్టివ్",
  "itGovtCollective.hero.breadcrumbHome": "హోమ్",
  "itGovtCollective.hero.breadcrumbCollective":
    "ఐటి & ప్రభుత్వ ఉద్యోగుల కలెక్టివ్",
  "itGovtCollective.intro.title":
    "₹1 కోటి & ₹50 లక్షల కలెక్టివ్‌లు – ఐటి & ప్రభుత్వ ఉద్యోగులు",
  "itGovtCollective.intro.description":
    "₹1 కోటి & ₹50 లక్షల కలెక్టివ్‌లు ఐటి నిపుణులు మరియు ప్రభుత్వ ఉద్యోగుల కోసం ప్రత్యేకంగా ఒక మద్దతు చొరవ. దురదృష్టకరమైన మరణం సంభవించినప్పుడు సభ్యుల కుటుంబాలకు ఆర్థిక భద్రతా వలయాన్ని సృష్టించడం దీని లక్ష్యం. ఒక తోటి సభ్యుడు మరణించినప్పుడు ప్రతి సభ్యుడు ఒక చిన్న మొత్తాన్ని అందించడానికి ప్రతిజ్ఞ చేస్తారు, వారి కుటుంబానికి తక్షణమే మద్దతు లభించేలా చూస్తారు.",
  "itGovtCollective.howItWorks.title": "ఇది ఎలా పనిచేస్తుంది",
  "itGovtCollective.howItWorks.card1.title": "సభ్యత్వ నమోదు",
  "itGovtCollective.howItWorks.card1.description":
    "ఐటి నిపుణులు మరియు ప్రభుత్వ ఉద్యోగులు నామమాత్రపు నమోదు మరియు వార్షిక పునరుద్ధరణ రుసుము ₹100/- చెల్లించడం ద్వారా ఈ కలెక్టివ్‌లో చేరవచ్చు. వారి చెల్లుబాటు అయ్యే ఉద్యోగి ID మరియు నామినీ వివరాలను అప్‌లోడ్ చేయాలి.",
  "itGovtCollective.howItWorks.card2.title": "మద్దతుకు ప్రతిజ్ఞ",
  "itGovtCollective.howItWorks.card2.description":
    "ప్రతి సభ్యుడు ఒక తోటి సభ్యుని దురదృష్టకరమైన మరణంపై ఒక నిర్దిష్ట మొత్తాన్ని అందించడానికి ప్రతిజ్ఞ చేస్తారు.",
  "itGovtCollective.howItWorks.card3.title": "నిధుల బదిలీ",
  "itGovtCollective.howItWorks.card3.description":
    "ఒక సభ్యుని మరణం ధృవీకరించబడిన తర్వాత, మిగిలిన సభ్యులందరూ వారి ప్రతిజ్ఞ చేసిన మొత్తాన్ని అందిస్తారు, మరియు మొత్తం నిధి మరణించిన సభ్యుని నామినీకి నేరుగా బదిలీ చేయబడుతుంది.",
  "itGovtCollective.howItWorks.card4.title": "ప్రారంభానికి ప్రవేశ పరిమితి",
  "itGovtCollective.howItWorks.card4.description":
    "కనీసం 1,000 మంది సభ్యులు నమోదు చేసుకున్న తర్వాత కలెక్టివ్ అధికారికంగా ప్రారంభించబడుతుంది.",
  "itGovtCollective.howItWorks.card5.title": "కాలక్రమేణా తగ్గే విరాళం",
  "itGovtCollective.howItWorks.card5.description":
    "సభ్యుల సంఖ్య పెరిగేకొద్దీ, ప్రతి మరణానికి వ్యక్తిగత విరాళం తగ్గుతుంది, అయితే సేకరించిన మొత్తం నిధి లక్ష్యాన్ని చేరుకుంటుంది.",
  "itGovtCollective.table.title1Cr":
    "విరాళాల పట్టిక – దృష్టాంత ప్రయోజనం – ₹1 కోటి కలెక్టివ్",
  "itGovtCollective.table.title50L":
    "విరాళాల పట్టిక – దృష్టాంత ప్రయోజనం – ₹50 లక్షల కలెక్టివ్",
  "itGovtCollective.table.headerMembers": "సభ్యుల సంఖ్య",
  "itGovtCollective.table.headerContribution": "ప్రతి సభ్యునికి విరాళం (₹)",
  "itGovtCollective.table.headerCorpus": "మొత్తం సేకరించిన నిధి (₹)",
  "itGovtCollective.benefits.title": "ముఖ్య ప్రయోజనాలు",
  "itGovtCollective.benefits.item1":
    "<strong>సరసమైన విరాళం:</strong> కలెక్టివ్ ఎంత పెద్దదైతే, ప్రతి వ్యక్తి విరాళం అంత తక్కువగా ఉంటుంది.",
  "itGovtCollective.benefits.item2":
    "<strong>ప్రత్యక్ష & పారదర్శకం:</strong> నిధులు మధ్యవర్తులు లేకుండా మరణించిన సభ్యుని నామినీకి నేరుగా వెళ్తాయి.",
  "itGovtCollective.benefits.item3":
    "<strong>బలమైన సమాజ మద్దతు:</strong> ఐటి మరియు ప్రభుత్వ ఉద్యోగుల మధ్య ఆర్థిక భద్రతను నిర్ధారించే ఒక సామూహిక ప్రయత్నం.",
  "itGovtCollective.pledge.title": "ప్రతిజ్ఞ",
  "itGovtCollective.pledge.item1":
    "<strong>తోటి సభ్యులకు మద్దతు:</strong> ఈ కలెక్టివ్ నిధికి తక్షణమే మరియు స్థిరంగా విరాళం ఇవ్వడం.",
  "itGovtCollective.pledge.item2":
    "<strong>సమగ్రతను కాపాడటం:</strong> ఖచ్చితమైన వ్యక్తిగత సమాచారాన్ని అందించడం మరియు కలెక్టివ్ మార్గదర్శకాలకు కట్టుబడి ఉండటం.",
  "itGovtCollective.pledge.item3":
    "<strong>పారదర్శకతను ప్రోత్సహించడం:</strong> బహిరంగ సంభాషణలో పాల్గొనడం మరియు నిర్ణయాధికార ప్రక్రియలలో పాలుపంచుకోవడం.",
  "itGovtCollective.pledge.item4":
    "<strong>సమాజ వృద్ధిని పెంపొందించడం:</strong> ఇతరులను చేరమని ప్రోత్సహించడం మరియు మన కలెక్టివ్‌ను బలోపేతం చేయడం.",
  "itGovtCollective.pledge.item5":
    "<strong>గోప్యతను గౌరవించడం:</strong> తోటి సభ్యుల గోప్యతను అత్యంత జాగ్రత్తతో గౌరవించడం.",
  "itGovtCollective.pledge.item6":
    "<strong>ఐకమత్యాన్ని ప్రదర్శించడం:</strong> మన బలం ఐక్యతలో ఉందని గుర్తించి, నేను నా తోటి సభ్యులతో నిలబడతాను.",
  "itGovtCollective.disclaimer.title": "ముఖ్యమైన నిరాకరణ",
  "itGovtCollective.disclaimer.item1":
    "ప్రతి క్లెయిమ్‌కు మొత్తం విరాళం అభ్యర్థన సమయంలో క్రియాశీలక విరాళదారుల సంఖ్యపై ఆధారపడి ఉంటుంది.",
  "itGovtCollective.disclaimer.item2":
    "ఐటి & ప్రభుత్వ ప్రణాళికకు పూర్తి క్లెయిమ్ విలువ హామీ ఇవ్వబడింది; వాస్తవ మొత్తం అందుకున్న విరాళాలపై ఆధారపడి ఉంటుంది.",
  "itGovtCollective.disclaimer.item3":
    "అవసరమైన మొత్తం సేకరించబడకపోతే, నామినీ క్రియాశీల సభ్యులు అందించిన మొత్తం మాత్రమే అందుకుంటారు.",
  // Private & Business Collective Page
  "privateCollective.hero.title": "ప్రైవేట్ ఉద్యోగులు & వ్యాపార యజమానులు",
  "privateCollective.hero.breadcrumbHome": "హోమ్",
  "privateCollective.hero.breadcrumbCollective":
    "ప్రైవేట్ ఉద్యోగులు & వ్యాపార యజమానులు",
  "privateCollective.intro.title":
    "₹1 కోటి, ₹50 లక్షలు & ₹25 లక్షల కలెక్టివ్‌లు – ప్రైవేట్ ఉద్యోగులు & వ్యాపార యజమానులు",
  "privateCollective.intro.description":
    "₹1 కోటి, ₹50 లక్షలు, & ₹25 లక్షల కలెక్టివ్‌లు అన్ని ప్రైవేట్ ఉద్యోగులు మరియు వ్యాపార యజమానుల కోసం ప్రత్యేకంగా ఒక మద్దతు చొరవ. దురదృష్టకరమైన మరణం సంభవించినప్పుడు సభ్యుల కుటుంబాలకు ఆర్థిక భద్రతా వలయాన్ని సృష్టించడం దీని లక్ష్యం. ఒక తోటి సభ్యుడు మరణించినప్పుడు ప్రతి సభ్యుడు ఒక చిన్న మొత్తాన్ని అందించడానికి ప్రతిజ్ఞ చేస్తారు, వారి కుటుంబానికి తక్షణమే మద్దతు లభించేలా చూస్తారు.",
  "privateCollective.howItWorks.title": "ఇది ఎలా పనిచేస్తుంది",
  "privateCollective.howItWorks.card1.title": "సభ్యత్వ నమోదు",
  "privateCollective.howItWorks.card1.description":
    "సాధారణ ప్రజలు & వ్యాపార యజమానులు నామమాత్రపు నమోదు మరియు వార్షిక పునరుద్ధరణ రుసుము ₹100/- చెల్లించడం ద్వారా ఈ కలెక్టివ్‌లో చేరవచ్చు. వారి ఆధార్/ఓటర్ ఐడి/లైసెన్స్/పాస్‌పోర్ట్, మొదలైనవి మరియు నామినీ వివరాలను అప్‌లోడ్ చేయాలి.",
  "privateCollective.howItWorks.card2.title": "మద్దతుకు ప్రతిజ్ఞ",
  "privateCollective.howItWorks.card2.description":
    "ప్రతి సభ్యుడు ఒక తోటి సభ్యుని దురదృష్టకరమైన మరణంపై ఒక నిర్దిష్ట మొత్తాన్ని అందించడానికి ప్రతిజ్ఞ చేస్తారు.",
  "privateCollective.howItWorks.card3.title": "నిధుల బదిలీ",
  "privateCollective.howItWorks.card3.description":
    "ఒక సభ్యుని మరణం ధృవీకరించబడిన తర్వాత, మిగిలిన సభ్యులందరూ వారి ప్రతిజ్ఞ చేసిన మొత్తాన్ని అందిస్తారు, మరియు మొత్తం నిధి మరణించిన సభ్యుని నామినీకి నేరుగా బదిలీ చేయబడుతుంది.",
  "privateCollective.howItWorks.card4.title": "ప్రారంభానికి ప్రవేశ పరిమితి",
  "privateCollective.howItWorks.card4.description":
    "కనీసం 1,000 మంది సభ్యులు నమోదు చేసుకున్న తర్వాత కలెక్టివ్ అధికారికంగా ప్రారంభించబడుతుంది.",
  "privateCollective.howItWorks.card5.title": "కాలక్రమేణా తగ్గే విరాళం",
  "privateCollective.howItWorks.card5.description":
    "సభ్యుల సంఖ్య పెరిగేకొద్దీ, ప్రతి మరణానికి వ్యక్తిగత విరాళం తగ్గుతుంది, అయితే సేకరించిన మొత్తం నిధి లక్ష్యాన్ని చేరుకుంటుంది.",
  "privateCollective.table.title1Cr":
    "విరాళాల పట్టిక – దృష్టాంత ప్రయోజనం – ₹1 కోటి కలెక్టివ్",
  "privateCollective.table.title50L":
    "విరాళాల పట్టిక – దృష్టాంత ప్రయోజనం – ₹50 లక్షల కలెక్టివ్",
  "privateCollective.table.title25L":
    "విరాళాల పట్టిక – దృష్టాంత ప్రయోజనం – ₹25 లక్షల కలెక్టివ్",
  "privateCollective.table.headerMembers": "సభ్యుల సంఖ్య",
  "privateCollective.table.headerContribution": "ప్రతి సభ్యునికి విరాళం (₹)",
  "privateCollective.table.headerCorpus": "మొత్తం సేకరించిన నిధి (₹)",
  "privateCollective.benefits.title": "ముఖ్య ప్రయోజనాలు",
  "privateCollective.benefits.item1":
    "<strong>సరసమైన విరాళం:</strong> కలెక్టివ్ ఎంత పెద్దదైతే, ప్రతి వ్యక్తి విరాళం అంత తక్కువగా ఉంటుంది.",
  "privateCollective.benefits.item2":
    "<strong>ప్రత్యక్ష & పారదర్శకం:</strong> నిధులు మధ్యవర్తులు లేకుండా మరణించిన సభ్యుని నామినీకి నేరుగా వెళ్తాయి.",
  "privateCollective.benefits.item3":
    "<strong>బలమైన సమాజ మద్దతు:</strong> అన్ని సమాజ సభ్యులకు ఆర్థిక భద్రతను నిర్ధారించే ఒక సామూహిక ప్రయత్నం.",
  "privateCollective.join.title": "ఉద్యమంలో చేరండి",
  "privateCollective.join.description":
    "₹1 కోటి కలెక్టివ్ సభ్యునిగా మారి, మీ కుటుంబ ఆర్థిక భవిష్యత్తును కాపాడుకోవడానికి, ఈరోజే సైన్ అప్ చేసి, ప్రతిజ్ఞ చేయండి!",
  "privateCollective.pledge.title": "ప్రతిజ్ఞ",
  "privateCollective.pledge.item1":
    "<strong>తోటి సభ్యులకు మద్దతు:</strong> మరణించిన తోటి సభ్యుల నామినీలకు సకాలంలో సహాయం అందించడానికి ఈ కలెక్టివ్ నిధికి తక్షణమే మరియు స్థిరంగా విరాళం ఇవ్వడం.",
  "privateCollective.pledge.item2":
    "<strong>సమగ్రతను కాపాడటం:</strong> ఖచ్చితమైన వ్యక్తిగత సమాచారాన్ని అందించడం, కలెక్టివ్ మార్గదర్శకాలకు కట్టుబడి ఉండటం, మరియు సమాజం యొక్క నమ్మకం మరియు సంక్షేమానికి భంగం కలిగించే ఏ చర్యల నుండి దూరంగా ఉండటం.",
  "privateCollective.pledge.item3":
    "<strong>పారదర్శకతను ప్రోత్సహించడం:</strong> బహిరంగ సంభాషణలో పాల్గొనడం, సాధ్యమైనప్పుడు నిర్ణయాధికార ప్రక్రియలలో పాలుపంచుకోవడం, మరియు స్పష్టమైన మరియు అందుబాటులో ఉండే రికార్డులను నిర్వహించడానికి కలెక్టివ్ ప్రయత్నాలకు మద్దతు ఇవ్వడం.",
  "privateCollective.pledge.item4":
    "<strong>సమాజ వృద్ధిని పెంపొందించడం:</strong> ఇతరులను చేరమని ప్రోత్సహించడం మరియు మన కలెక్టివ్‌ను బలోపేతం చేయడం, తద్వారా అవసరమైన సమయాల్లో ఒకరికొకరు మద్దతు ఇచ్చే మన సామర్థ్యాన్ని పెంచుకోవడం.",
  "privateCollective.pledge.item5":
    "<strong>గోప్యతను గౌరవించడం:</strong> తోటి సభ్యుల గోప్యతను గౌరవించడం మరియు అన్ని వ్యక్తిగత సమాచారాన్ని అత్యంత జాగ్రత్తతో మరియు విచక్షణతో నిర్వహించడం.",
  "privateCollective.pledge.item6":
    "<strong>ఐకమత్యాన్ని ప్రదర్శించడం:</strong> మన బలం ఐక్యతలో ఉందని గుర్తించి, నేను నా తోటి సభ్యులతో నిలబడతాను, ఆర్థిక విరాళాలకు మించి మద్దతు మరియు కరుణను అందిస్తాను.",
  "privateCollective.pledge.finalPara":
    "ఈ ప్రతిజ్ఞ చేయడం ద్వారా, నేను జీవన్ సురక్ష సోషల్ సెక్యూరిటీ కలెక్టివ్ యొక్క విలువలు మరియు లక్ష్యానికి నా అంకితభావాన్ని ధృవీకరిస్తున్నాను, మన భాగస్వామ్య నిబద్ధత అన్ని సభ్యుల శ్రేయస్సు మరియు భద్రతను నిర్ధారిస్తుందని అర్థం చేసుకున్నాను.",
  "privateCollective.disclaimer.title": "ముఖ్యమైన నిరాకరణ",
  "privateCollective.disclaimer.item1":
    "ప్రతి క్లెయిమ్‌కు మొత్తం విరాళం అభ్యర్థన సమయంలో క్రియాశీలక విరాళదారుల సంఖ్యపై ఆధారపడి ఉంటుంది.",
  "privateCollective.disclaimer.item2":
    "పూర్తి క్లెయిమ్ విలువకు హామీ లేదు; వాస్తవ మొత్తం అందుకున్న విరాళాలపై ఆధారపడి ఉంటుంది.",
  "privateCollective.disclaimer.item3":
    "అవసరమైన మొత్తం సేకరించబడకపోతే, నామినీ క్రియాశీల సభ్యులు అందించిన మొత్తం మాత్రమే అందుకుంటారు.",

  // Terms & Conditions Page
  "terms.hero.title": "నిబంధనలు & షరతులు",
  "terms.hero.breadcrumb": "నిబంధనలు & షరతులు",
  "terms.content.title": "నిబంధనలు మరియు షరతులు",
  "terms.content.intro":
    "{companyName}కు స్వాగతం. మా వెబ్‌సైట్‌ను యాక్సెస్ చేయడం మరియు ఉపయోగించడం ద్వారా, మీరు ఈ క్రింది నిబంధనలు మరియు షరతులకు అంగీకరిస్తున్నారు. దయచేసి వాటిని జాగ్రత్తగా చదవండి. మీరు ఈ నిబంధనలతో ఏకీభవించకపోతే, దయచేసి మా వెబ్‌సైట్‌ను ఉపయోగించవద్దు.",
  "terms.content.thankYou":
    "మా వెబ్‌సైట్‌ను సందర్శించినందుకు మరియు మా మిషన్‌కు మద్దతు ఇచ్చినందుకు ధన్యవాదాలు.",
  "terms.section.acceptance.title": "1. నిబంధనల అంగీకారం",
  "terms.section.acceptance.p1":
    "మా వెబ్‌సైట్‌ను ఉపయోగించడం ద్వారా, మీరు ఈ నిబంధనలు మరియు షరతులను మరియు వర్తించే ఏవైనా చట్టాలు మరియు నిబంధనలను చదివి, అర్థం చేసుకుని, కట్టుబడి ఉంటారని మీరు అంగీకరిస్తున్నారు. మేము ఎప్పటికప్పుడు ఈ నిబంధనలను నవీకరించవచ్చు మరియు వాటిని క్రమానుగతంగా సమీక్షించడం మీ బాధ్యత.",
  "terms.section.useOfWebsite.title": "2. వెబ్‌సైట్ వాడకం",
  "terms.section.useOfWebsite.p1":
    "మీరు మా వెబ్‌సైట్‌ను చట్టబద్ధమైన ప్రయోజనాల కోసం మాత్రమే ఉపయోగించడానికి అంగీకరిస్తున్నారు. మీరు మా సైట్‌ను దీని కోసం ఉపయోగించకూడదు:",
  "terms.section.useOfWebsite.l1":
    "ఏదైనా చట్టవిరుద్ధమైన కార్యకలాపాలలో పాల్గొనడం లేదా వర్తించే ఏవైనా చట్టాలు లేదా నిబంధనలను ఉల్లంఘించడం.",
  "terms.section.useOfWebsite.l2":
    "వైరస్‌లు, మాల్వేర్ లేదా ఇతర హానికరమైన కోడ్‌తో సహా హానికరమైన లేదా హానికరమైన కంటెంట్‌ను ప్రసారం చేయడం.",
  "terms.section.useOfWebsite.l3":
    "ఏదైనా వ్యక్తి లేదా సంస్థను అనుకరించడం లేదా ఏదైనా వ్యక్తి లేదా సంస్థతో మీ అనుబంధాన్ని తప్పుగా సూచించడం.",
  "terms.section.intellectualProperty.title": "3. మేధో సంపత్తి",
  "terms.section.intellectualProperty.p1":
    "మా వెబ్‌సైట్‌లోని టెక్స్ట్, చిత్రాలు, లోగోలు మరియు ఇతర మెటీరియల్‌లతో సహా మొత్తం కంటెంట్ {companyName} లేదా దాని లైసెన్సర్‌ల ఆస్తి మరియు మేధో సంపత్తి చట్టాల ద్వారా రక్షించబడింది. మా ముందస్తు వ్రాతపూర్వక అనుమతి లేకుండా మీరు ఏ కంటెంట్ నుండి పునరుత్పత్తి, పంపిణీ, సవరించడం లేదా ఉత్పన్న రచనలను సృష్టించకూడదు.",
  "terms.section.userContributions.title": "4. వినియోగదారు రచనలు",
  "terms.section.userContributions.p1":
    "మీరు వ్యాఖ్యలు లేదా అభిప్రాయం వంటి ఏవైనా కంటెంట్ లేదా మెటీరియల్‌లను మా వెబ్‌సైట్‌కు సమర్పించినట్లయితే, అటువంటి కంటెంట్‌ను ఉపయోగించడానికి, పునరుత్పత్తి చేయడానికి, సవరించడానికి మరియు పంపిణీ చేయడానికి మీరు మాకు ప్రత్యేకమైన, రాయల్టీ-రహిత, శాశ్వతమైన మరియు ప్రపంచవ్యాప్త లైసెన్స్‌ను మంజూరు చేస్తారు. ఈ లైసెన్స్‌ను మంజూరు చేసే హక్కులు మీకు ఉన్నాయని మరియు మీ కంటెంట్ ఏ మూడవ పక్షం హక్కులను ఉల్లంఘించదని మీరు ప్రాతినిధ్యం వహిస్తున్నారు మరియు హామీ ఇస్తున్నారు.",
  "terms.section.thirdParty.title": "5. మూడవ-పక్ష వెబ్‌సైట్‌లకు లింకులు",
  "terms.section.thirdParty.p1":
    "మా వెబ్‌సైట్ మీ సౌలభ్యం కోసం మూడవ పక్ష వెబ్‌సైట్‌లకు లింక్‌లను కలిగి ఉండవచ్చు. మేము ఈ సైట్‌ల కంటెంట్ లేదా పద్ధతులకు ఆమోదం తెలపము లేదా బాధ్యత వహించము. మూడవ పక్ష వెబ్‌సైట్‌లను యాక్సెస్ చేయడం మరియు ఉపయోగించడం మీ స్వంత పూచీపై ఉంటుంది.",
  "terms.section.liability.title": "6. బాధ్యత యొక్క పరిమితి",
  "terms.section.liability.p1":
    "చట్టం ద్వారా అనుమతించబడిన పూర్తి స్థాయిలో, మా వెబ్‌సైట్ లేదా మా సైట్‌లోని ఏదైనా కంటెంట్‌ను మీరు ఉపయోగించడం వల్ల ఉత్పన్నమయ్యే ఏవైనా ప్రత్యక్ష, పరోక్ష, యాదృచ్ఛిక, పర్యవసానమైన లేదా శిక్షార్హమైన నష్టాలకు {companyName} బాధ్యత వహించదు. మా సైట్‌లోని కంటెంట్ యొక్క ఖచ్చితత్వం, విశ్వసనీయత లేదా సంపూర్ణత గురించి మేము ఎటువంటి వారెంటీలు లేదా ప్రాతినిధ్యాలు ఇవ్వము.",
  "terms.section.indemnification.title": "7. నష్టపరిహారం",
  "terms.section.indemnification.p1":
    "మీరు మా వెబ్‌సైట్‌ను ఉపయోగించడం లేదా ఈ నిబంధనలను ఉల్లంఘించడం వల్ల ఉత్పన్నమయ్యే ఏవైనా క్లెయిమ్‌లు, నష్టాలు, నష్టాలు, బాధ్యతలు లేదా ఖర్చుల నుండి {companyName}, దాని అనుబంధ సంస్థలు, అధికారులు, డైరెక్టర్లు, ఉద్యోగులు మరియు ఏజెంట్లను నష్టపరిహారం చెల్లించడానికి మరియు నిరపాయంగా ఉంచడానికి మీరు అంగీకరిస్తున్నారు.",
  "terms.section.governingLaw.title": "8. పాలక చట్టం",
  "terms.section.governingLaw.p1":
    "ఈ నిబంధనలు మరియు షరతులు చట్ట సూత్రాల సంఘర్షణతో సంబంధం లేకుండా చట్టాలకు అనుగుణంగా నిర్వహించబడతాయి మరియు వివరించబడతాయి. ఈ నిబంధనల కింద లేదా వాటికి సంబంధించి ఉత్పన్నమయ్యే ఏవైనా వివాదాలు న్యాయస్థానాల ప్రత్యేక అధికార పరిధికి లోబడి ఉంటాయి.",
  "terms.section.contact.title": "9. సంప్రదింపు సమాచారం",
  "terms.section.contact.p1":
    "ఈ నిబంధనలు మరియు షరతుల గురించి మీకు ఏవైనా ప్రశ్నలు లేదా ఆందోళనలు ఉంటే, దయచేసి మమ్మల్ని ఇక్కడ సంప్రదించండి:",
  "terms.section.contact.p2": "{companyName}",
  // Refund Policy Page
  "refund.hero.title": "వాపసు మరియు రిటర్న్ విధానం",
  "refund.hero.breadcrumb": "వాపసు మరియు రిటర్న్ విధానం",
  "refund.content.effectiveDate": "అమలు తేదీ: మార్చి 23, 2025",
  "refund.content.intro":
    "జీవన్ సురక్ష సోషల్ సెక్యూరిటీ కలెక్టివ్, హెల్త్ గార్డ్ ఫౌండేషన్ యొక్క ఒక చొరవ, వద్ద మేము మా ఆర్థిక లావాదేవీలలో పారదర్శకతను నిర్ధారించడానికి ప్రయత్నిస్తాము. ఈ వాపసు విధానం వాపసులు ఏ పరిస్థితులలో మంజూరు చేయబడతాయో వివరిస్తుంది.",
  "refund.content.conclusion":
    "మా సేవలను ఉపయోగించడం ద్వారా, మీరు ఈ విధానాలలో పేర్కొన్న నిబంధనలకు అంగీకరిస్తున్నారు.",
  "refund.section.eligibility.title": "1. వాపసులకు అర్హత",
  "refund.section.eligibility.p1":
    "తప్పు లావాదేవీలు లేదా నకిలీ చెల్లింపుల సందర్భాలలో వాపసులు జారీ చేయబడవచ్చు.",
  "refund.section.eligibility.p2":
    "సభ్యత్వ ఛార్జీలు చేసిన 72 గంటలలోపు మీ రశీదును క్లెయిమ్ చేయడానికి ముందు అభ్యర్థన చేసినట్లయితే మాత్రమే వాపసులు పరిగణించబడతాయి, ఏది ముందుగా జరిగితే అది.",
  "refund.section.nonRefundable.title": "2. తిరిగి చెల్లించబడని లావాదేవీలు",
  "refund.section.nonRefundable.p1":
    "ఏవైనా లావాదేవీల ఛార్జీలు తిరిగి చెల్లించబడవు.",
  "refund.section.nonRefundable.p2":
    "ఒకసారి ప్రాసెస్ చేయబడిన క్లెయిమ్‌లు మరియు ప్రయోజనాలు తిరిగి మార్చబడవు.",
  "refund.section.process.title": "3. వాపసు ప్రక్రియ",
  "refund.section.process.p1":
    "వినియోగదారులు లావాదేవీ వివరాలు మరియు సహాయక పత్రాలతో ఒక అధికారిక అభ్యర్థనను సమర్పించాలి.",
  "refund.section.process.p2":
    "వాపసులు, ఆమోదించబడితే, 72 గంటలలోపు అసలు చెల్లింపు పద్ధతి ద్వారా ప్రాసెస్ చేయబడతాయి.",
  "refund.section.contact.title": "4. సంప్రదింపు సమాచారం",
  "refund.section.contact.p1":
    "మా గోప్యతా విధానం, వినియోగ నిబంధనలు లేదా వాపసు విధానం గురించి ప్రశ్నల కోసం, దయచేసి మమ్మల్ని ఇక్కడ సంప్రదించండి:",
  "refund.section.contact.visitUs": "మమ్మల్ని సందర్శించండి:",
  "refund.section.contact.address.l1": "1-63, అమడబకుల (గ్రామం),",
  "refund.section.contact.address.l2": "కొత్తకోట (మండలం),",
  "refund.section.contact.address.l3": "వనపర్తి (జిల్లా),",
  "refund.section.contact.address.l4": "తెలంగాణ, భారతదేశం",
  "refund.section.contact.mailUs": "మాకు మెయిల్ చేయండి:",
  "refund.section.contact.email": "info@healthguard.org.in",
  "refund.section.contact.phoneUs": "మాకు ఫోన్ చేయండి:",
  "refund.section.contact.phone": "+91 7816068717",
  // Privacy Policy Page
  "privacy.hero.title": "గోప్యతా విధానం",
  "privacy.hero.breadcrumb": "గోప్యతా విధానం",
  "privacy.content.effectiveDate": "అమలు తేదీ: మార్చి 23, 2025",
  "privacy.content.intro":
    'జీవన్ సురక్ష సోషల్ సెక్యూరిటీ కలెక్టివ్, హెల్త్ గార్డ్ ఫౌండేషన్ యొక్క ఒక భాగం, ("మేము," "మా," "మాకు") మా వినియోగదారుల సమాచారం యొక్క గోప్యత మరియు భద్రతను రక్షించడానికి కట్టుబడి ఉంది. మీరు మా సేవలతో సంభాషించినప్పుడు మేము మీ సమాచారాన్ని ఎలా సేకరిస్తాము, ఉపయోగిస్తాము, వెల్లడిస్తాము మరియు రక్షిస్తామో ఈ గోప్యతా విధానం వివరిస్తుంది.',
  "privacy.section.collect.title": "1. మేము సేకరించే సమాచారం",
  "privacy.section.collect.personal":
    "<strong>వ్యక్తిగత సమాచారం:</strong> పేరు, సంప్రదింపు వివరాలు, పుట్టిన తేదీ, ప్రభుత్వం జారీ చేసిన గుర్తింపు, ఆర్థిక వివరాలు మరియు ఇతర సంబంధిత సమాచారం.",
  "privacy.section.collect.nonPersonal":
    "<strong>వ్యక్తిగత-కాని సమాచారం:</strong> బ్రౌజర్ రకం, IP చిరునామా, మరియు కుక్కీలు మరియు విశ్లేషణ సాధనాల ద్వారా సేకరించిన వినియోగ డేటా.",
  "privacy.section.use.title": "2. మేము మీ సమాచారాన్ని ఎలా ఉపయోగిస్తాము",
  "privacy.section.use.l1":
    "మా సేవలను అందించడానికి, నిర్వహించడానికి మరియు మెరుగుపరచడానికి.",
  "privacy.section.use.l2":
    "దరఖాస్తులు, చెల్లింపులు మరియు క్లెయిమ్‌లను ప్రాసెస్ చేయడానికి.",
  "privacy.section.use.l3":
    "నవీకరణలు, నోటిఫికేషన్‌లు మరియు మార్కెటింగ్ మెటీరియల్‌లను కమ్యూనికేట్ చేయడానికి.",
  "privacy.section.use.l4": "చట్టపరమైన బాధ్యతలకు అనుగుణంగా ఉండటానికి.",
  "privacy.section.sharing.title": "3. సమాచారాన్ని పంచుకోవడం",
  "privacy.section.sharing.p1":
    "మేము వ్యక్తిగత సమాచారాన్ని మూడవ పక్షాలకు అమ్మము లేదా అద్దెకు ఇవ్వము.",
  "privacy.section.sharing.p2":
    "చట్టం ద్వారా అవసరమైనప్పుడు ప్రభుత్వ ఏజెన్సీలు, న్యాయ అధికారులు లేదా సేవా ప్రదాతలతో సమాచారం పంచుకోవచ్చు.",
  "privacy.section.security.title": "4. భద్రతా చర్యలు",
  "privacy.section.security.p1":
    "మీ సమాచారాన్ని రక్షించడానికి మేము పరిశ్రమ-ప్రామాణిక భద్రతా చర్యలను అమలు చేస్తాము.",
  "privacy.section.security.p2":
    "అయితే, ఏ ఆన్‌లైన్ సేవ 100% సురక్షితం కాదు; వినియోగదారులు వ్యక్తిగత భద్రతా జాగ్రత్తలు తీసుకోవాలని సూచించబడింది.",
  "privacy.section.rights.title": "5. మీ హక్కులు",
  "privacy.section.rights.p1":
    "మీరు మీ వ్యక్తిగత డేటా యొక్క యాక్సెస్, సవరణ లేదా తొలగింపును అభ్యర్థించవచ్చు.",
  "privacy.section.rights.p2":
    "మీరు ప్రచార కమ్యూనికేషన్‌లను స్వీకరించకుండా వైదొలగవచ్చు.",
  // Homepage Contact Form
  "contactForm.title": "ప్రశ్న ఉందా? మమ్మల్ని సంప్రదించండి!",
  "contactForm.subtitle":
    "మేము సహాయం చేయడానికి మరియు మీకు ఉన్న ఏవైనా ప్రశ్నలకు సమాధానం ఇవ్వడానికి ఇక్కడ ఉన్నాము. మీ నుండి వినడానికి మేము ఎదురుచూస్తున్నాము.",
  "contactForm.label.name": "పూర్తి పేరు *",
  "contactForm.label.email": "ఇమెయిల్ చిరునామా *",
  "contactForm.label.phone": "ఫోన్ నంబర్ *",
  "contactForm.label.message": "సందేశం *",
  "contactForm.error.nameRequired": "పేరు అవసరం.",
  "contactForm.error.emailRequired": "చెల్లుబాటు అయ్యే ఇమెయిల్ అవసరం.",
  "contactForm.error.phoneRequired": "ఫోన్ నంబర్ అవసరం.",
  "contactForm.error.messageRequired": "సందేశం ఖాళీగా ఉండకూడదు.",
  "contactForm.button.submitting": "సమర్పిస్తోంది...",
  "contactForm.button.send": "సందేశం పంపండి",
  "contactForm.status.success":
    "మీ సందేశానికి ధన్యవాదాలు! మేము త్వరలో మిమ్మల్ని సంప్రదిస్తాము.",
  "contactForm.status.errorPrefix": "లోపం:",
  "contactForm.status.networkError":
    "ఒక లోపం సంభవించింది. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.",
};

// Language Provider Component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as LanguageCode;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "te")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const t = (
    key: string,
    replacements?: { [key: string]: string | number }
  ): string => {
    const translations = {
      en: enTranslations,
      te: teTranslations,
    };

    let translation = translations[language]?.[key] || key;

    if (replacements) {
      Object.keys(replacements).forEach((placeholder) => {
        translation = translation.replace(
          `{${placeholder}}`,
          String(replacements[placeholder])
        );
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom Hook 'useLanguage'
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
