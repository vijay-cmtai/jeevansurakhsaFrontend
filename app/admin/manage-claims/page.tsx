"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import {
  Claim,
  fetchClaimsByAdmin,
  updateClaimByAdmin,
  deleteClaimByAdmin,
} from "@/lib/redux/features/claims/claimsSlice";
import { format } from "date-fns";
import { Loader2, Edit, Trash2 } from "lucide-react";

type FormData = {
  dateOfDeath: string;
  nomineeDetails: {
    name: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  contributionAmountRequired: number;
  contributionPlan: string;
  claimStatus: string;
  deceasedMemberPhoto: FileList;
  deathCertificate: FileList;
};

interface ClaimFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
  initialData?: Claim | null;
  onClose: () => void;
}

const ClaimForm = ({
  onSubmit,
  isLoading,
  initialData,
  onClose,
}: ClaimFormProps) => {
  const { register, handleSubmit, setValue } = useForm<FormData>();

  useEffect(() => {
    if (initialData) {
      setValue(
        "dateOfDeath",
        new Date(initialData.dateOfDeath).toISOString().split("T")[0]
      );
      setValue("nomineeDetails.name", initialData.nomineeDetails.name);
      setValue(
        "nomineeDetails.accountNumber",
        initialData.nomineeDetails.accountNumber
      );
      setValue(
        "nomineeDetails.ifscCode",
        initialData.nomineeDetails.ifscCode || ""
      );
      setValue(
        "nomineeDetails.bankName",
        initialData.nomineeDetails.bankName || ""
      );
      setValue(
        "contributionAmountRequired",
        initialData.contributionAmountRequired
      );
      setValue("contributionPlan", initialData.contributionPlan);
      setValue("claimStatus", initialData.claimStatus);
    }
  }, [initialData, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-h-[70vh] overflow-y-auto p-4 border-t"
    >
      <div className="bg-gray-50 p-3 rounded-md border">
        <p className="text-sm">
          <strong>Member:</strong> {initialData?.deceasedMember.fullName}
        </p>
        <p className="text-sm">
          <strong>Reg. No:</strong> {initialData?.deceasedMember.registrationNo}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfDeath">Date of Death</Label>
          <Input
            id="dateOfDeath"
            type="date"
            {...register("dateOfDeath", { required: true })}
          />
        </div>
        <div>
          <Label htmlFor="contributionPlan">Contribution Plan</Label>
          <Input
            id="contributionPlan"
            {...register("contributionPlan", { required: true })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="contributionAmountRequired">
          Contribution Amount Required
        </Label>
        <Input
          id="contributionAmountRequired"
          type="number"
          {...register("contributionAmountRequired", {
            required: true,
            valueAsNumber: true,
          })}
          placeholder="e.g., 500000"
        />
      </div>
      <div>
        <Label htmlFor="claimStatus">Claim Status</Label>
        <select
          id="claimStatus"
          {...register("claimStatus")}
          className="w-full p-2 border rounded-md bg-white"
        >
          <option value="Pending Review">Pending Review</option>
          <option value="Active">Active</option>
          <option value="Processing">Processing</option>
          <option value="Paid">Paid</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <h3 className="font-semibold pt-4 border-t">Nominee Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Nominee Name</Label>
          <Input {...register("nomineeDetails.name", { required: true })} />
        </div>
        <div>
          <Label>Account Number</Label>
          <Input
            {...register("nomineeDetails.accountNumber", { required: true })}
          />
        </div>
        <div>
          <Label>IFSC Code</Label>
          <Input {...register("nomineeDetails.ifscCode")} />
        </div>
        <div>
          <Label>Bank Name</Label>
          <Input {...register("nomineeDetails.bankName")} />
        </div>
      </div>
      <h3 className="font-semibold pt-4 border-t">Update Documents</h3>
      <div>
        <Label>Update Deceased Member Photo</Label>
        {initialData?.deceasedMemberPhotoUrl && (
          <div className="my-2">
            <Image
              src={initialData.deceasedMemberPhotoUrl}
              alt="Deceased Photo"
              width={80}
              height={80}
              className="rounded-md object-cover"
            />
          </div>
        )}
        <Input
          type="file"
          {...register("deceasedMemberPhoto")}
          accept="image/*"
        />
      </div>
      <div>
        <Label>Update Death Certificate</Label>
        {initialData?.deathCertificateUrl && (
          <a
            href={initialData.deathCertificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline my-2 block"
          >
            View Uploaded Certificate
          </a>
        )}
        <Input
          type="file"
          {...register("deathCertificate")}
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>
      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-600 hover:bg-green-700";
    case "Pending Review":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "Processing":
      return "bg-blue-500 hover:bg-blue-600";
    case "Paid":
      return "bg-indigo-600 hover:bg-indigo-700";
    case "Rejected":
      return "bg-red-600 hover:bg-red-700";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

export default function ManageClaimsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { claims, listStatus, actionStatus } = useSelector(
    (state: RootState) => state.claims
  );
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userIsAdmin = userInfo?.role === "Admin";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);

  useEffect(() => {
    dispatch(fetchClaimsByAdmin());
  }, [dispatch]);

  const handleFormSubmit = (data: FormData) => {
    if (!editingClaim) return;
    const formData = new FormData();
    const { deceasedMemberPhoto, deathCertificate, ...claimDetails } = data;
    formData.append("claimData", JSON.stringify(claimDetails));
    if (deceasedMemberPhoto?.[0])
      formData.append("deceasedMemberPhoto", deceasedMemberPhoto[0]);
    if (deathCertificate?.[0])
      formData.append("deathCertificate", deathCertificate[0]);

    dispatch(
      updateClaimByAdmin({ id: editingClaim._id, claimData: formData })
    ).then((result) => {
      if (updateClaimByAdmin.fulfilled.match(result)) {
        setIsModalOpen(false);
        setEditingClaim(null);
      } else {
        alert(`Error updating claim: ${result.payload}`);
      }
    });
  };

  const handleEdit = (claim: Claim) => {
    setEditingClaim(claim);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (
      confirm(
        "Are you sure you want to permanently delete this claim? This action cannot be undone."
      )
    ) {
      dispatch(deleteClaimByAdmin(id));
    }
  };

  const columns = [
    {
      key: "deceased",
      label: "Deceased Member",
      render: (row: Claim) => (
        <div className="flex items-center gap-3">
          <Image
            src={
              row.deceasedMemberPhotoUrl ||
              row.deceasedMember.profileImageUrl ||
              "/default-avatar.png"
            }
            alt={row.deceasedMember.fullName}
            width={40}
            height={40}
            className="rounded-full object-cover border"
          />
          <div>
            <p className="font-semibold">{row.deceasedMember.fullName}</p>
            <p className="text-xs text-gray-500">
              {row.deceasedMember.registrationNo}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "nominee",
      label: "Nominee",
      render: (row: Claim) => (
        <div>
          <p className="font-semibold">{row.nomineeDetails.name}</p>
          <p className="text-xs text-gray-500">
            {row.nomineeDetails.accountNumber}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: Claim) =>
        `₹${row.contributionAmountRequired.toLocaleString("en-IN")}`,
    },
    {
      key: "dateOfDeath",
      label: "Date of Death",
      render: (row: Claim) => format(new Date(row.dateOfDeath), "dd-MMM-yyyy"),
    },
    {
      key: "status",
      label: "Status",
      render: (row: Claim) => (
        <Badge className={getStatusBadgeColor(row.claimStatus)}>
          {row.claimStatus}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Claim) => (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => handleEdit(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          {userIsAdmin && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(row._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Claims</h1>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Edit Claim: {editingClaim?.deceasedMember.fullName}
            </DialogTitle>
          </DialogHeader>
          <ClaimForm
            onSubmit={handleFormSubmit}
            isLoading={actionStatus === "loading"}
            initialData={editingClaim}
            onClose={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      {listStatus === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={claims}
          title="All Submitted Claims"
          totalEntries={claims.length}
        />
      )}
    </div>
  );
}
