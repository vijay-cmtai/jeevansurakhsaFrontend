"use client";

import { useEffect, useState, useMemo, FC, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

// Redux Imports
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  setStep,
  updateField,
  updateNestedField,
  updateNominee,
  addNominee,
  removeNominee,
  submitRegistration,
  fetchRegistrationConfig,
  fetchContributionGroupsForRegistration,
  setEmploymentType,
  resetForm,
} from "@/lib/redux/features/registration/registrationSlice";

// UI & Icon Imports
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { CalendarIcon, Edit, UserPlus, Trash2, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Declare Cashfree type
declare global {
  interface Window {
    Cashfree: any;
  }
}

// ================================================================
// Constants and Helper Components
// ================================================================
const relations = [
  "Spouse",
  "Son",
  "Daughter",
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Other",
];
const genders = ["Male", "Female", "Other"];

const FormWrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="w-full max-w-lg">
    <div className="text-center mb-6">
      <div className="inline-block p-2 bg-white rounded-full shadow-md -mb-12 relative z-10">
        <Image
          src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
          alt="Logo"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>
    </div>
    <div className="bg-gray-50 rounded-2xl shadow-xl p-8 pt-16">{children}</div>
  </div>
);

const StepSectionHeader: FC<{ title: string }> = ({ title }) => (
  <div className="bg-[#2d3748] text-white text-center py-2.5 rounded-md mb-6">
    <h3 className="font-semibold text-lg">{title}</h3>
  </div>
);

