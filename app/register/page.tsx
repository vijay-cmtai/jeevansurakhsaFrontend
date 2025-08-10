"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

// ShadCN UI Components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Icons
import { CalendarIcon, Edit, UserPlus, Trash2 } from "lucide-react";

//================================================================
// Reusable Helper Components
//================================================================
const FormWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-lg">
    <div className="text-center mb-6">
      <div className="inline-block p-2 bg-white rounded-full shadow-md -mb-12 relative z-10">
        <Image
          src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
          alt="Jeevan Suraksha Logo"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>
    </div>
    <div className="bg-gray-50 rounded-2xl shadow-xl p-8 pt-16">{children}</div>
  </div>
);

const StepNavigation = ({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev?: () => void;
}) => (
  <div
    className={`flex gap-4 mt-8 ${onPrev ? "justify-between" : "justify-end"}`}
  >
    {onPrev && (
      <Button variant="outline" onClick={onPrev} className="h-11 px-6 bg-white">
        Previous
      </Button>
    )}
    <Button
      onClick={onNext}
      className="bg-green-500 hover:bg-green-600 h-11 px-8"
    >
      Next
    </Button>
  </div>
);

const StepSectionHeader = ({ title }: { title: string }) => (
  <div className="bg-[#2d3748] text-white text-center py-2.5 rounded-md mb-6">
    <h3 className="font-semibold text-lg">{title}</h3>
  </div>
);

//================================================================
// Form Steps Components
//================================================================

const Step1_StateSelection = ({ nextStep }: { nextStep: () => void }) => (
  <FormWrapper>
    <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">
      State Selection
    </h2>
    <div className="space-y-4">
      <Select>
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Select State" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="telangana">Telangana</SelectItem>
          <SelectItem value="andhra_pradesh">Andhra Pradesh</SelectItem>
          <SelectItem value="karnataka">Karnataka</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Select District" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mahabubabad">Mahabubabad</SelectItem>
          <SelectItem value="hyderabad">Hyderabad</SelectItem>
          <SelectItem value="warangal">Warangal</SelectItem>
        </SelectContent>
      </Select>
      <div>
        <Label className="text-sm font-medium text-gray-600">
          Volunteer Code
        </Label>
        <Input
          placeholder="Enter Volunteer Code (Optional)"
          className="h-12 mt-1"
        />
      </div>
    </div>
    <StepNavigation onNext={nextStep} />
  </FormWrapper>
);

const Step2_DOB = ({
  prevStep,
  nextStep,
}: {
  prevStep: () => void;
  nextStep: () => void;
}) => {
  const [date, setDate] = useState<Date>();
  return (
    <FormWrapper>
      <h2 className="text-xl font-semibold text-center text-gray-700 mb-2">
        Date of Birth
      </h2>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="w-full h-12 justify-start text-left font-normal bg-white"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>dd-mm-yyyy</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <StepNavigation onPrev={prevStep} onNext={nextStep} />
    </FormWrapper>
  );
};

const Step3_PersonalDetails = ({
  prevStep,
  nextStep,
}: {
  prevStep: () => void;
  nextStep: () => void;
}) => (
  <FormWrapper>
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <StepSectionHeader title="Personal Details" />
      <Input placeholder="Full Name" />
      <Input placeholder="Phone Number" type="tel" />
      <Input placeholder="Email ID" type="email" />
      <Input placeholder="Create A Password" type="password" />
      <Input placeholder="PAN Number" />
      <div>
        <Label className="text-sm text-gray-600">
          Upload PAN Card Photo (Optional):
        </Label>
        <Input
          type="file"
          className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />
      </div>
      <div>
        <Label className="text-sm text-gray-600">Upload Profile Photo:</Label>
        <Input
          type="file"
          className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />
      </div>

      <StepSectionHeader title="Address Details" />
      <Input placeholder="House Number" />
      <Input placeholder="Street" />
      <Input placeholder="City/Village (Mandatory)" />
      <Input placeholder="Pincode (Mandatory)" />
    </div>
    <StepNavigation onPrev={prevStep} onNext={nextStep} />
  </FormWrapper>
);

const Step4_EmploymentDetails = ({
  prevStep,
  nextStep,
}: {
  prevStep: () => void;
  nextStep: () => void;
}) => (
  <FormWrapper>
    <StepSectionHeader title="Employment Details" />
    <div className="space-y-4">
      <Select>
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Select Employment Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="homemaker">Home Maker</SelectItem>
          <SelectItem value="farmer">Farmer</SelectItem>
          <SelectItem value="business">Business Owner</SelectItem>
          <SelectItem value="private">Private Employee</SelectItem>
          <SelectItem value="govt">Government Employee</SelectItem>
          <SelectItem value="it">IT Employee</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Select Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hr">Human Resources</SelectItem>
          <SelectItem value="it_dept">IT Department</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Select Company Name" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="company_a">Company A</SelectItem>
          <SelectItem value="company_b">Company B</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Select Contribution Plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="plan_a">Plan A - 1 Crore</SelectItem>
          <SelectItem value="plan_b">Plan B - 50 Lakhs</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <StepNavigation onPrev={prevStep} onNext={nextStep} />
  </FormWrapper>
);

