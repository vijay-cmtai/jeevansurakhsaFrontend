"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchMemberById } from "@/lib/redux/features/members/membersSlice";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Member } from "@/lib/redux/features/members/membersSlice"; // Import Member type

// --- ID CARD FRONT COMPONENT ---
const IDCardFront = ({ member }: { member: Member }) => (
  <div className="w-[380px] h-[240px] bg-white rounded-lg shadow-xl border border-gray-200 p-4 flex flex-col">
    {/* Header Section */}
    <div className="text-center border-b pb-2">
      {/* Replace with your actual logo path */}
      <img src="/logo.webp" alt="Logo" className="h-8 w-8 mx-auto mb-1" />
      <p className="text-sm font-bold text-gray-800">Jeevan Suraksha</p>
      <p className="text-xs text-gray-600 leading-tight">
        A Social Security Collective, An Initiative of Health Guard Foundation.
      </p>
      <p className="text-xs text-blue-600">www.jeevansuraksha.org</p>
    </div>

    {/* Body Section */}
    <div className="flex-grow flex items-center pt-3 gap-4">
      {/* Profile Picture */}
      <div className="w-1/3 flex justify-center items-center">
        <div className="w-[80px] h-[100px] border-2 border-gray-300 rounded-md flex items-center justify-center">
          {member.profileImageUrl ? (
            <Image
              src={member.profileImageUrl}
              alt="Profile"
              width={80}
              height={100}
              className="object-cover w-full h-full rounded-md"
            />
          ) : (
            <span className="text-xs text-gray-400">Profile</span>
          )}
        </div>
      </div>

      {/* Member Details */}
      <div className="w-2/3 text-sm space-y-1 text-gray-800 font-medium">
        <p className="text-red-600 font-bold text-xl">{member.fullName}</p>
        <p>
          <strong>ID No:</strong> {member.registrationNo}
        </p>
        <p>
          <strong>Mob No:</strong> {member.phone}
        </p>
        <p>
          <strong>Email:</strong> {member.email}
        </p>
        <p>
          <strong>City:</strong> {member.address?.cityVillage}
        </p>
      </div>
    </div>
  </div>
);

// --- ID CARD BACK COMPONENT ---
const IDCardBack = ({ member }: { member: Member }) => (
  <div className="w-[380px] h-[240px] bg-white rounded-lg shadow-xl border border-gray-200 p-4 flex flex-col justify-between">
    {/* Header Section */}
    <div className="text-center border-b pb-2">
      <img src="/logo.webp" alt="Logo" className="h-8 w-8 mx-auto mb-1" />
      <p className="text-sm font-bold text-gray-800">Jeevan Suraksha</p>
      <p className="text-xs text-gray-600 leading-tight">
        A Social Security Collective, An Initiative of Health Guard Foundation.
      </p>
      <p className="text-xs text-blue-600">www.jeevansuraksha.org</p>
    </div>

    {/* Terms & Conditions */}
    <div className="flex-grow flex flex-col justify-center items-center text-center px-2">
      <h3 className="font-bold text-lg text-gray-800">TERMS & CONDITIONS</h3>
      <p className="text-xs mt-2 text-gray-600">
        <strong>Identification:</strong> Carry the ID card at all times during
        working hours for identification purposes.
      </p>
      <p className="text-xs mt-2 text-gray-600">
        <strong>Authorized Use:</strong> The ID card is strictly for official
        use and should not be shared or used for unauthorized purposes.
      </p>
    </div>

    {/* Joining and Validity Dates */}
    <div className="text-center font-semibold text-xs text-gray-700">
      <p>Joining Date: {format(new Date(member.createdAt), "dd-MM-yyyy")}</p>
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
);

// --- MAIN PAGE COMPONENT ---
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
      <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full shadow-lg">
        Download PDF
      </Button>
    </div>
  );
}