// ================================================================
// Main Registration Page Component
// ================================================================
export default function RegisterMultiStepPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const {
    step,
    formData,
    status: registrationStatus,
    error: registrationError,
    states,
    volunteers,
    contributionGroups,
    configStatus,
  } = useSelector((state: RootState) => state.registration);

  const [localFiles, setLocalFiles] = useState<{
    profileImage?: File | null;
    panImage?: File | null;
  }>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [submissionType, setSubmissionType] = useState<
    "payNow" | "payLater" | null
  >(null);

  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (!formData.nominees || formData.nominees.length === 0) {
      dispatch(addNominee());
    }
  }, [formData.nominees, dispatch]);

  useEffect(() => {
    const scriptId = "cashfree-sdk";
    if (document.getElementById(scriptId)) {
      if (window.Cashfree) setIsSDKLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => {
      console.log("Cashfree SDK loaded.");
      if (window.Cashfree) setIsSDKLoaded(true);
    };
    script.onerror = () => console.error("Failed to load Cashfree SDK.");
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    dispatch(fetchRegistrationConfig());
    dispatch(fetchContributionGroupsForRegistration());
    return () => {
      dispatch(resetForm());
    };
  }, [dispatch]);

  const launchCheckout = async (paymentSessionId: string, orderId: string) => {
    if (!isSDKLoaded || typeof window.Cashfree !== "function") {
      alert("Payment gateway is not ready. Please wait a moment.");
      setSubmissionType(null);
      return;
    }
    try {
      const cashfree = window.Cashfree({ mode: "sandbox" }); // Use "production" for live
      const result = await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_modal",
      });
      if (result.error) {
        alert(`Payment Error: ${result.error.message}`);
      } else {
        window.location.href = `/registration-success?order_id=${orderId}`;
      }
    } catch (error: any) {
      alert(`Payment Gateway Error: ${error.message}`);
    } finally {
      setSubmissionType(null);
    }
  };

  const handleSubmit = async (isPayingNow: boolean) => {
    if (!validateStep(step)) return;

    setSubmissionType(isPayingNow ? "payNow" : "payLater");

    try {
      const resultAction = await dispatch(
        submitRegistration({ formData, files: localFiles, isPayingNow })
      );
      if (submitRegistration.fulfilled.match(resultAction)) {
        const response = resultAction.payload;
        if (isPayingNow && response.paymentDetails) {
          await launchCheckout(
            response.paymentDetails.payment_session_id,
            response.paymentDetails.order_id
          );
        } else {
          alert("Registration successful! Please login to complete payment.");
          router.push("/login");
          setSubmissionType(null);
        }
      } else {
        throw new Error(
          (resultAction.payload as string) || "Registration failed."
        );
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
      setSubmissionType(null);
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.state) newErrors.state = "State is required.";
      if (!formData.district) newErrors.district = "District is required.";
      // --- VOLUNTEER VALIDATION ADDED HERE ---
      if (!formData.volunteerCode)
        newErrors.volunteerCode = "Volunteer is required.";
    } else if (currentStep === 2) {
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of Birth is required.";
      } else {
        const today = new Date();
        const dob = new Date(formData.dateOfBirth);
        let calculatedAge = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < dob.getDate())
        ) {
          calculatedAge--;
        }

        if (calculatedAge < 18 || calculatedAge > 60) {
          newErrors.dateOfBirth = "Age must be between 18 and 60 years.";
        }
      }
    } else if (currentStep === 3) {
      if (!formData.fullName) newErrors.fullName = "Full name is required.";
      if (!/^\d{10}$/.test(formData.phone))
        newErrors.phone = "Valid 10-digit phone number is required.";
      if (!/^\S+@\S+$/i.test(formData.email))
        newErrors.email = "A valid email is required.";
      if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters.";
      if (
        formData.panNumber &&
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)
      )
        newErrors.panNumber = "Invalid PAN format.";
      if (!localFiles.profileImage)
        newErrors.profileImage = "Profile photo is required.";
      if (!formData.address.houseNumber)
        newErrors.houseNumber = "House number is required.";
      if (!formData.address.street)
        newErrors.street = "Street/Area is required.";
      if (!formData.address.cityVillage)
        newErrors.cityVillage = "City/Village is required.";
      if (!/^\d{6}$/.test(formData.address.pincode))
        newErrors.pincode = "Valid 6-digit pincode is required.";
    } else if (currentStep === 4) {
      if (!formData.employment.type)
        newErrors.employmentType = "Employment type is required.";
    } else if (
      currentStep === 4.5 &&
      formData.employment.type !== "Farmer" &&
      formData.employment.type !== "Home Maker"
    ) {
      if (!formData.employment.companyName)
        newErrors.companyName = "Company name is required.";
      if (!formData.employment.department)
        newErrors.department = "Department is required.";
      if (!formData.employment.contributionPlan)
        newErrors.contributionPlan = "Contribution plan is required.";
    } else if (currentStep === 5) {
      if (!formData.nominees || formData.nominees.length === 0)
        newErrors.nominee_main = "At least one nominee is required.";
      let totalPercentage = formData.nominees.reduce(
        (acc, nom) => acc + (Number(nom.percentage) || 0),
        0
      );
      if (totalPercentage !== 100)
        newErrors.nominee_total = "Total percentage must be exactly 100%.";
      formData.nominees.forEach((nom, index) => {
        if (!nom.name) newErrors[`nominee_name_${index}`] = "Name is required.";
        if (!nom.relation)
          newErrors[`nominee_relation_${index}`] = "Relation is required.";
        if (!nom.age || Number(nom.age) <= 0)
          newErrors[`nominee_age_${index}`] = "Valid age is required.";
        if (!nom.gender)
          newErrors[`nominee_gender_${index}`] = "Gender is required.";
      });
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step === 4) {
        const empType = formData.employment.type;
        dispatch(
          setStep(empType === "Farmer" || empType === "Home Maker" ? 5 : 4.5)
        );
      } else if (step === 4.5) {
        dispatch(setStep(5));
      } else {
        dispatch(setStep(step + 1));
      }
    }
  };

  const handlePrev = () => {
    setFormErrors({});
    if (step === 5) {
      const empType = formData.employment.type;
      dispatch(
        setStep(empType === "Farmer" || empType === "Home Maker" ? 4 : 4.5)
      );
    } else if (step === 4.5) {
      dispatch(setStep(4));
    } else {
      dispatch(setStep(step - 1));
    }
  };

  const handleFilesChange = (newFiles: { [key: string]: File | null }) => {
    setLocalFiles((prev) => ({ ...prev, ...newFiles }));
  };

  const selectedEmpType = formData.employment.type;
  const availableCompanies = useMemo(
    () =>
      contributionGroups.find((g) => g.employmentType === selectedEmpType)
        ?.companies || [],
    [selectedEmpType, contributionGroups]
  );
  const selectedCompany = formData.employment.companyName;
  const availableDepartments = useMemo(
    () =>
      availableCompanies.find((c) => c.companyName === selectedCompany)
        ?.departments || [],
    [selectedCompany, availableCompanies]
  );
  const selectedDepartment = formData.employment.department;
  const availablePlans = useMemo(
    () =>
      availableDepartments.find((d) => d.departmentName === selectedDepartment)
        ?.plans || [],
    [selectedDepartment, availableDepartments]
  );

  const today = new Date();
  const maxDate = new Date(new Date().setFullYear(today.getFullYear() - 18));
  const minDate = new Date(new Date().setFullYear(today.getFullYear() - 60));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <FormWrapper>
            <StepSectionHeader title="State Selection" />
            <div className="space-y-4">
              <Select
                value={formData.state}
                onValueChange={(v) => {
                  dispatch(updateField({ field: "state", value: v }));
                  dispatch(updateField({ field: "district", value: "" }));
                }}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((s) => (
                    <SelectItem key={s._id} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.state && (
                <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
              )}
              <Select
                value={formData.district}
                onValueChange={(v) =>
                  dispatch(updateField({ field: "district", value: v }))
                }
                disabled={!formData.state}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {states
                    .find((s) => s.name === formData.state)
                    ?.districts.map((d) => (
                      <SelectItem key={d._id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {formErrors.district && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.district}
                </p>
              )}
              <Select
                value={formData.volunteerCode}
                onValueChange={(v) =>
                  dispatch(updateField({ field: "volunteerCode", value: v }))
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select Volunteer" />
                </SelectTrigger>
                <SelectContent>
                  {volunteers.map((v) => (
                    <SelectItem key={v._id} value={v.code}>
                      {v.name} - {v.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* --- ERROR MESSAGE FOR VOLUNTEER ADDED HERE --- */}
              {formErrors.volunteerCode && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.volunteerCode}
                </p>
              )}
            </div>
            <div className="flex justify-end mt-8">
              <Button
                onClick={handleNext}
                className="bg-green-500 hover:bg-green-600 h-11 px-8"
              >
                Next
              </Button>
            </div>
          </FormWrapper>
        );

      case 2:
        return (
          <FormWrapper>
            <StepSectionHeader title="Date of Birth" />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full h-12 justify-start text-left font-normal bg-white"
                >
                  <span className="flex items-center w-full">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOfBirth ? (
                      format(new Date(formData.dateOfBirth), "PPP")
                    ) : (
                      <span>dd-mm-yyyy</span>
                    )}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    formData.dateOfBirth
                      ? new Date(formData.dateOfBirth)
                      : undefined
                  }
                  onSelect={(v) =>
                    dispatch(
                      updateField({
                        field: "dateOfBirth",
                        value: v?.toISOString(),
                      })
                    )
                  }
                  fromDate={minDate}
                  toDate={maxDate}
                  defaultMonth={maxDate}
                  captionLayout="dropdown-buttons"
                />
              </PopoverContent>
            </Popover>
            {formErrors.dateOfBirth && (
              <p className="text-red-500 text-sm mt-2">
                {formErrors.dateOfBirth}
              </p>
            )}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                className="h-11 px-6 bg-white"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="bg-green-500 hover:bg-green-600 h-11 px-8"
              >
                Next
              </Button>
            </div>
          </FormWrapper>
        );

      case 3:
        return (
          <FormWrapper>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <StepSectionHeader title="Personal Details" />
              <div>
                <Input
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    dispatch(
                      updateField({ field: "fullName", value: e.target.value })
                    )
                  }
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.fullName}
                  </p>
                )}
              </div>
              <div>
                <Input
                  placeholder="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    dispatch(
                      updateField({ field: "phone", value: e.target.value })
                    )
                  }
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>
              <div>
                <Input
                  placeholder="Email ID"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    dispatch(
                      updateField({ field: "email", value: e.target.value })
                    )
                  }
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
              <div>
                <Input
                  placeholder="Create A Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    dispatch(
                      updateField({ field: "password", value: e.target.value })
                    )
                  }
                />
                {formErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>
              <div>
                <Input
                  placeholder="PAN Number (Optional)"
                  value={formData.panNumber}
                  onChange={(e) =>
                    dispatch(
                      updateField({
                        field: "panNumber",
                        value: e.target.value.toUpperCase(),
                      })
                    )
                  }
                />
                {formErrors.panNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.panNumber}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="panImage">
                  Upload PAN Card Photo (Optional)
                </Label>
                <Input
                  id="panImage"
                  name="panImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFilesChange({ panImage: e.target.files?.[0] })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profileImage">
                  Upload Profile Photo (Required)
                </Label>
                <Input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFilesChange({ profileImage: e.target.files?.[0] })
                  }
                />
                {formErrors.profileImage && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.profileImage}
                  </p>
                )}
              </div>
              <StepSectionHeader title="Address Details" />
              <div>
                <Input
                  placeholder="House Number / Building Name"
                  value={formData.address.houseNumber}
                  onChange={(e) =>
                    dispatch(
                      updateNestedField({
                        parent: "address",
                        field: "houseNumber",
                        value: e.target.value,
                      })
                    )
                  }
                />
                {formErrors.houseNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.houseNumber}
                  </p>
                )}
              </div>
              <div>
                <Input
                  placeholder="Street / Area"
                  value={formData.address.street}
                  onChange={(e) =>
                    dispatch(
                      updateNestedField({
                        parent: "address",
                        field: "street",
                        value: e.target.value,
                      })
                    )
                  }
                />
                {formErrors.street && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.street}
                  </p>
                )}
              </div>
              <div>
                <Input
                  placeholder="City / Village"
                  value={formData.address.cityVillage}
                  onChange={(e) =>
                    dispatch(
                      updateNestedField({
                        parent: "address",
                        field: "cityVillage",
                        value: e.target.value,
                      })
                    )
                  }
                />
                {formErrors.cityVillage && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.cityVillage}
                  </p>
                )}
              </div>
              <div>
                <Input
                  placeholder="Pincode"
                  value={formData.address.pincode}
                  onChange={(e) =>
                    dispatch(
                      updateNestedField({
                        parent: "address",
                        field: "pincode",
                        value: e.target.value,
                      })
                    )
                  }
                />
                {formErrors.pincode && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.pincode}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                className="h-11 px-6 bg-white"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="bg-green-500 hover:bg-green-600 h-11 px-8"
              >
                Next
              </Button>
            </div>
          </FormWrapper>
        );

      case 4:
        return (
          <FormWrapper>
            <StepSectionHeader title="Employment Type" />
            <div className="space-y-4">
              <Label>Select Employment Type</Label>
              <Select
                value={formData.employment.type}
                onValueChange={(v) => dispatch(setEmploymentType(v))}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  {contributionGroups.map((group) => (
                    <SelectItem key={group._id} value={group.employmentType}>
                      {group.employmentType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.employmentType && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.employmentType}
                </p>
              )}
            </div>
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                className="h-11 px-6 bg-white"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="bg-green-500 hover:bg-green-600 h-11 px-8"
              >
                Next
              </Button>
            </div>
          </FormWrapper>
        );

      case 4.5:
        return (
          <FormWrapper>
            <StepSectionHeader title="Employment Details" />
            <div className="space-y-4">
              <div>
                <Label>Company Name</Label>
                <Select
                  value={formData.employment.companyName}
                  onValueChange={(v) => {
                    dispatch(
                      updateNestedField({
                        parent: "employment",
                        field: "companyName",
                        value: v,
                      })
                    );
                    dispatch(
                      updateNestedField({
                        parent: "employment",
                        field: "department",
                        value: "",
                      })
                    );
                    dispatch(
                      updateNestedField({
                        parent: "employment",
                        field: "contributionPlan",
                        value: "",
                      })
                    );
                  }}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCompanies.map((c) => (
                      <SelectItem key={c._id} value={c.companyName}>
                        {c.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.companyName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.companyName}
                  </p>
                )}
              </div>
              <div>
                <Label>Department</Label>
                <Select
                  value={formData.employment.department}
                  onValueChange={(v) => {
                    dispatch(
                      updateNestedField({
                        parent: "employment",
                        field: "department",
                        value: v,
                      })
                    );
                    dispatch(
                      updateNestedField({
                        parent: "employment",
                        field: "contributionPlan",
                        value: "",
                      })
                    );
                  }}
                  disabled={!selectedCompany}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDepartments.map((d) => (
                      <SelectItem key={d._id} value={d.departmentName}>
                        {d.departmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.department && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.department}
                  </p>
                )}
              </div>
              <div>
                <Label>Contribution Plan</Label>
                <Select
                  value={formData.employment.contributionPlan}
                  onValueChange={(v) =>
                    dispatch(
                      updateNestedField({
                        parent: "employment",
                        field: "contributionPlan",
                        value: v,
                      })
                    )
                  }
                  disabled={!selectedDepartment}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select Contribution Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlans.map((p) => (
                      <SelectItem key={p._id} value={p.planDetails}>
                        {p.planDetails}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.contributionPlan && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.contributionPlan}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                className="h-11 px-6 bg-white"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="bg-green-500 hover:bg-green-600 h-11 px-8"
              >
                Next
              </Button>
            </div>
          </FormWrapper>
        );
      case 5:
        return (
          <FormWrapper>
            <StepSectionHeader title="Nominee Details" />
            <div className="max-h-[50vh] overflow-y-auto pr-2">
              {formData.nominees.map((nominee, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg mb-4 space-y-3 relative bg-white"
                >
                  <Input
                    placeholder="Nominee Name"
                    value={nominee.name}
                    onChange={(e) =>
                      dispatch(
                        updateNominee({
                          index,
                          field: "name",
                          value: e.target.value,
                        })
                      )
                    }
                  />
                  {formErrors[`nominee_name_${index}`] && (
                    <p className="text-red-500 text-sm">
                      {formErrors[`nominee_name_${index}`]}
                    </p>
                  )}
                  <Select
                    value={nominee.relation}
                    onValueChange={(v) =>
                      dispatch(
                        updateNominee({ index, field: "relation", value: v })
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Relation" />
                    </SelectTrigger>
                    <SelectContent>
                      {relations.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors[`nominee_relation_${index}`] && (
                    <p className="text-red-500 text-sm">
                      {formErrors[`nominee_relation_${index}`]}
                    </p>
                  )}
                  <Input
                    placeholder="Age"
                    type="number"
                    value={nominee.age}
                    onChange={(e) =>
                      dispatch(
                        updateNominee({
                          index,
                          field: "age",
                          value: e.target.value,
                        })
                      )
                    }
                  />
                  {formErrors[`nominee_age_${index}`] && (
                    <p className="text-red-500 text-sm">
                      {formErrors[`nominee_age_${index}`]}
                    </p>
                  )}
                  <Select
                    value={nominee.gender}
                    onValueChange={(v) =>
                      dispatch(
                        updateNominee({ index, field: "gender", value: v })
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors[`nominee_gender_${index}`] && (
                    <p className="text-red-500 text-sm">
                      {formErrors[`nominee_gender_${index}`]}
                    </p>
                  )}
                  <Input
                    placeholder="Percentage (%)"
                    type="number"
                    value={nominee.percentage}
                    onChange={(e) =>
                      dispatch(
                        updateNominee({
                          index,
                          field: "percentage",
                          value: e.target.value,
                        })
                      )
                    }
                  />
                  {formData.nominees.length > 1 && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => dispatch(removeNominee(index))}
                      className="absolute top-2 right-2 h-7 w-7"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end mb-4">
              <Button onClick={() => dispatch(addNominee())} size="sm">
                <UserPlus size={16} className="mr-2" />
                Add Another Nominee
              </Button>
            </div>
            {formErrors.nominee_total && (
              <p className="text-red-500 text-sm text-center">
                {formErrors.nominee_total}
              </p>
            )}

            <div className="mt-6 flex items-center space-x-3">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) =>
                  setTermsAccepted(checked as boolean)
                }
              />
              <div className="flex items-baseline gap-2">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept Terms & Conditions
                </label>
                <Link
                  href="/jeevanterm.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  See Terms
                </Link>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                className="h-11 px-6 bg-white"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="bg-green-500 hover:bg-green-600 h-11 px-8"
                disabled={!termsAccepted}
              >
                Next
              </Button>
            </div>
          </FormWrapper>
        );
      case 6:
        return (
          <FormWrapper>
            <StepSectionHeader title="Confirm Your Details" />
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800">
                    Location & Volunteer
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:bg-green-50"
                    onClick={() => dispatch(setStep(1))}
                  >
                    <Edit size={16} />
                  </Button>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>State:</strong>{" "}
                    <span className="text-gray-800">{formData.state}</span>
                  </p>
                  <p>
                    <strong>District:</strong>{" "}
                    <span className="text-gray-800">{formData.district}</span>
                  </p>
                  <p>
                    <strong>Volunteer:</strong>{" "}
                    <span className="text-gray-800">
                      {formData.volunteerCode || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800">
                    Personal & Address
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:bg-green-50"
                    onClick={() => dispatch(setStep(3))}
                  >
                    <Edit size={16} />
                  </Button>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Name:</strong>{" "}
                    <span className="text-gray-800">{formData.fullName}</span>
                  </p>
                  <p>
                    <strong>DOB:</strong>{" "}
                    <span className="text-gray-800">
                      {formData.dateOfBirth
                        ? format(new Date(formData.dateOfBirth), "PPP")
                        : ""}
                    </span>
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    <span className="text-gray-800">{formData.email}</span>
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    <span className="text-gray-800">{formData.phone}</span>
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    <span className="text-gray-800">{`${formData.address.houseNumber}, ${formData.address.street}, ${formData.address.cityVillage} - ${formData.address.pincode}`}</span>
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800">Employment</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:bg-green-50"
                    onClick={() => dispatch(setStep(4))}
                  >
                    <Edit size={16} />
                  </Button>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Type:</strong>{" "}
                    <span className="text-gray-800">
                      {formData.employment.type}
                    </span>
                  </p>
                  <p>
                    <strong>Company:</strong>{" "}
                    <span className="text-gray-800">
                      {formData.employment.companyName || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>Department:</strong>{" "}
                    <span className="text-gray-800">
                      {formData.employment.department || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>Plan:</strong>{" "}
                    <span className="text-gray-800">
                      {formData.employment.contributionPlan || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800">Nominees</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:bg-green-50"
                    onClick={() => dispatch(setStep(5))}
                  >
                    <Edit size={16} />
                  </Button>
                </div>
                <div className="text-sm space-y-1">
                  {formData.nominees.map((n, i) => (
                    <p key={i}>
                      <strong>Nominee #{i + 1}:</strong> {n.name} ({n.relation},{" "}
                      {n.age} years, {n.percentage}%)
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {registrationError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                {registrationError}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={submissionType !== null}
                className="h-11 px-6 bg-white"
              >
                Previous
              </Button>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={() => handleSubmit(false)}
                  disabled={submissionType !== null}
                  className="h-11 px-8"
                >
                  {submissionType === "payLater" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Pay Later"
                  )}
                </Button>
                <Button
                  onClick={() => handleSubmit(true)}
                  disabled={submissionType !== null || !isSDKLoaded}
                  className="bg-green-500 hover:bg-green-600 h-11 px-8"
                >
                  {submissionType === "payNow" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Proceed to Pay"
                  )}
                </Button>
              </div>
            </div>
          </FormWrapper>
        );

      default:
        return <div className="text-white">Unknown Step. Please refresh.</div>;
    }
  };

  if (configStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2d3748]">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          Loading Form...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#2d3748] flex flex-col items-center justify-center p-4 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full flex justify-center"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