const Step5_NomineeDetails = ({
  prevStep,
  nextStep,
}: {
  prevStep: () => void;
  nextStep: () => void;
}) => {
  const [nominees, setNominees] = useState<any[]>([{}]);
  const addNominee = () => setNominees([...nominees, {}]);
  const removeNominee = (index: number) =>
    setNominees(nominees.filter((_, i) => i !== index));

  return (
    <FormWrapper>
      <StepSectionHeader title="Nominee Details" />
      <div className="max-h-[55vh] overflow-y-auto pr-2">
        {nominees.map((_, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg mb-4 space-y-3 relative bg-white"
          >
            <Input placeholder="Nominee Name" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Relation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="son">Son</SelectItem>
                <SelectItem value="daughter">Daughter</SelectItem>
                <SelectItem value="father">Father</SelectItem>
                <SelectItem value="mother">Mother</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Age" type="number" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Percentage (%)" type="number" />
            {nominees.length > 1 && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeNominee(index)}
                className="absolute top-2 right-2 h-7 w-7"
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end mb-4">
        <Button onClick={addNominee} size="sm">
          <UserPlus size={16} className="mr-2" />
          Add Another Nominee
        </Button>
      </div>
      <div className="flex items-center space-x-2 mt-6">
        <Checkbox id="terms" />
        <Label htmlFor="terms" className="text-sm font-medium">
          I accept Terms & Conditions
        </Label>
        <Link href="/terms" className="text-sm text-blue-600 hover:underline">
          See Terms
        </Link>
      </div>
      <StepNavigation onPrev={prevStep} onNext={nextStep} />
    </FormWrapper>
  );
};

const Step6_ConfirmDetails = ({
  prevStep,
  goToStep,
}: {
  prevStep: () => void;
  goToStep: (step: number) => void;
}) => {
  const DetailCard = ({
    title,
    children,
    step,
  }: {
    title: string;
    children: React.ReactNode;
    step: number;
  }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-green-600 hover:bg-green-50"
          onClick={() => goToStep(step)}
        >
          <Edit size={16} />
        </Button>
      </div>
      <div className="text-sm text-gray-600 space-y-1">{children}</div>
    </div>
  );
  return (
    <FormWrapper>
      <StepSectionHeader title="Confirm Your Details" />
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        <DetailCard title="State Information" step={1}>
          <p>
            <strong>State:</strong> Telangana
          </p>
          <p>
            <strong>District:</strong> Mahabubabad
          </p>
        </DetailCard>
        <DetailCard title="Date of Birth" step={2}>
          <p>
            <strong>DOB:</strong> 23-12-2000
          </p>
        </DetailCard>
        <DetailCard title="Personal Details" step={3}>
          <p>
            <strong>Full Name:</strong> Vijay Maurya
          </p>
          <p>
            <strong>Phone:</strong> 9589337844
          </p>
        </DetailCard>
        <DetailCard title="Address Details" step={3}>
          <p>Address..., 201301</p>
        </DetailCard>
        <DetailCard title="Employment Details" step={4}>
          <p>
            <strong>Type:</strong> Farmer
          </p>
        </DetailCard>
        <DetailCard title="Nominee Details" step={5}>
          <p>jhs (Spouse, 23 yrs, Female, 100%)</p>
        </DetailCard>
      </div>
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          className="h-11 px-6 bg-white"
        >
          Previous
        </Button>
        <Button className="bg-green-500 hover:bg-green-600 h-11 px-8">
          Confirm & Submit
        </Button>
      </div>
    </FormWrapper>
  );
};

//================================================================
// Main Page Component
//================================================================
export default function RegisterMultiStepPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const goToStep = (stepNumber: number) => setStep(stepNumber);

  const steps = [
    <Step1_StateSelection nextStep={nextStep} />,
    <Step2_DOB prevStep={prevStep} nextStep={nextStep} />,
    <Step3_PersonalDetails prevStep={prevStep} nextStep={nextStep} />,
    <Step4_EmploymentDetails prevStep={prevStep} nextStep={nextStep} />,
    <Step5_NomineeDetails prevStep={prevStep} nextStep={nextStep} />,
    <Step6_ConfirmDetails prevStep={prevStep} goToStep={goToStep} />,
  ];

  return (
    <div className="min-h-screen w-full bg-[#2d3748] flex flex-col items-center justify-center p-4 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full flex justify-center"
        >
          {steps[step - 1]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
