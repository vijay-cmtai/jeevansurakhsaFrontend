"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { Member } from "@/lib/redux/features/members/membersSlice";
import { fetchContributionGroupsForRegistration } from "@/lib/redux/features/registration/registrationSlice";
import Image from "next/image";

// Naye slice se actions import karein
import {
  fetchMemberByIdForEdit,
  updateMemberByAdmin,
  clearEditMemberState,
} from "@/lib/redux/features/admin/adminEditMemberSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// --- COMPLETE Form Validation Schema ---
const formSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  volunteerCode: z.string().optional(),
  panNumber: z.string().optional(),
  address: z.object({
    houseNumber: z.string().min(1, "House number is required"),
    street: z.string().min(1, "Street is required"),
    cityVillage: z.string().min(1, "City/Village is required"),
    pincode: z.string().min(6, "Pincode must be 6 digits"),
  }),
  employment: z.object({
    type: z.string().min(1, "Employment type is required"),
    companyName: z.string().min(1, "Company name is required"),
    department: z.string().min(1, "Department is required"),
    contributionPlan: z.string().min(1, "Contribution plan is required"),
  }),
  nominees: z.array(
    z.object({
      name: z.string().min(1, "Nominee name is required"),
      relation: z.string().min(1, "Relation is required"),
      age: z.union([z.string(), z.number()]).refine((val) => {
        const num = typeof val === "string" ? parseInt(val) : val;
        return !isNaN(num) && num > 0;
      }, "Valid age is required"),
      gender: z.string().min(1, "Gender is required"),
      percentage: z.union([z.string(), z.number()]).refine((val) => {
        const num = typeof val === "string" ? parseFloat(val) : val;
        return !isNaN(num) && num > 0;
      }, "Valid percentage is required"),
    })
  ),
});

