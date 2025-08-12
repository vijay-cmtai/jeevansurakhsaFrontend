"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchMemberById } from "@/lib/redux/features/members/membersSlice";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { Member } from "@/lib/redux/features/members/membersSlice";

const IDCardFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[320px] h-[512px] bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
    {children}
  </div>
);

const IDCardFront = ({ member }: { member: Member }) => {
  const details = [
    { label: "ID No", value: member.registrationNo || "N/A" },
    { label: "Mob No", value: member.phone },
    { label: "Email", value: member.email },
    { label: "City", value: member.address?.cityVillage },
  ];

  return (
    <IDCardFrame>
      <div className="flex-grow p-4 bg-white relative">
        <div className="absolute inset-0 overflow-hidden rounded-b-2xl">
          <div className="absolute w-[500px] h-[500px] bg-gray-50 rounded-full -top-40 -left-40"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="text-center">
            <div className="inline-block p-1 border-2 border-gray-300 rounded-full">
              <Image
                src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
                alt="Logo"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mt-1">
              Jeevan Suraksha
            </h2>
            <p className="text-[10px] font-semibold text-gray-600 leading-tight">
              A Social Security Collective, An Initiative of Health Guard
              Foundation.
            </p>
            <p className="text-xs font-semibold mt-1 text-blue-600">
              www.jeevansuraksha.org
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 my-3">
            <div className="w-[88px] h-[88px] p-0.5 border-2 border-gray-400">
              {member.profileImageUrl ? (
                <Image
                  src={member.profileImageUrl}
                  alt="Profile"
                  width={88}
                  height={88}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Photo
                </div>
              )}
            </div>
            <div className="w-[88px] h-[88px] flex items-center justify-center">
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=88x88&data=${member._id}`}
                alt="QR Code"
                width={88}
                height={88}
              />
            </div>
          </div>

          <div className="bg-red-600 text-white text-center py-1 rounded">
            <p className="font-bold text-base uppercase">{member.fullName}</p>
            <p className="text-[10px]">
              {member.employment?.contributionPlan || "Default Plan"} - Jeevan
              Suraksha Collective
            </p>
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs mt-2 flex-grow">
            {details.map((item, index) => (
              <>
                <strong key={`${index}-label`} className="text-left">
                  {item.label}
                </strong>
                <span key={`${index}-value`}>: {item.value}</span>
              </>
            ))}
          </div>

          <div className="text-right">
            <p className="text-xs font-bold">Krishnaiah Panuganti</p>
            <p className="text-[10px] text-gray-600">
              (Chief Relations Officer)
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#37475a] text-white p-2 text-[10px]">
        <p className="text-center font-semibold mb-1">Contact Us</p>
        <div className="flex items-center gap-1">
          <Phone size={10} /> +91 78160 58717
        </div>
        <div className="flex items-center gap-1">
          <Mail size={10} /> info@jeevansuraksha.org
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={10} /> 1-63, Amadabakula, Kothakota, Wanaparty,
          Telangana - 509381
        </div>
      </div>
    </IDCardFrame>
  );
};

const IDCardBack = ({ member }: { member: Member }) => (
  <IDCardFrame>
    <div className="flex-grow p-4 bg-white relative">
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute w-[500px] h-[500px] bg-gray-50 rounded-full -top-40 -left-40"></div>
      </div>
      <div className="relative z-10 flex flex-col h-full text-center">
        <div className="inline-block p-1 border-2 border-gray-300 rounded-full mx-auto">
          <Image
            src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
            alt="Logo"
            width={64}
            height={64}
            className="rounded-full"
          />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mt-1">
          Jeevan Suraksha
        </h2>
        <p className="text-[10px] font-semibold text-gray-600 leading-tight">
          A Social Security Collective, An Initiative of Health Guard
          Foundation.
        </p>
        <p className="text-xs font-semibold mt-1 text-blue-600">
          www.jeevansuraksha.org
        </p>

        <div className="flex-grow flex flex-col justify-center items-center mt-4">
          <h3 className="font-bold text-lg text-gray-800">
            TERMS & CONDITIONS
          </h3>
          <div className="text-xs mt-3 text-gray-700 text-left space-y-3">
            <p>
              <strong>Identification:</strong> Carry the ID card at all times
              during working hours for identification purposes.
            </p>
            <p>
              <strong>Authorized Use:</strong> The ID card is strictly for
              official use and should not be shared or used for unauthorized
              purposes.
            </p>
          </div>
        </div>

        <div className="font-semibold text-xs text-gray-800">
          <p>
            Joining Date: {format(new Date(member.createdAt), "dd-MM-yyyy")}
          </p>
          <p>
            Validity:{" "}
            {format(
              new Date(
                new Date(member.createdAt).setFullYear(
                  new Date(member.createdAt).getFullYear() + 1
                )
              ),
              "dd-MM-yyyy"
            )}
          </p>
        </div>
      </div>
    </div>
    <div className="bg-[#37475a] text-white p-2 text-[10px]">
      <p className="text-center font-semibold mb-1">Contact Us</p>
      <div className="flex items-center gap-1">
        <Phone size={10} /> +91 78160 58717
      </div>
      <div className="flex items-center gap-1">
        <Mail size={10} /> info@jeevansuraksha.org
      </div>
      <div className="flex items-center gap-1">
        <MapPin size={10} /> 1-63, Amadabakula, Kothakota, Wanaparty, Telangana
        - 509381
      </div>
    </div>
  </IDCardFrame>
);

export default function IDCardPage() {
  const params = useParams();
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
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8 flex flex-col items-center gap-6">
      <div className="bg-green-500 text-white font-bold py-2 px-6 rounded-full shadow-md">
        This ID Card Is Verified
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <IDCardFront member={member} />
        <IDCardBack member={member} />
      </div>
      <Button
        onClick={() => window.print()}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full shadow-lg"
      >
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </Button>
    </div>
  );
}
