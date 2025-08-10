"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { generateCertificate } from "@/lib/redux/features/memberCertificates/memberCertificatesSlice";
import { fetchMemberById } from "@/lib/redux/features/members/membersSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Image from "next/image";

// --- Form Data Type ---
type CertificateFormData = {
  fatherName: string;
  programName: string;
  templateId: string;
};

// --- Template Data ---
const templates = [
  {
    id: "TPL01",
    src: "https://jeevansuraksha.org/software/websiteCertificate1Images/certificate_1.png",
    alt: "Purple Template",
  },
  {
    id: "TPL02",
    src: "https://jeevansuraksha.org/software/websiteCertificate1Images/certificate_2.png",
    alt: "Blue and Gold Template",
  },
  {
    id: "TPL03",
    src: "https://jeevansuraksha.org/software/websiteCertificate1Images/certificate_3.png",
    alt: "Green Template",
  },
];

export default function GenerateCertificateFormPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const memberId = params.memberId as string;

  // Get member data from membersSlice and action status from memberCertificatesSlice
  const { selectedMember: member, listStatus } = useSelector(
    (state: RootState) => state.members
  );
  const { actionStatus, actionError } = useSelector(
    (state: RootState) => state.memberCertificates
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CertificateFormData>({
    defaultValues: {
      templateId: templates[0].id, // Select the first template by default
    },
  });

  // Fetch the specific member's details when the page loads
  useEffect(() => {
    if (memberId) {
      dispatch(fetchMemberById(memberId));
    }
  }, [dispatch, memberId]);

  // Handle the final submission to generate the certificate
  const onSubmit = (data: CertificateFormData) => {
    dispatch(
      generateCertificate({
        memberId,
        fatherName: data.fatherName,
        programName: data.programName,
        templateId: data.templateId,
      })
    ).then((result) => {
      if (generateCertificate.fulfilled.match(result)) {
        alert("Certificate generated successfully!");
        // Redirect to the list of active/generated certificates
        router.push("/admin/active-certificate");
      } else {
        alert(`Error: ${result.payload || "Failed to generate certificate"}`);
      }
    });
  };

  if (listStatus === "loading" || !member) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border">
        <div className="bg-green-600 text-white text-center font-bold py-3 mb-6 rounded-md">
          <h2>Generate Certificate Form</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="registrationNo">Registration No</Label>
            <Input
              id="registrationNo"
              value={member.registrationNo || "N/A"}
              readOnly
              disabled
              className="bg-gray-100"
            />
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={member.fullName}
              readOnly
              disabled
              className="bg-gray-100"
            />
          </div>

          <div>
            <Label htmlFor="fatherName">Father Name</Label>
            <Input
              id="fatherName"
              placeholder="Enter father's name"
              {...register("fatherName", {
                required: "Father name is required",
              })}
            />
            {errors.fatherName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fatherName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="programName">Enter Program</Label>
            <Input
              id="programName"
              placeholder="e.g., Jeevan Suraksha Membership"
              {...register("programName", {
                required: "Program name is required",
              })}
            />
            {errors.programName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.programName.message}
              </p>
            )}
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Select Template</h3>
            <Controller
              name="templateId"
              control={control}
              render={({ field }) => (
                <div className="flex justify-center gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => field.onChange(template.id)}
                      className={`cursor-pointer border-4 rounded-lg transition-all ${field.value === template.id ? "border-green-500 scale-105" : "border-transparent"}`}
                    >
                      <Image
                        src={template.src}
                        alt={template.alt}
                        width={150}
                        height={100}
                        className="rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
              disabled={actionStatus === "loading"}
            >
              {actionStatus === "loading" ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
