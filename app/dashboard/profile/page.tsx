"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getMemberProfile } from "@/lib/redux/features/auth/authSlice";
import { updateMemberProfile } from "@/lib/redux/features/members/membersSlice";
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

  const [formData, setFormData] = useState<any>({});
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

  // === BADLAAV YAHAN KIYA GAYA HAI: Nominee validation ke liye naye state variables ===
  const [nomineePercentageTotal, setNomineePercentageTotal] = useState(0);
  const [nomineeError, setNomineeError] = useState<string | null>(null);

  useEffect(() => {
    if (!userInfo) {
      dispatch(getMemberProfile());
    } else if (Object.keys(formData).length === 0) {
      setFormData({
        ...userInfo,
        nominees:
          userInfo.nominees && userInfo.nominees.length > 0
            ? userInfo.nominees
            : [{ name: "", relation: "", age: "", gender: "", percentage: "" }],
      });
    }
  }, [userInfo, dispatch, formData]);

  // === BADLAAV YAHAN KIYA GAYA HAI: Nominee percentage ko calculate aur validate karne ke liye useEffect ===
  useEffect(() => {
    // Sirf tab calculate karein jab nominees maujood ho
    if (formData.nominees && formData.nominees.length > 0) {
      const total = formData.nominees.reduce((acc: number, nominee: any) => {
        // percentage ko number mein convert karein, agar khali hai to 0 maanein
        return acc + (parseFloat(nominee.percentage) || 0);
      }, 0);

      setNomineePercentageTotal(total);

      // Agar total 100 nahi hai to error set karein
      if (total !== 100) {
        setNomineeError(
          `Total percentage must be 100%. Current total is ${total}%.`
        );
      } else {
        // Agar total 100 hai to error hata dein
        setNomineeError(null);
      }
    } else {
      // Agar koi nominee nahi hai to total 0 hai aur koi error nahi hai
      setNomineePercentageTotal(0);
      setNomineeError(null);
    }
  }, [formData.nominees]); // Yeh useEffect tabhi chalega jab nominees array mein koi badlaav hoga

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNestedChange = (parent: string, field: string, value: string) => {
    setFormData({
      ...formData,
      [parent]: { ...formData[parent], [field]: value },
    });
  };

  const handleNestedSelect = (parent: string, field: string, value: string) => {
    setFormData({
      ...formData,
      [parent]: { ...formData[parent], [field]: value },
    });
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // === BADLAAV YAHAN KIYA GAYA HAI: Submit karne se pehle final check ===
    if (nomineeError) {
      toast({
        title: "Invalid Nominee Details",
        description: nomineeError,
        variant: "destructive",
      });
      return; // Form submission ko rokein
    }

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("phone", formData.phone);
    data.append("panNumber", formData.panNumber || "");
    data.append("address", JSON.stringify(formData.address));
    data.append("employment", JSON.stringify(formData.employment));
    data.append("nominees", JSON.stringify(formData.nominees));
    if (profileImageFile) {
      data.append("profileImage", profileImageFile);
    }

    const resultAction = await dispatch(updateMemberProfile(data));
    if (updateMemberProfile.fulfilled.match(resultAction)) {
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
    }
  };

  if (
    authStatus === "loading" ||
    !userInfo ||
    Object.keys(formData).length === 0
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
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
          <FormSection title="Personal Details">
            {/* ... other fields remain same ... */}
            <Input
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              placeholder="Full Name"
            />
            <Input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="Phone Number"
              type="tel"
            />
            <Input
              name="email"
              value={formData.email || ""}
              readOnly
              disabled
              className="bg-gray-100"
            />
            <Input
              name="panNumber"
              value={formData.panNumber || ""}
              onChange={handleChange}
              placeholder="PAN Number"
            />
          </FormSection>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Profile Picture
            </h3>
            <div className="flex items-center gap-4">
              <Image
                src={
                  profileImagePreview ||
                  formData.profileImageUrl ||
                  "https://placehold.co/80x80/EFEFEF/AAAAAA&text=Photo"
                }
                alt="Profile"
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
              <Input
                type="file"
                onChange={handleFileChange}
                className="text-sm"
              />
            </div>
          </div>

          <FormSection title="Address Details">
            {/* ... other fields remain same ... */}
            <Input
              value={formData.address?.houseNumber || ""}
              onChange={(e) =>
                handleNestedChange("address", "houseNumber", e.target.value)
              }
              placeholder="House Number"
            />
            <Input
              value={formData.address?.street || ""}
              onChange={(e) =>
                handleNestedChange("address", "street", e.target.value)
              }
              placeholder="Street"
            />
            <Input
              value={formData.address?.cityVillage || ""}
              onChange={(e) =>
                handleNestedChange("address", "cityVillage", e.target.value)
              }
              placeholder="City / Village"
            />
            <Input
              value={formData.address?.pincode || ""}
              onChange={(e) =>
                handleNestedChange("address", "pincode", e.target.value)
              }
              placeholder="Pincode"
            />
          </FormSection>

          <FormSection title="Employment Details">
            {/* ... other fields remain same ... */}
            <Input
              value={formData.employment?.type || ""}
              readOnly
              disabled
              className="bg-gray-100"
            />
            <Input
              value={formData.employment?.department || ""}
              onChange={(e) =>
                handleNestedChange("employment", "department", e.target.value)
              }
              placeholder="Department"
            />
            <Input
              value={formData.employment?.companyName || ""}
              onChange={(e) =>
                handleNestedChange("employment", "companyName", e.target.value)
              }
              placeholder="Company Name"
            />
            <Select
              value={formData.employment?.contributionPlan || ""}
              onValueChange={(value) =>
                handleNestedSelect("employment", "contributionPlan", value)
              }
              disabled
            >
              <SelectTrigger className="bg-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 Crore Plan">1 Crore Plan</SelectItem>
                <SelectItem value="50 Lakhs Plan">50 Lakhs Plan</SelectItem>
              </SelectContent>
            </Select>
          </FormSection>

          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Nominee Details
              </h3>
              {/* === BADLAAV YAHAN KIYA GAYA HAI: Total percentage ko display karna === */}
              <span
                className={`text-sm font-bold ${nomineeError ? "text-red-600" : "text-green-600"}`}
              >
                Total Share: {nomineePercentageTotal}%
              </span>
            </div>

            {/* === BADLAAV YAHAN KIYA GAYA HAI: Error message ko display karna === */}
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
                    <Input
                      placeholder="Nominee Name"
                      value={nominee.name || ""}
                      onChange={(e) =>
                        handleNomineeChange(index, "name", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Relation"
                      value={nominee.relation || ""}
                      onChange={(e) =>
                        handleNomineeChange(index, "relation", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Age"
                      type="number"
                      value={nominee.age || ""}
                      onChange={(e) =>
                        handleNomineeChange(index, "age", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Gender"
                      value={nominee.gender || ""}
                      onChange={(e) =>
                        handleNomineeChange(index, "gender", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Percentage (%)"
                      type="number"
                      min="0"
                      max="100"
                      value={nominee.percentage || ""}
                      onChange={(e) =>
                        handleNomineeChange(index, "percentage", e.target.value)
                      }
                    />
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

          <div className="flex justify-end gap-4 pt-6 border-t">
            {actionError && (
              <p className="text-sm text-red-500 self-center">{actionError}</p>
            )}
            {/* === BADLAAV YAHAN KIYA GAYA HAI: Button ko disable karna agar error hai === */}
            <Button
              type="submit"
              disabled={actionStatus === "loading" || !!nomineeError}
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