type FormData = z.infer<typeof formSchema>;

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const memberId = params.memberId as string;
  const { toast } = useToast();

  // File state
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [panImageFile, setPanImageFile] = useState<File | null>(null);

  // Naye slice se state select karein
  const { member, fetchStatus, updateStatus } = useSelector(
    (state: RootState) => state.adminEditMember
  );

  // Contribution groups ka data registration slice se lein
  const { contributionGroups, contributionGroupsStatus } = useSelector(
    (state: RootState) => state.registration
  );

  // React Hook Form with proper typing
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nominees: [
        { name: "", relation: "", age: "", gender: "", percentage: "" },
      ],
    },
  });

  const watchedEmploymentType = watch("employment.type");
  const watchedCompanyName = watch("employment.companyName");
  const watchedDepartment = watch("employment.department");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "nominees",
  });

  // Data Fetching
  useEffect(() => {
    if (memberId) {
      dispatch(fetchMemberByIdForEdit(memberId));
    }
    dispatch(fetchContributionGroupsForRegistration());

    // Cleanup function
    return () => {
      dispatch(clearEditMemberState());
    };
  }, [dispatch, memberId]);

  // Form ko data se bharne ke liye
  useEffect(() => {
    if (member) {
      const formData: FormData = {
        fullName: member.fullName || "",
        email: member.email || "",
        phone: member.phone || "",
        dateOfBirth: member.dateOfBirth || "",
        state: member.state || "",
        district: member.district || "",
        volunteerCode: member.volunteerCode || "",
        panNumber: member.panNumber || "",
        address: {
          houseNumber: member.address?.houseNumber || "",
          street: member.address?.street || "",
          cityVillage: member.address?.cityVillage || "",
          pincode: member.address?.pincode || "",
        },
        employment: {
          type: member.employment?.type || "",
          companyName: member.employment?.companyName || "",
          department: member.employment?.department || "",
          contributionPlan: member.employment?.contributionPlan || "",
        },
        nominees: member.nominees?.length
          ? member.nominees.map((nominee) => ({
              name: nominee.name || "",
              relation: nominee.relation || "",
              age: nominee.age || "",
              gender: nominee.gender || "",
              percentage: nominee.percentage || "",
            }))
          : [{ name: "", relation: "", age: "", gender: "", percentage: "" }],
      };
      reset(formData);
    }
  }, [member, reset]);

  // Cascading Dropdown Logic
  const availableCompanies = useMemo(() => {
    const selectedGroup = contributionGroups.find(
      (g) => g.employmentType === watchedEmploymentType
    );
    return selectedGroup ? selectedGroup.companies : [];
  }, [watchedEmploymentType, contributionGroups]);

  const availableDepartments = useMemo(() => {
    const selectedCompany = availableCompanies.find(
      (c) => c.companyName === watchedCompanyName
    );
    return selectedCompany ? selectedCompany.departments : [];
  }, [watchedCompanyName, availableCompanies]);

  const availablePlans = useMemo(() => {
    const selectedDepartment = availableDepartments.find(
      (d) => d.departmentName === watchedDepartment
    );
    return selectedDepartment ? selectedDepartment.plans : [];
  }, [watchedDepartment, availableDepartments]);

  // Form Submission - FIXED
  const onSubmit = (data: FormData) => {
    const formDataToSubmit = new FormData();

    // Basic fields
    formDataToSubmit.append("fullName", data.fullName);
    formDataToSubmit.append("email", data.email);
    formDataToSubmit.append("phone", data.phone);
    formDataToSubmit.append("dateOfBirth", data.dateOfBirth);
    formDataToSubmit.append("state", data.state);
    formDataToSubmit.append("district", data.district);

    if (data.volunteerCode) {
      formDataToSubmit.append("volunteerCode", data.volunteerCode);
    }
    if (data.panNumber) {
      formDataToSubmit.append("panNumber", data.panNumber);
    }

    // Address as JSON string
    formDataToSubmit.append("address", JSON.stringify(data.address));

    // Employment as JSON string
    formDataToSubmit.append("employment", JSON.stringify(data.employment));

    // Nominees as JSON string
    formDataToSubmit.append("nominees", JSON.stringify(data.nominees));

    // Files
    if (profileImageFile) {
      formDataToSubmit.append("profileImage", profileImageFile);
    }
    if (panImageFile) {
      formDataToSubmit.append("panImage", panImageFile);
    }

    console.log("Form data being sent:", {
      formData: Object.fromEntries(formDataToSubmit.entries()),
    });

    dispatch(
      updateMemberByAdmin({ memberId, formData: formDataToSubmit })
    ).then((result) => {
      if (updateMemberByAdmin.fulfilled.match(result)) {
        toast({
          title: "Success",
          description: "Member updated successfully!",
        });
        router.push("/admin/active-members");
      } else {
        toast({
          title: "Update Failed",
          description:
            (result.payload as string) || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  if (fetchStatus === "loading" || !member) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg">
        <div className="bg-gray-50 p-4 text-center border-b">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={64}
            height={64}
            className="mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Member Profile
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <Section title="State Selection">
            <FormRow label="State">
              <Input
                placeholder="State"
                {...register("state")}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.state.message}
                </p>
              )}
            </FormRow>

            <FormRow label="District">
              <Input
                placeholder="District"
                {...register("district")}
                className={errors.district ? "border-red-500" : ""}
              />
              {errors.district && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.district.message}
                </p>
              )}
            </FormRow>

            <FormRow label="Referral ID">
              <Input placeholder="Referral ID" {...register("volunteerCode")} />
            </FormRow>
          </Section>

          <Section title="Personal & Address Details">
            <FormRow label="Name">
              <Input
                {...register("fullName")}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </FormRow>

            <FormRow label="Email">
              <Input
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </FormRow>

            <FormRow label="Phone">
              <Input
                {...register("phone")}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </FormRow>

            <FormRow label="Date of Birth">
              <Input
                type="date"
                {...register("dateOfBirth")}
                className={errors.dateOfBirth ? "border-red-500" : ""}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </FormRow>

            <FormRow label="PAN Number">
              <Input {...register("panNumber")} />
            </FormRow>

            <ImageUploadRow
              label="PAN Card Photo"
              oldImageUrl={member.panImageUrl}
              onFileChange={setPanImageFile}
            />

            <ImageUploadRow
              label="Profile Photo"
              oldImageUrl={member.profileImageUrl}
              onFileChange={setProfileImageFile}
            />

            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                placeholder="House No."
                {...register("address.houseNumber")}
                className={errors.address?.houseNumber ? "border-red-500" : ""}
              />
              {errors.address?.houseNumber && (
                <p className="text-red-500 text-sm">
                  {errors.address.houseNumber.message}
                </p>
              )}

              <Input
                placeholder="Street"
                {...register("address.street")}
                className={errors.address?.street ? "border-red-500" : ""}
              />
              {errors.address?.street && (
                <p className="text-red-500 text-sm">
                  {errors.address.street.message}
                </p>
              )}

              <Input
                placeholder="City/Village"
                {...register("address.cityVillage")}
                className={errors.address?.cityVillage ? "border-red-500" : ""}
              />
              {errors.address?.cityVillage && (
                <p className="text-red-500 text-sm">
                  {errors.address.cityVillage.message}
                </p>
              )}

              <Input
                placeholder="Pincode"
                {...register("address.pincode")}
                className={errors.address?.pincode ? "border-red-500" : ""}
              />
              {errors.address?.pincode && (
                <p className="text-red-500 text-sm">
                  {errors.address.pincode.message}
                </p>
              )}
            </div>
          </Section>

          <Section title="Employment Details">
            {contributionGroupsStatus === "loading" && (
              <Loader2 className="animate-spin mx-auto" />
            )}

            <FormRow label="Employment Type">
              <Controller
                control={control}
                name="employment.type"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("employment.companyName", "");
                      setValue("employment.department", "");
                      setValue("employment.contributionPlan", "");
                    }}
                  >
                    <SelectTrigger
                      className={
                        errors.employment?.type ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contributionGroups.map((group) => (
                        <SelectItem
                          key={group._id}
                          value={group.employmentType}
                        >
                          {group.employmentType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.employment?.type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.employment.type.message}
                </p>
              )}
            </FormRow>

            <FormRow label="Company Name">
              <Controller
                control={control}
                name="employment.companyName"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("employment.department", "");
                      setValue("employment.contributionPlan", "");
                    }}
                    disabled={
                      !watchedEmploymentType || availableCompanies.length === 0
                    }
                  >
                    <SelectTrigger
                      className={
                        errors.employment?.companyName ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCompanies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.companyName}
                        >
                          {company.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.employment?.companyName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.employment.companyName.message}
                </p>
              )}
            </FormRow>

            <FormRow label="Department">
              <Controller
                control={control}
                name="employment.department"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("employment.contributionPlan", "");
                    }}
                    disabled={
                      !watchedCompanyName || availableDepartments.length === 0
                    }
                  >
                    <SelectTrigger
                      className={
                        errors.employment?.department ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDepartments.map((dept) => (
                        <SelectItem key={dept._id} value={dept.departmentName}>
                          {dept.departmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.employment?.department && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.employment.department.message}
                </p>
              )}
            </FormRow>

            <FormRow label="Contribution Plan">
              <Controller
                control={control}
                name="employment.contributionPlan"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={!watchedDepartment || availablePlans.length === 0}
                  >
                    <SelectTrigger
                      className={
                        errors.employment?.contributionPlan
                          ? "border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePlans.map((plan) => (
                        <SelectItem key={plan._id} value={plan.planDetails}>
                          {plan.planDetails}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.employment?.contributionPlan && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.employment.contributionPlan.message}
                </p>
              )}
            </FormRow>
          </Section>

          <Section title="Nominee Details">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border p-3 rounded-md mb-2 relative"
              >
                <Input
                  placeholder="Nominee Name"
                  {...register(`nominees.${index}.name`)}
                  className={`mb-2 ${errors.nominees?.[index]?.name ? "border-red-500" : ""}`}
                />
                {errors.nominees?.[index]?.name && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.nominees[index]?.name?.message}
                  </p>
                )}

                <Input
                  placeholder="Relation"
                  {...register(`nominees.${index}.relation`)}
                  className={`mb-2 ${errors.nominees?.[index]?.relation ? "border-red-500" : ""}`}
                />
                {errors.nominees?.[index]?.relation && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.nominees[index]?.relation?.message}
                  </p>
                )}

                <Input
                  placeholder="Age"
                  type="number"
                  {...register(`nominees.${index}.age`)}
                  className={`mb-2 ${errors.nominees?.[index]?.age ? "border-red-500" : ""}`}
                />
                {errors.nominees?.[index]?.age && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.nominees[index]?.age?.message}
                  </p>
                )}

                <Controller
                  control={control}
                  name={`nominees.${index}.gender`}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={`mb-2 ${errors.nominees?.[index]?.gender ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.nominees?.[index]?.gender && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.nominees[index]?.gender?.message}
                  </p>
                )}

                <Input
                  placeholder="Percentage"
                  type="number"
                  {...register(`nominees.${index}.percentage`)}
                  className={
                    errors.nominees?.[index]?.percentage ? "border-red-500" : ""
                  }
                />
                {errors.nominees?.[index]?.percentage && (
                  <p className="text-red-500 text-sm">
                    {errors.nominees[index]?.percentage?.message}
                  </p>
                )}

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => remove(index)}
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              onClick={() =>
                append({
                  name: "",
                  relation: "",
                  age: "",
                  gender: "",
                  percentage: "",
                })
              }
            >
              Add Nominee
            </Button>
          </Section>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              className="w-full"
              disabled={updateStatus === "loading"}
            >
              {updateStatus === "loading" ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Update Member"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Helper Components ---
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border p-4 rounded-lg">
    <h3 className="font-semibold text-lg mb-4 text-gray-700">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const FormRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <Label className="text-sm font-medium text-gray-600">{label}</Label>
    <div className="mt-1">{children}</div>
  </div>
);

const ImageUploadRow = ({
  label,
  oldImageUrl,
  onFileChange,
}: {
  label: string;
  oldImageUrl?: string;
  onFileChange: (file: File | null) => void;
}) => (
  <FormRow label={label}>
    {oldImageUrl && (
      <div className="mb-2">
        <p className="text-xs text-gray-500 mb-1">Current Photo:</p>
        <Image
          src={oldImageUrl}
          alt="Current"
          width={100}
          height={100}
          className="rounded-md border"
        />
      </div>
    )}
    <Input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0] || null;
        onFileChange(file);
      }}
    />
  </FormRow>
);
