"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Image component ko import kiya gaya hai
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  addOrUpdatePlan,
  resetActionStatus,
} from "@/lib/redux/features/contributionPlans/contributionPlansSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, Trash2 } from "lucide-react"; // Shield icon yahan se hata diya gaya hai

// Helper Component for dynamic lists to avoid repeating code
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
    if (inputValue.trim()) {
      onAddItem(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="space-y-3 rounded-md border p-4">
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

export default function AddContributionPlanPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { actionStatus, actionError } = useSelector(
    (state: RootState) => state.contributionPlans
  );

  // Teen alag-alag list ke liye state
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [departmentNames, setDepartmentNames] = useState<string[]>([]);
  const [planDetails, setPlanDetails] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ employmentType: string }>();

  useEffect(() => {
    dispatch(resetActionStatus());
  }, [dispatch]);

  const onSubmit: SubmitHandler<{ employmentType: string }> = (data) => {
    // Validation
    if (
      companyNames.length === 0 ||
      departmentNames.length === 0 ||
      planDetails.length === 0
    ) {
      alert(
        "Error: Please add at least one item to Company, Department, and Plan lists."
      );
      return;
    }

    // --- Yahan Jadoo hota hai! ---
    // Flat lists ko nested structure mein convert karein jo backend ko chahiye
    const companiesPayload = companyNames.map((companyName) => ({
      companyName,
      departments: departmentNames.map((departmentName) => ({
        departmentName,
        plans: planDetails, // Har department mein saare plans daal dein
      })),
    }));

    const finalData = {
      employmentType: data.employmentType,
      companies: companiesPayload,
    };

    dispatch(addOrUpdatePlan(finalData)).then((result) => {
      if (addOrUpdatePlan.fulfilled.match(result)) {
        alert("Contribution group created/updated successfully!");
        router.push("/admin/comp-list");
      }
    });
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 p-4 sm:p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl space-y-6"
      >
        <Card>
          <CardHeader className="text-center">
            {/* === BADLAAV: Shield icon ko Image component se badal diya gaya hai === */}
            <Image
              src="/logo.jpg" // Path to your logo in the public folder
              alt="Logo"
              width={48} // Corresponds to h-12
              height={48} // Corresponds to w-12
              className="mx-auto rounded-full"
            />
            <CardTitle className="text-2xl">
              Create Contribution Group
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Dynamic Input for Company Names */}
        <DynamicListInput
          title="Company Names"
          placeholder="Enter company name and click Add"
          items={companyNames}
          onAddItem={(item) => setCompanyNames((prev) => [...prev, item])}
          onRemoveItem={(item) =>
            setCompanyNames((prev) => prev.filter((i) => i !== item))
          }
        />

        {/* Dynamic Input for Department Names */}
        <DynamicListInput
          title="Department Names"
          placeholder="Enter department name and click Add"
          items={departmentNames}
          onAddItem={(item) => setDepartmentNames((prev) => [...prev, item])}
          onRemoveItem={(item) =>
            setDepartmentNames((prev) => prev.filter((i) => i !== item))
          }
        />

        {/* Dynamic Input for Contribution Plans */}
        <DynamicListInput
          title="Contribution Plans"
          placeholder="Enter contribution plan and click Add"
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
            "Save Group"
          )}
        </Button>
      </form>
    </div>
  );
}
