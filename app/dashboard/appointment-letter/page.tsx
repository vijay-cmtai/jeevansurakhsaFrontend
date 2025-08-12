"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getMemberProfile } from "@/lib/redux/features/auth/authSlice";
import { motion } from "framer-motion";
import Image from "next/image";
import { format } from "date-fns";
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppointmentLetterPage() {
  const dispatch = useDispatch<AppDispatch>();
  // Data ab 'auth' slice se aayega
  const { userInfo, status, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    // Agar page refresh hua hai ya user details poore nahi hain, to profile fetch karo
    if (!userInfo?.address) {
      // Check for a field that only exists in the full profile
      dispatch(getMemberProfile());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    // QR code ke liye current page ka URL use karein
    if (typeof window !== "undefined") {
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
        window.location.href
      )}`;
      setQrCodeUrl(url);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // Loading State
  if (status === "loading" || status === "idle") {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-600">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <p className="text-lg font-semibold">Loading Your Letter...</p>
      </div>
    );
  }

  // Error State
  if (status === "failed" || !userInfo) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600 bg-red-50 p-4 text-center">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <p className="text-lg font-semibold">Could not load your details.</p>
        <p className="text-sm">{error || "Please try logging in again."}</p>
      </div>
    );
  }

  // Check if member is active
  if (userInfo.membershipStatus !== "Active") {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-orange-600 bg-orange-50 p-4 text-center">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <p className="text-lg font-semibold">Account Not Active</p>
        <p className="text-sm">
          Your appointment letter is available only after your membership is
          active.
        </p>
      </div>
    );
  }

  // Success State - Render the letter
  return (
    <div className="bg-gray-100 py-10 px-4 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto text-center mb-6 print:hidden">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 font-bold py-2 px-4 rounded-full border border-green-300">
          <ShieldCheck className="h-5 w-5" />
          This Appointment Letter Is Verified
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-2xl rounded-lg border print:shadow-none print:border-none"
      >
        <header className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <Image
              src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
              alt="Logo"
              width={150}
              height={49}
            />
            <p className="text-sm text-blue-600 mt-1">www.jeevansuraksha.org</p>
          </div>
          {qrCodeUrl && (
            <Image src={qrCodeUrl} alt="QR Code" width={100} height={100} />
          )}
        </header>

        <div className="bg-[#2d3748] text-white text-center py-2.5 my-6">
          <h2 className="font-semibold text-lg uppercase tracking-wider">
            Appointment Letter
          </h2>
        </div>

        <div className="text-sm text-gray-800 space-y-4 leading-relaxed">
          <div className="flex justify-between">
            <p>
              <strong>To,</strong>
              <br />
              {userInfo.fullName}
              <br />
              {`${userInfo.address?.cityVillage}, ${userInfo.address?.pincode}`}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {format(new Date(userInfo.createdAt), "dd MMMM, yyyy")}
            </p>
          </div>
          <p className="pt-4">
            <strong>Subject:</strong> Letter Of Appointment.
          </p>
          <p>
            <strong>Dear {userInfo.fullName},</strong>
          </p>
          <p>
            We are thrilled to extend an invitation to you to become a member of
            our organization. On behalf of our entire team, we warmly welcome
            you to our organization.
          </p>
          <p>
            Your commitment to our cause and your passion for making a
            difference in the community have not gone unnoticed. We believe that
            your involvement will greatly contribute to our efforts in our
            mission.
          </p>
          <p>
            As a member, you will have the opportunity to participate in our
            various initiatives, events, and projects aimed at our organization.
            Your input and contributions will be invaluable in advancing our
            mission and creating positive change.
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Access to members-only events and workshops.</li>
            <li>
              Networking opportunities with like-minded individuals and
              organizations.
            </li>
            <li>
              Regular updates and newsletters on our projects and initiatives.
            </li>
            <li>
              Opportunities for professional development and growth within the
              organization.
            </li>
          </ul>
          <p>
            Once again, welcome to our organization. Together, we can make a
            meaningful impact and create positive change in our community.
          </p>
          <div className="pt-8">
            <p>Yours sincerely,</p>
            <p className="mt-4 font-semibold">Krishnaiah Panuganti</p>
            <p>(Chief Relations Officer)</p>
            <p>Jeevan Suraksha</p>
          </div>
        </div>

        <footer className="mt-12 pt-6 border-t text-center text-xs text-slate-500">
          <p className="font-semibold">Jeevan Suraksha</p>
          <p>
            1-63, Amadabakula, Kothakota, Wanaparty, Telangana, India - 509381
          </p>
          <p>+91 78160 58717 | info@jeevansuraksha.org</p>
        </footer>
      </motion.div>
      <div className="text-center mt-8 print:hidden">
        <Button onClick={handlePrint}>Download as PDF / Print</Button>
      </div>

      {/* Terms & Conditions Section */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-xl rounded-lg border mt-10 print:shadow-none print:border-none print:mt-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Terms & Conditions
        </h2>
        <p className="mb-6 text-sm text-gray-600 text-center">
          By accepting this certificate, the Member agrees to adhere to the
          Terms & Conditions of the Jeevan Suraksha Social Security Collective,
          effective March 23, 2025:
        </p>

        <div className="space-y-6 text-gray-700 text-sm">
          <ol className="space-y-4 list-decimal list-outside ml-5">
            <li>
              <strong className="font-semibold text-gray-800">
                Eligibility
              </strong>
              <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
                <li>
                  Open to Indian citizens residing in Telangana, Andhra Pradesh
                  & Karnataka or permanent residents of Telangana, Andhra
                  Pradesh & Karnataka working anywhere in the world.
                </li>
                <li>
                  Applicants must be 18 to 60 years old and not terminally ill
                  at the time of enrolment.
                </li>
                <li>
                  Membership is subject to verification. If ineligible, the
                  application will be rejected and the amount refunded.
                </li>
                <li>Verification process: up to 7 days.</li>
                <li>Refund timeline: within 21 days of rejection.</li>
              </ul>
            </li>
            <li>
              <strong className="font-semibold text-gray-800">
                Non-Transferable Membership
              </strong>
              <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
                <li>
                  Switching membership categories requires prior written
                  notification.
                </li>
                <li>Only one active membership per person is allowed.</li>
                <li>
                  Duplicate applications will be rejected during verification.
                </li>
                <li>
                  Applicants must submit valid: Identity proof, Age proof,
                  Nominee details. Additional documents may be requested.
                </li>
              </ul>
            </li>
            <li>
              <strong className="font-semibold text-gray-800">
                Contribution Responsibility
              </strong>
              <p className="mt-1">
                Members must make timely contributions to remain eligible for
                benefits.
              </p>
            </li>
            <li>
              <strong className="font-semibold text-gray-800">
                Membership Review & Rejection
              </strong>
              <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
                <li>Applications are reviewed post-registration.</li>
                <li>
                  Applications may be rejected in cases of foul play, e.g.,
                  enrolling terminally ill individuals.
                </li>
                <li>Rejected applicants will receive a refund.</li>
              </ul>
            </li>
            <li>
              <strong className="font-semibold text-gray-800">
                Fund Utilization
              </strong>
              <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
                <li>
                  Contributions are used solely for pay-outs to nominees of
                  deceased members.
                </li>
                <li>
                  Payouts depend on the total contributions from active members
                  at the time of the claim.
                </li>
                <li>
                  No guaranteed amount (e.g., ₹25 lakhs to ₹1 crore). Nominees
                  receive the actual collected amount.
                </li>
              </ul>
            </li>
            <li>
              <strong className="font-semibold text-gray-800">
                Exclusions for Payouts
              </strong>
              <p className="mt-1">
                Suicide, Nominee involvement in the member's death, or
                Fraudulent circumstances.
              </p>
            </li>
            <li>
              <strong className="font-semibold text-gray-800">
                Failure to Contribute
              </strong>
              <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
                <li>
                  Missed contributions may lead to suspension or termination of
                  membership.
                </li>
                <li>Repeated non-payment results in termination.</li>
                <li>To re-join, all dues must be cleared.</li>
              </ul>
            </li>
            <li>
              <strong className="font-semibold text-gray-800">
                Voluntary Withdrawal
              </strong>
              <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
                <li>Members may withdraw at any time.</li>
                <li>No refunds for contributions already paid.</li>
                <li>Re-joining requires clearing all arrears.</li>
              </ul>
            </li>
            <li>
              <strong className="font-semibold text-gray-800">
                Membership Cap
              </strong>
              <p className="mt-1">
                Once the group reaches 25,000 members, new groups may be formed.
              </p>
            </li>
            <li>
              <strong className="font-semibold text-gray-800">
                Claim Process
              </strong>
              <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
                <li>
                  In case of death, the nominee must report via the website or
                  helpline.
                </li>
                <li>
                  If the cause of death is under legal investigation, payouts
                  will be withheld until clearance.
                </li>
              </ul>
            </li>
            <li>
              <strong className="font-semibold text-gray-800">
                How is the payout amount determined if contributors are from
                different states?
              </strong>
              <p className="mt-1">
                Payouts are calculated separately for each state and depend only
                on the number of active contributing members from the nominee's
                state at the time of the claim. Contributions from members of
                other states are not included in the payout.
              </p>
            </li>
            <li>
              <strong className="font-semibold text-gray-800">
                Dispute Resolution
              </strong>
              <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
                <li>
                  Disputes will be reviewed by the governing committee. The
                  committee’s decision is final.
                </li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
            Member Pledge
          </h3>
          <p className="mb-4 text-gray-600">
            As a member of the Jeevan Suraksha Social Security Collective, I
            solemnly pledge to uphold the principles of mutual aid and
            solidarity within our community. I commit to:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold w-48 shrink-0">
                Support Fellow Members:
              </span>
              <span>
                Contributing promptly and consistently to the collective fund to
                ensure timely assistance to the nominees of deceased fellow
                members.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold w-48 shrink-0">
                Maintain Integrity:
              </span>
              <span>
                Providing accurate personal information, adhering to the
                collective's guidelines, and refraining from any actions that
                may compromise the trust and welfare of the community.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold w-48 shrink-0">
                Promote Transparency:
              </span>
              <span>
                Engaging in open communication, participating in decision-making
                processes when possible, and supporting the collective's efforts
                to maintain clear and accessible records.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold w-48 shrink-0">
                Foster Community Growth:
              </span>
              <span>
                Encouraging others to join and strengthen our collective,
                thereby enhancing our capacity to support one another in times
                of need.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold w-48 shrink-0">
                Respect Confidentiality:
              </span>
              <span>
                Honouring the privacy of fellow members and handling all
                personal information with the utmost care and discretion.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold w-48 shrink-0">
                Embrace Solidarity:
              </span>
              <span>
                Recognizing that our strength lies in unity, I will stand with
                my fellow members, offering support and compassion beyond
                financial contributions.
              </span>
            </li>
          </ul>
          <p className="mt-4 text-gray-600">
            By making this pledge, I affirm my dedication to the values and
            mission of the Jeevan Suraksha Social Security Collective,
            understanding that our shared commitment ensures the well-being and
            security of all members.
          </p>
        </div>

        <div className="mt-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-800">
          <h3 className="font-bold text-lg">Important Disclaimer</h3>
          <p className="mt-2 font-semibold">Important Note:</p>
          <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
            <li>
              The total payout per claim depends on the number of active
              contributors at the time of the request. The trust does not
              guarantee the ₹1 crore, ₹50 lakhs, or ₹25 lakhs amounts.
            </li>
            <li>
              If the required amount is not collected, the nominee will receive
              only the total contributions made by active members.
            </li>
            <li>
              Payouts are state-specific, based on the number of contributing
              members belonging to the nominee's state at the time of the claim.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
