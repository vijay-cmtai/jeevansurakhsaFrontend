"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getMemberProfile } from "@/lib/redux/features/auth/authSlice";
import { updateMemberProfile } from "@/lib/redux/features/members/membersSlice";
import {
  fetchRegistrationConfig,
  fetchContributionGroupsForRegistration,
} from "@/lib/redux/features/registration/registrationSlice";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, UserPlus, Loader2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

// A reusable section component
const FormSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border-t pt-6 mt-6">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

export default function UpdateProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const {
    userInfo,
    status: authStatus,
    error: authError,
  } = useSelector((state: RootState) => state.auth);

  const { actionStatus, actionError } = useSelector(
    (state: RootState) => state.members
  );

  // Registration config data for dropdowns
  const { states, contributionGroups, configStatus, contributionGroupsStatus } =
    useSelector((state: RootState) => state.registration);

  const [formData, setFormData] = useState<any>({});
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [panImageFile, setPanImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [panImagePreview, setPanImagePreview] = useState<string | null>(null);

  // Nominee validation state
  const [nomineePercentageTotal, setNomineePercentageTotal] = useState(0);
  const [nomineeError, setNomineeError] = useState<string | null>(null);

  // Load config data first
  useEffect(() => {
    dispatch(fetchRegistrationConfig());
    dispatch(fetchContributionGroupsForRegistration());
  }, [dispatch]);

  // Initialize form data after userInfo and config data are loaded
  useEffect(() => {
    if (!userInfo) {
      dispatch(getMemberProfile());
    } else if (
      !isFormInitialized &&
      states.length > 0 &&
      contributionGroups.length > 0 &&
      configStatus === "succeeded" &&
      contributionGroupsStatus === "succeeded"
    ) {
      // Initialize form with existing user data
      const initialFormData = {
        // Basic fields with fallbacks
        fullName: userInfo.fullName || "",
        phone: userInfo.phone || "",
        email: userInfo.email || "",
        dateOfBirth: userInfo.dateOfBirth || "",
        state: userInfo.state || "",
        district: userInfo.district || "",
        volunteerCode: userInfo.volunteerCode || "",
        panNumber: userInfo.panNumber || "",
        profileImageUrl: userInfo.profileImageUrl || "",
        panImageUrl: userInfo.panImageUrl || "",

        // Address with proper defaults
        address: {
          houseNumber: userInfo.address?.houseNumber || "",
          street: userInfo.address?.street || "",
          cityVillage: userInfo.address?.cityVillage || "",
          pincode: userInfo.address?.pincode || "",
        },

        // Employment with proper defaults
        employment: {
          type: userInfo.employment?.type || "",
          department: userInfo.employment?.department || "",
          companyName: userInfo.employment?.companyName || "",
          contributionPlan: userInfo.employment?.contributionPlan || "",
        },

        // Nominees with at least one default nominee
        nominees:
          userInfo.nominees && userInfo.nominees.length > 0
            ? userInfo.nominees.map((nominee: any) => ({
                name: nominee.name || "",
                relation: nominee.relation || "",
                age: nominee.age || "",
                gender: nominee.gender || "",
                percentage: nominee.percentage || 0,
              }))
            : [
                {
                  name: "",
                  relation: "",
                  age: "",
                  gender: "",
                  percentage: 100,
                },
              ],
      };

      setFormData(initialFormData);
      setIsFormInitialized(true);
    }
  }, [
    userInfo,
    dispatch,
    states,
    contributionGroups,
    configStatus,
    contributionGroupsStatus,
    isFormInitialized,
  ]);

  // Nominee percentage validation
  useEffect(() => {
    if (formData.nominees && formData.nominees.length > 0) {
      const total = formData.nominees.reduce((acc: number, nominee: any) => {
        return acc + (parseFloat(nominee.percentage) || 0);
      }, 0);

      setNomineePercentageTotal(total);

      if (total !== 100) {
        setNomineeError(
          `Total percentage must be 100%. Current total is ${total}%.`
        );
      } else {
        setNomineeError(null);
      }
    } else {
      setNomineePercentageTotal(0);
      setNomineeError("At least one nominee is required with 100% allocation.");
    }
  }, [formData.nominees]);

  // Get available companies based on employment type
  const availableCompanies = useMemo(() => {
    if (!formData.employment?.type || contributionGroups.length === 0)
      return [];
    const group = contributionGroups.find(
      (g) => g.employmentType === formData.employment?.type
    );
    return group?.companies || [];
  }, [formData.employment?.type, contributionGroups]);

  // Get available departments based on company
  const availableDepartments = useMemo(() => {
    if (!formData.employment?.companyName || availableCompanies.length === 0)
      return [];
    const company = availableCompanies.find(
      (c) => c.companyName === formData.employment?.companyName
    );
    return company?.departments || [];
  }, [formData.employment?.companyName, availableCompanies]);

  // Get available plans based on department (READ ONLY - for display only)
  const availablePlans = useMemo(() => {
    if (!formData.employment?.department || availableDepartments.length === 0)
      return [];
    const department = availableDepartments.find(
      (d) => d.departmentName === formData.employment?.department
    );
    return department?.plans || [];
  }, [formData.employment?.department, availableDepartments]);

  // Get districts for selected state
  const availableDistricts = useMemo(() => {
    if (!formData.state || states.length === 0) return [];
    const state = states.find((s) => s.name === formData.state);
    return state?.districts || [];
  }, [formData.state, states]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };

    // Reset district when state changes
    if (field === "state") {
      newFormData.district = "";
    }

    setFormData(newFormData);
  };

  const handleNestedChange = (parent: string, field: string, value: string) => {
    const newFormData = {
      ...formData,
      [parent]: { ...formData[parent], [field]: value },
    };

    // Handle cascading changes for employment
    if (parent === "employment") {
      if (field === "type") {
        // Reset company, department when type changes
        newFormData[parent] = {
          ...newFormData[parent],
          companyName: "",
          department: "",
          contributionPlan: "",
        };
      } else if (field === "companyName") {
        // Reset department when company changes
        newFormData[parent] = {
          ...newFormData[parent],
          department: "",
          contributionPlan: "",
        };
      }
    }

    setFormData(newFormData);
  };

  const handleNomineeChange = (index: number, field: string, value: string) => {
    const newNominees = [...formData.nominees];
    newNominees[index] = { ...newNominees[index], [field]: value };
    setFormData({ ...formData, nominees: newNominees });
  };

  const addNominee = () => {
    setFormData({
      ...formData,
      nominees: [
        ...formData.nominees,
        { name: "", relation: "", age: "", gender: "", percentage: "" },
      ],
    });
  };

  const removeNominee = (index: number) => {
    const newNominees = formData.nominees.filter(
      (_: any, i: number) => i !== index
    );
    setFormData({ ...formData, nominees: newNominees });
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "profile" | "pan"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (type === "profile") {
        setProfileImageFile(file);
        setProfileImagePreview(URL.createObjectURL(file));
      } else {
        setPanImageFile(file);
        setPanImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Final validation check
    if (nomineeError) {
      toast({
        title: "Invalid Nominee Details",
        description: nomineeError,
        variant: "destructive",
      });
      return;
    }

    // Create FormData for submission
    const data = new FormData();

    // Basic fields
    data.append("fullName", formData.fullName || "");
    data.append("phone", formData.phone || "");
    data.append("dateOfBirth", formData.dateOfBirth || "");
    data.append("state", formData.state || "");
    data.append("district", formData.district || "");
    data.append("volunteerCode", formData.volunteerCode || "");
    data.append("panNumber", formData.panNumber || "");

    // Nested objects as JSON
    data.append("address", JSON.stringify(formData.address));
    data.append("employment", JSON.stringify(formData.employment));
    data.append("nominees", JSON.stringify(formData.nominees));

    // Files
    if (profileImageFile) {
      data.append("profileImage", profileImageFile);
    }
    if (panImageFile) {
      data.append("panImage", panImageFile);
    }

    const resultAction = await dispatch(updateMemberProfile(data));
    if (updateMemberProfile.fulfilled.match(resultAction)) {
      toast({
        title: "Success",
        description: "Your profile has been updated successfully!",
      });
      // Refresh profile data
      dispatch(getMemberProfile());
    } else {
      toast({
        title: "Update Failed",
        description:
          (resultAction.payload as string) || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  // Show loading while data is being fetched or form is being initialized
  if (
    authStatus === "loading" ||
    configStatus === "loading" ||
    contributionGroupsStatus === "loading" ||
    !userInfo ||
    !isFormInitialized ||
    states.length === 0 ||
    contributionGroups.length === 0
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
        <span className="ml-2 text-gray-600">Loading profile data...</span>
      </div>
    );
  }

  if (authStatus === "failed") {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg">{authError}</div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Update Profile</h1>
      <p className="mt-1 text-gray-600">
        Manage your personal and professional information.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* State & Location Details */}
          <FormSection title="Location Details">
            <div>
              <Label>State</Label>
              <Select
                value={formData.state || ""}
                onValueChange={(value) => handleSelectChange("state", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select State">
                    {formData.state || "Select State"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state._id} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>District</Label>
              <Select
                value={formData.district || ""}
                onValueChange={(value) => handleSelectChange("district", value)}
                disabled={!formData.state}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select District">
                    {formData.district || "Select District"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district._id} value={district.name}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Volunteer/Referral Code</Label>
              <Input
                name="volunteerCode"
                value={formData.volunteerCode || ""}
                onChange={handleChange}
                placeholder="Volunteer Code (Optional)"
              />
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Input
                name="dateOfBirth"
                type="date"
                value={
                  formData.dateOfBirth ? formData.dateOfBirth.split("T")[0] : ""
                }
                onChange={handleChange}
              />
            </div>
          </FormSection>

          {/* Personal Details */}
          <FormSection title="Personal Details">
            <div>
              <Label>Full Name</Label>
              <Input
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="Phone Number"
                type="tel"
                required
              />
            </div>

            <div>
              <Label>Email (Read Only)</Label>
              <Input
                name="email"
                value={formData.email || ""}
                readOnly
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <Label>PAN Number</Label>
              <Input
                name="panNumber"
                value={formData.panNumber || ""}
                onChange={handleChange}
                placeholder="PAN Number (Optional)"
              />
            </div>
          </FormSection>

          {/* Profile & PAN Images */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Document Images
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Image */}
              <div>
                <Label>Profile Picture</Label>
                <div className="flex flex-col gap-3">
                  <Image
                    src={
                      profileImagePreview ||
                      formData.profileImageUrl ||
                      "https://placehold.co/120x120/EFEFEF/AAAAAA&text=Photo"
                    }
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-md object-cover border"
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "profile")}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* PAN Image */}
              <div>
                <Label>PAN Card Image</Label>
                <div className="flex flex-col gap-3">
                  {panImagePreview || formData.panImageUrl ? (
                    <Image
                      src={panImagePreview || formData.panImageUrl || ""}
                      alt="PAN Card"
                      width={120}
                      height={120}
                      className="rounded-md object-cover border"
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] bg-gray-100 rounded-md border flex items-center justify-center text-gray-500 text-sm">
                      No PAN Image
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "pan")}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <FormSection title="Address Details">
            <div>
              <Label>House Number</Label>
              <Input
                value={formData.address?.houseNumber || ""}
                onChange={(e) =>
                  handleNestedChange("address", "houseNumber", e.target.value)
                }
                placeholder="House Number"
                required
              />
            </div>

            <div>
              <Label>Street</Label>
              <Input
                value={formData.address?.street || ""}
                onChange={(e) =>
                  handleNestedChange("address", "street", e.target.value)
                }
                placeholder="Street"
                required
              />
            </div>

            <div>
              <Label>City / Village</Label>
              <Input
                value={formData.address?.cityVillage || ""}
                onChange={(e) =>
                  handleNestedChange("address", "cityVillage", e.target.value)
                }
                placeholder="City / Village"
                required
              />
            </div>

            <div>
              <Label>Pincode</Label>
              <Input
                value={formData.address?.pincode || ""}
                onChange={(e) =>
                  handleNestedChange("address", "pincode", e.target.value)
                }
                placeholder="Pincode"
                required
              />
            </div>
          </FormSection>

          {/* Employment Details */}
          <FormSection title="Employment Details">
            <div>
              <Label>Employment Type</Label>
              <Select
                value={formData.employment?.type || ""}
                onValueChange={(value) =>
                  handleNestedChange("employment", "type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Employment Type">
                    {formData.employment?.type || "Select Employment Type"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {contributionGroups.map((group) => (
                    <SelectItem key={group._id} value={group.employmentType}>
                      {group.employmentType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Company Name</Label>
              <Select
                value={formData.employment?.companyName || ""}
                onValueChange={(value) =>
                  handleNestedChange("employment", "companyName", value)
                }
                disabled={!formData.employment?.type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Company">
                    {formData.employment?.companyName || "Select Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableCompanies.map((company) => (
                    <SelectItem key={company._id} value={company.companyName}>
                      {company.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Department</Label>
              <Select
                value={formData.employment?.department || ""}
                onValueChange={(value) =>
                  handleNestedChange("employment", "department", value)
                }
                disabled={!formData.employment?.companyName}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department">
                    {formData.employment?.department || "Select Department"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableDepartments.map((dept) => (
                    <SelectItem key={dept._id} value={dept.departmentName}>
                      {dept.departmentName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Contribution Plan (Read Only)</Label>
              <Select
                value={formData.employment?.contributionPlan || ""}
                disabled
              >
                <SelectTrigger className="bg-gray-100">
                  <SelectValue placeholder="Plan will be assigned">
                    {formData.employment?.contributionPlan ||
                      "Plan will be assigned"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availablePlans.map((plan) => (
                    <SelectItem key={plan._id} value={plan.planDetails}>
                      {plan.planDetails}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Contribution plan cannot be changed by members
              </p>
            </div>
          </FormSection>

          {/* Nominee Details */}
          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Nominee Details
              </h3>
              <span
                className={`text-sm font-bold ${nomineeError ? "text-red-600" : "text-green-600"}`}
              >
                Total Share: {nomineePercentageTotal}%
              </span>
            </div>

            {nomineeError && (
              <div
                className="flex items-center p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
                role="alert"
              >
                <AlertTriangle className="flex-shrink-0 inline w-4 h-4 mr-3" />
                <span className="font-medium">{nomineeError}</span>
              </div>
            )}

            <div className="space-y-4">
              {formData.nominees?.map((nominee: any, index: number) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg space-y-3 relative bg-gray-50"
                >
                  <h4 className="font-semibold text-sm">Nominee {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        placeholder="Nominee Name"
                        value={nominee.name || ""}
                        onChange={(e) =>
                          handleNomineeChange(index, "name", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Relation</Label>
                      <Input
                        placeholder="Relation"
                        value={nominee.relation || ""}
                        onChange={(e) =>
                          handleNomineeChange(index, "relation", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Age</Label>
                      <Input
                        placeholder="Age"
                        type="number"
                        min="1"
                        max="100"
                        value={nominee.age || ""}
                        onChange={(e) =>
                          handleNomineeChange(index, "age", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Gender</Label>
                      <Select
                        value={nominee.gender || ""}
                        onValueChange={(value) =>
                          handleNomineeChange(index, "gender", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender">
                            {nominee.gender || "Select Gender"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Percentage (%)</Label>
                      <Input
                        placeholder="Percentage"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={nominee.percentage || ""}
                        onChange={(e) =>
                          handleNomineeChange(
                            index,
                            "percentage",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  </div>

                  {formData.nominees.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => removeNominee(index)}
                      className="absolute top-2 right-2 h-7 w-7 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ))}

              <div className="flex justify-end">
                <Button type="button" onClick={addNominee} size="sm">
                  <UserPlus size={16} className="mr-2" /> Add Nominee
                </Button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            {actionError && (
              <p className="text-sm text-red-500 self-center">{actionError}</p>
            )}
            <Button
              type="submit"
              disabled={actionStatus === "loading" || !!nomineeError}
              className="px-8"
            >
              {actionStatus === "loading" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Profile
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
