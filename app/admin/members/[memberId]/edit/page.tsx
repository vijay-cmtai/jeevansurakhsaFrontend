"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchMemberById,
  updateMemberByAdmin,
  Member,
} from "@/lib/redux/features/members/membersSlice";
import { format } from "date-fns";
import Image from "next/image"; // Image component imported

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
import { Loader2, Trash2 } from "lucide-react"; // Shield is removed as it's no longer used

// --- Form Validation Schema (using Zod) ---
const formSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  panNumber: z.string().optional(),
  // Add other fields as needed
});

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const memberId = params.memberId as string;

  const {
    selectedMember: member,
    listStatus,
    actionStatus,
  } = useSelector((state: RootState) => state.members);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Member>({
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "nominees",
  });

  useEffect(() => {
    if (memberId) {
      dispatch(fetchMemberById(memberId));
    }
  }, [dispatch, memberId]);

  useEffect(() => {
    if (member) {
      reset(member);
    }
  }, [member, reset]);

  const onSubmit = (data: Member) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const value = (data as any)[key];
      if (key === "nominees" || key === "address" || key === "employment") {
        formData.append(key, JSON.stringify(value));
      } else if (
        key.endsWith("Image") &&
        value instanceof FileList &&
        value.length > 0
      ) {
        formData.append(key, value[0]);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    dispatch(updateMemberByAdmin({ memberId, formData })).then((result) => {
      if (updateMemberByAdmin.fulfilled.match(result)) {
        alert("Member updated successfully!");
        router.push("/admin/active-members");
      } else {
        alert(`Update failed: ${result.payload}`);
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
    <div className="min-h-screen bg-gray-800 p-4 sm:p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg">
        <div className="bg-gray-100 p-4 text-center border-b">
          {/* 🔻🔻🔻 BADLAV 1: Shield icon ko Image se badla gaya 🔻🔻🔻 */}
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={64}
            height={64}
            className="mx-auto mb-2"
          />
          {/* 🔺🔺🔺 Badlav yahan samapt hota hai 🔺🔺🔺 */}
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Your Profile
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <Section title="State Selection">
            <Input defaultValue={member.state} {...register("state")} />
            <Input defaultValue={member.district} {...register("district")} />
            <Input
              placeholder="Referral ID"
              defaultValue={member.volunteerCode}
              {...register("volunteerCode")}
            />
          </Section>

          <Section title="Personal & Address Details">
            <FormRow label="Name">
              <Input defaultValue={member.fullName} {...register("fullName")} />
            </FormRow>
            <FormRow label="Email (read-only)">
              <Input defaultValue={member.email} readOnly />
            </FormRow>
            <FormRow label="PAN Number">
              <Input
                defaultValue={member.panNumber}
                {...register("panNumber")}
              />
            </FormRow>
            <ImageUploadRow
              label="PAN Card Photo"
              oldImageUrl={member.panImageUrl}
              register={register}
              name="panImage"
            />
            <ImageUploadRow
              label="Profile Photo"
              oldImageUrl={member.profileImageUrl}
              register={register}
              name="profileImage"
            />

            <FormRow label="Address">
              <Input
                placeholder="House No."
                defaultValue={member.address?.houseNumber}
                {...register("address.houseNumber")}
              />
              <Input
                placeholder="Street"
                defaultValue={member.address?.street}
                {...register("address.street")}
                className="mt-2"
              />
              <Input
                placeholder="City/Village"
                defaultValue={member.address?.cityVillage}
                {...register("address.cityVillage")}
                className="mt-2"
              />
              <Input
                placeholder="Pincode"
                defaultValue={member.address?.pincode}
                {...register("address.pincode")}
                className="mt-2"
              />
            </FormRow>
          </Section>

          {/* 🔻🔻🔻 BADLAV 2: Employment Details section mein naya field joda gaya 🔻🔻🔻 */}
          <Section title="Employment Details">
            <Input
              placeholder="Type"
              defaultValue={member.employment?.type}
              {...register("employment.type")}
            />
            <Input
              placeholder="Department"
              defaultValue={member.employment?.department}
              {...register("employment.department")}
            />
            <Input
              placeholder="Company"
              defaultValue={member.employment?.companyName}
              {...register("employment.companyName")}
            />
            <Input
              placeholder="Contribution Plan"
              defaultValue={member.employment?.contributionPlan}
              {...register("employment.contributionPlan")}
            />
          </Section>
          {/* 🔺🔺🔺 Badlav yahan samapt hota hai 🔺🔺🔺 */}

          <Section title="Nominee Details">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border p-3 rounded-md mb-2 relative"
              >
                <Input
                  placeholder="Nominee Name"
                  {...register(`nominees.${index}.name`)}
                  className="mb-2"
                />
                <Input
                  placeholder="Relation"
                  {...register(`nominees.${index}.relation`)}
                  className="mb-2"
                />
                <Input
                  placeholder="Age"
                  type="number"
                  {...register(`nominees.${index}.age`)}
                  className="mb-2"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => remove(index)}
                >
                  <Trash2 size={14} />
                </Button>
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
              disabled={actionStatus === "loading"}
            >
              {actionStatus === "loading" ? (
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

const ImageUploadRow = ({ label, oldImageUrl, register, name }: any) => (
  <FormRow label={label}>
    {oldImageUrl && (
      <div className="mb-2">
        <p className="text-xs text-gray-500 mb-1">Old Photo:</p>
        <Image
          src={oldImageUrl}
          alt="Old"
          width={100}
          height={100}
          className="rounded-md border"
        />
      </div>
    )}
    <Input type="file" {...register(name)} />
  </FormRow>
);
