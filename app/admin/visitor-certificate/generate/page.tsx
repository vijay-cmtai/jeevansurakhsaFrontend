"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { generateVisitorCertificate } from "@/lib/redux/features/certificates/visitorCertificatesSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";

type FormInputs = {
  name: string;
  fatherName: string;
  mobile: string;
  email: string;
  programName: string;
};

// Dummy template data - make sure these images exist in your /public folder
const templates = [
  {
    id: "TPL_PURPLE",
    src: "https://jeevansuraksha.org/software/websiteCertificate1Images/certificate_1.png",
  },
  {
    id: "TPL_BLUE",
    src: "https://jeevansuraksha.org/software/websiteCertificate1Images/certificate_2.png",
  },
  {
    id: "TPL_GREEN",
    src: "https://jeevansuraksha.org/software/websiteCertificate1Images/certificate_3.png",
  },
];

export default function GenerateVisitorCertificatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { actionStatus } = useSelector(
    (state: RootState) => state.visitorCertificates
  );
  const { register, handleSubmit, reset } = useForm<FormInputs>();
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    templates[0].id
  );

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    if (!selectedTemplate) {
      alert("Please select a certificate template.");
      return;
    }

    dispatch(
      generateVisitorCertificate({ ...data, templateId: selectedTemplate })
    ).then((result) => {
      if (generateVisitorCertificate.fulfilled.match(result)) {
        alert("Certificate generated successfully!");
        reset();
        router.push("/admin/visitor-certificate/all");
      } else {
        alert(`Error: ${result.payload || "An unknown error occurred."}`);
      }
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="bg-green-500 text-white text-center font-bold py-3 mb-8 rounded-md">
          Visitor Certificate Generation Form
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter Name"
                {...register("name", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="fatherName">Father Name</Label>
              <Input
                id="fatherName"
                placeholder="Enter Father Name"
                {...register("fatherName", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="mobile">Enter Mobile No.</Label>
              <Input
                id="mobile"
                placeholder="Enter Mobile No."
                type="tel"
                {...register("mobile", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="email">Enter Email Id.</Label>
              <Input
                id="email"
                placeholder="Enter Email Id"
                type="email"
                {...register("email")}
              />
            </div>
            <div>
              <Label htmlFor="programName">Enter Program</Label>
              <Input
                id="programName"
                placeholder="Enter Program"
                {...register("programName", { required: true })}
              />
            </div>
          </div>

          <div className="text-center pt-6 mt-6 border-t">
            <h3 className="text-xl font-bold mb-4">Select Template</h3>
            <div className="flex justify-center gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`cursor-pointer border-4 rounded-lg transition-all ${selectedTemplate === template.id ? "border-green-500 scale-105" : "border-transparent"}`}
                >
                  <Image
                    src={template.src}
                    alt={`Template ${template.id}`}
                    width={200}
                    height={140}
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              className="w-1/2 bg-green-600 hover:bg-green-700 text-lg py-6"
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
