"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image"; // For the Pledge section image

//================================================================
// 1. HEADER BANNER COMPONENT
//================================================================
function CollectiveHeader() {
  const backgroundImageUrl =
    "https://jeevan.atlix.in/wp-content/uploads/2025/03/10.jpg";

  return (
    <section className="relative w-full h-80 bg-gray-900">
      <img
        src={backgroundImageUrl}
        alt="Private Employees and Business Owners"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
      <div className="relative h-full flex flex-col items-center justify-center text-white z-20 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold drop-shadow-lg"
        >
          Private Employees & Business Owners
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 flex items-center space-x-2 text-sm tracking-widest uppercase"
        >
          <Link
            href="/"
            className="font-semibold text-amber-400 hover:text-amber-300"
          >
            HOME
          </Link>
          <span className="text-gray-400"></span>
          <span className="text-gray-200 font-semibold">
            PRIVATE EMPLOYEES & BUSINESS OWNERS
          </span>
        </motion.div>
      </div>
    </section>
  );
}

//================================================================
// 2. REUSABLE COMPONENTS
//================================================================
const SectionTitle = ({ title }: { title: string }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
  </div>
);

const HowItWorksCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow h-full">
    <h3 className="font-bold text-lg text-blue-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const BenefitItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-x-3">
    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
    <span className="text-gray-700">{children}</span>
  </li>
);

