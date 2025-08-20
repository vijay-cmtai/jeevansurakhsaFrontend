"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { addOrUpdatePlan } from "@/lib/redux/features/contributionPlans/contributionPlansSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, Trash2, X } from "lucide-react";

// Helper component to manage dynamic lists
const DynamicListInput = ({
  title,
  placeholder,
  items,
  onAddItem,
  onRemoveItem,
}: {
  title: string;
  placeholder: string;
  items: string[];
  onAddItem: (item: string) => void;
  onRemoveItem: (item: string) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim() && !items.includes(inputValue.trim())) {
      onAddItem(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="space-y-3 rounded-md border p-4 bg-gray-50/50">
      <Label className="font-semibold">{title}</Label>
      <div className="flex items-center gap-2">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button type="button" onClick={handleAdd} className="flex-shrink-0">
          <Plus size={18} /> Add
        </Button>
      </div>
      {items.length > 0 && (
        <ul className="mt-2 space-y-1">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-100 p-2 rounded-md text-sm"
            >
              <span>{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemoveItem(item)}
                className="hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupData: any;
}

export default function EditContributionGroupModal({
  isOpen,
  onClose,
  groupData,
}: EditModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { actionStatus, actionError } = useSelector(
    (state: RootState) => state.contributionPlans
  );

  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [departmentNames, setDepartmentNames] = useState<string[]>([]);
  const [planDetails, setPlanDetails] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<{ employmentType: string }>();

  useEffect(() => {
    if (groupData) {
      setValue("employmentType", groupData.employmentType);

      const initialCompanyNames = groupData.companies.map(
        (c: any) => c.companyName
      );
      setCompanyNames(initialCompanyNames);

      const allDeptNames = groupData.companies.flatMap((c: any) =>
        c.departments.map((d: any) => d.departmentName)
      );
      setDepartmentNames([...new Set(allDeptNames)]);

      const allPlansAsObjects = groupData.companies.flatMap((c: any) =>
        c.departments.flatMap((d: any) => d.plans)
      );
      const allPlansAsStrings = allPlansAsObjects.map(
        (p: any) => p.planDetails
      );
      setPlanDetails([...new Set(allPlansAsStrings)]);
    } else {
      reset();
      setCompanyNames([]);
      setDepartmentNames([]);
      setPlanDetails([]);
    }
  }, [groupData, setValue, reset]);

  const onSubmit: SubmitHandler<{ employmentType: string }> = (data) => {
    if (
      companyNames.length === 0 ||
      departmentNames.length === 0 ||
      planDetails.length === 0
    ) {
      alert("Error: Company, Department, and Plan lists cannot be empty.");
      return;
    }

    const companiesPayload = companyNames.map((companyName) => ({
      companyName,
      departments: departmentNames.map((departmentName) => ({
        departmentName,
        plans: planDetails.map((planStr) => ({ planDetails: planStr })),
      })),
    }));

    const finalData = {
      _id: groupData._id,
      employmentType: data.employmentType,
      companies: companiesPayload,
    };

    dispatch(addOrUpdatePlan(finalData)).then((result) => {
      if (addOrUpdatePlan.fulfilled.match(result)) {
        alert("Contribution group updated successfully!");
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white z-10 border-b">
          <CardTitle className="text-2xl">Edit Contribution Group</CardTitle>
          <Button variant="ghost" size="icon" type="button" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto">
          <CardContent className="p-6 space-y-6">
            <div>
              <Label htmlFor="employmentType" className="font-semibold text-lg">
                Employment Type
              </Label>
              <Input
                id="employmentType"
                placeholder="e.g., Government Employee"
                {...register("employmentType", {
                  required: "Employment type is required.",
                })}
              />
              {errors.employmentType && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.employmentType.message}
                </p>
              )}
            </div>

            <DynamicListInput
              title="Company Names"
              placeholder="Enter company name"
              items={companyNames}
              onAddItem={(item) => setCompanyNames((prev) => [...prev, item])}
              onRemoveItem={(item) =>
                setCompanyNames((prev) => prev.filter((i) => i !== item))
              }
            />

            <DynamicListInput
              title="Department Names"
              placeholder="Enter department name"
              items={departmentNames}
              onAddItem={(item) =>
                setDepartmentNames((prev) => [...prev, item])
              }
              onRemoveItem={(item) =>
                setDepartmentNames((prev) => prev.filter((i) => i !== item))
              }
            />

            <DynamicListInput
              title="Contribution Plans"
              placeholder="Enter contribution plan"
              items={planDetails}
              onAddItem={(item) => setPlanDetails((prev) => [...prev, item])}
              onRemoveItem={(item) =>
                setPlanDetails((prev) => prev.filter((i) => i !== item))
              }
            />

            {actionStatus === "failed" && actionError && (
              <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">
                {actionError}
              </p>
            )}

            <Button
              type="submit"
              className="w-full text-lg py-3"
              disabled={actionStatus === "loading"}
            >
              {actionStatus === "loading" ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Update Group"
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
