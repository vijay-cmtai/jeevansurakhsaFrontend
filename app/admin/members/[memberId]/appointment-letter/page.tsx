"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchMemberById } from "@/lib/redux/features/members/membersSlice";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function AppointmentLetterPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const memberId = params.memberId as string;

  const { selectedMember: member, listStatus } = useSelector(
    (state: RootState) => state.members
  );

  useEffect(() => {
    if (memberId) {
      dispatch(fetchMemberById(memberId));
    }
  }, [dispatch, memberId]);

  if (listStatus === "loading" || !member) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen p-8 flex flex-col items-center">
      <div className="bg-green-600 text-white font-bold py-2 px-4 rounded-md mb-4">
        This Appointment Letter Is Verified
      </div>
      <div className="bg-white p-8 shadow-lg max-w-4xl w-full">
        <header className="text-center mb-6">
          <Image
            src="/logo.webp"
            alt="Jeevan Suraksha Logo"
            width={80}
            height={80}
            className="mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold">JEEVAN SURAKSHA</h1>
          <p className="text-sm text-gray-600">www.jeevansuraksha.org</p>
        </header>

        <div className="bg-gray-800 text-white text-center py-2 mb-6">
          <h2 className="text-lg font-semibold">Appointment Letter</h2>
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <p>
              <strong>To,</strong>
            </p>
            <p>{member.fullName}</p>
            <p>Address: {member.address?.cityVillage}</p>
            <p>Date: {format(new Date(), "dd-MM-yyyy")}</p>
            <p className="mt-4">
              <strong>Subject:</strong> Letter Of Appointment.
            </p>
            <p>
              <strong>Dear Mr./Ms. {member.fullName},</strong>
            </p>
          </div>
          <Image
            src="/qr-code-placeholder.png"
            alt="QR Code"
            width={120}
            height={120}
          />
        </div>

        <div className="text-gray-700 space-y-4 text-justify">
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
          <p>
            In addition to actively participating in our programs, as a member,
            you will also enjoy exclusive benefits, including:
          </p>
          <ol className="list-decimal list-inside pl-4 space-y-1">
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
          </ol>
          <p>
            We are excited to have you on board and look forward to your active
            participation and collaboration. Should you have any questions or
            require further information, please do not hesitate to contact our
            membership coordinator.
          </p>
          <p>
            Once again, welcome to our organization. Together, we can make a
            meaningful impact and create positive change in our community.
          </p>
        </div>

        <div className="mt-12 text-left">
          <Image
            src="/signature-placeholder.png"
            alt="Signature"
            width={150}
            height={60}
          />
          <p className="font-bold mt-2">Krishnaiah Panuganti</p>
          <p>(Chief Relations Officer)</p>
          <p>Jeevan Suraksha</p>
        </div>
      </div>
      <Button className="mt-8 bg-blue-600 hover:bg-blue-700">
        Download PDF
      </Button>
    </div>
  );
}