const ContributionTable = ({ data, title }: { data: any[]; title: string }) => (
  <div>
    <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
      {title}
    </h3>
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full text-center">
        <thead className="bg-[#4a5568] text-white">
          <tr>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
              Number of Members
            </th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
              Contribution Per Member (₹)
            </th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
              Total Corpus Raised (₹)
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className="even:bg-gray-50 hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                {row.members}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                ₹{row.contribution}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">
                ₹{row.corpus}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

//================================================================
// 3. MAIN PAGE COMPONENT
//================================================================
export default function PrivateBusinessCollectivePage() {
  const tableData1Cr = [
    { members: "2,000", contribution: "500", corpus: "10 Lakhs" },
    { members: "5,000", contribution: "400", corpus: "20 Lakhs" },
    { members: "10,000", contribution: "400", corpus: "40 Lakhs" },
    { members: "25,000", contribution: "400", corpus: "1 Crore" },
  ];

  const tableData50L = [
    { members: "1,000", contribution: "300", corpus: "3 Lakhs" },
    { members: "2,000", contribution: "300", corpus: "6 Lakhs" },
    { members: "5,000", contribution: "300", corpus: "15 Lakhs" },
  ];

  const tableData25L = [
    { members: "1,000", contribution: "150", corpus: "1.5 Lakhs" },
    { members: "2,000", contribution: "150", corpus: "3 Lakhs" },
    { members: "5,000", contribution: "100", corpus: "5 Lakhs" },
    { members: "10,000", contribution: "100", corpus: "10 Lakhs" },
    { members: "25,000", contribution: "100", corpus: "25 Lakhs" },
  ];

  return (
    <div>
      <CollectiveHeader />
      <main>
        {/* Intro Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              ₹1 Crore, ₹50 Lakhs & ₹25 Lakhs Collectives – Private Employees &
              Business Owners
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
              The ₹1 Crore, ₹50 Lakhs, & ₹25 Lakhs Collectives are a support
              initiative exclusively for all private employees and business
              owners. The goal is to create a financial safety net for the
              families of members in case of an unfortunate demise. Each member
              pledges to contribute a small amount when a fellow member passes
              away, ensuring their family receives support immediately.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <SectionTitle title="How It Works" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <HowItWorksCard
                title="Membership Enrollment"
                description="General Public & Business owners can join this collective by paying a nominal registration and an annual renewal fee of ₹100/-. Need to upload their Aadhaar/VoterId/License/Passport, etc., and nominee details."
              />
              <HowItWorksCard
                title="Pledge to Support"
                description="Each member pledges to contribute a specific amount upon the unfortunate demise of a fellow member."
              />
              <HowItWorksCard
                title="Fund Transfer"
                description="Once a member's demise is verified, all other members contribute their pledged amount, and the total fund is transferred directly to the nominee of the deceased member."
              />
              <HowItWorksCard
                title="Threshold for Launch"
                description="The collective will officially launch once a minimum of 1,000 members have enrolled."
              />
              <HowItWorksCard
                title="Decreasing Contribution Over Time"
                description="As the number of members grows, the individual contribution per demise will reduce while ensuring the total collected fund reaches the goal."
              />
            </div>
          </div>
        </section>

        {/* Contribution Tables */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 space-y-16">
            <ContributionTable
              data={tableData1Cr}
              title="Contribution Table – Illustration Purpose – ₹1 Crore Collective"
            />
            <ContributionTable
              data={tableData50L}
              title="Contribution Table – Illustration Purpose – ₹50 Lakhs Collective"
            />
            <ContributionTable
              data={tableData25L}
              title="Contribution Table – Illustration Purpose – ₹25 Lakhs Collective"
            />
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <SectionTitle title="Key Benefits" />
            <ul className="space-y-4">
              <BenefitItem>
                <strong>Affordable Contribution:</strong> The larger the
                collective, the lower the per-person contribution.
              </BenefitItem>
              <BenefitItem>
                <strong>Direct & Transparent:</strong> Funds go directly to the
                deceased member's nominee without intermediaries.
              </BenefitItem>
              <BenefitItem>
                <strong>Strong Community Support:</strong> A collective effort
                ensuring financial security for all community members.
              </BenefitItem>
            </ul>
          </div>
        </section>

        {/* Join the Movement Section */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <SectionTitle title="Join the Movement" />
            <p className="text-gray-600 leading-relaxed">
              To become a member of the ₹1 Crore Collective and safeguard your
              family's financial future, sign up today and take the pledge!
            </p>
          </div>
        </section>

        {/* Pledge Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 lg:h-full rounded-lg overflow-hidden order-last">
              <Image
                src="https://static.vecteezy.com/system/resources/previews/009/884/901/original/man-character-thinking-free-vector.jpg"
                alt="A person thinking"
                width={600}
                height={800}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-white/60"></div>
            </div>
            <div className="order-first">
              <SectionTitle title="Pledge" />
              <ul className="space-y-3 text-gray-600 text-sm">
                <BenefitItem>
                  <strong>Support Fellow Members:</strong> Contributing promptly
                  and consistently to this collective's fund to ensure timely
                  assistance to the nominees of deceased fellow members.
                </BenefitItem>
                <BenefitItem>
                  <strong>Maintain Integrity:</strong> Providing accurate
                  personal information, adhering to the collective's guidelines,
                  and refraining from any actions that may compromise the trust
                  and welfare of the community.
                </BenefitItem>
                <BenefitItem>
                  <strong>Promote Transparency:</strong> Engaging in open
                  communication, participating in decision-making processes when
                  possible, and supporting the collective's efforts to maintain
                  clear and accessible records.
                </BenefitItem>
                <BenefitItem>
                  <strong>Foster Community Growth:</strong> Encouraging others
                  to join and strengthen our collective, thereby enhancing our
                  capacity to support one another in times of need.
                </BenefitItem>
                <BenefitItem>
                  <strong>Respect Confidentiality:</strong> Honouring the
                  privacy of fellow members and handling all personal
                  information with the utmost care and discretion.
                </BenefitItem>
                <BenefitItem>
                  <strong>Demonstrate Solidarity:</strong> Recognizing that our
                  strength lies in unity, I will stand with my fellow members,
                  offering support and compassion beyond financial
                  contributions.
                </BenefitItem>
                <p className="mt-4 text-sm text-gray-800">
                  By taking this pledge, I affirm my dedication to the values
                  and mission of the Jeevan Suraksha Social Security Collective,
                  understanding that our shared commitment ensures the
                  well-being and security of all members.
                </p>
              </ul>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4">
            <SectionTitle title="Important Disclaimer" />
            <ul className="space-y-3 text-gray-600 text-sm list-disc list-inside">
              <li>
                The total contribution per claim depends on the number of active
                contributors at the time of the request.
              </li>
              <li>
                The full claim value is not guaranteed; the actual amount
                depends on contributions received.
              </li>
              <li>
                If the required amount is not collected, the nominee will
                receive only the total contributed by the active members.
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
