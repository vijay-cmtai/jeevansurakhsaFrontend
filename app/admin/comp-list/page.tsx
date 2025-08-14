"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import {
  fetchContributionGroups,
  deleteContributionGroup,
} from "@/lib/redux/features/contributionPlans/contributionPlansSlice";

import EditContributionGroupModal from "@/app/admin/EditContributionGroupModal";
interface GroupRowData {
  groupId: string;
  recordId: string;
  employmentType: string;
  companyNames: string;
  departmentNames: string;
  planDetails: string;
  createdAt: string;
  originalGroup: any;
}

export default function CompListPage() {
  const dispatch = useDispatch<AppDispatch>();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any | null>(null);

  const { groups, listStatus, actionStatus } = useSelector(
    (state: RootState) => state.contributionPlans
  );
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const userIsAdmin = userInfo?.role === "Admin";

  useEffect(() => {
    dispatch(fetchContributionGroups());
  }, [dispatch]);

  const groupDataForTable: GroupRowData[] = useMemo(() => {
    if (!groups) return [];
    return groups.map((group) => {
      const companyNames = group.companies.map((c) => c.companyName).join(", ");
      const allDepartments = group.companies.flatMap((c) =>
        c.departments.map((d) => d.departmentName)
      );
      const departmentNames = [...new Set(allDepartments)].join(", ");
      const allPlans = group.companies.flatMap((c) =>
        c.departments.flatMap((d) => d.plans.map((p) => p.planDetails))
      );
      const planDetails = [...new Set(allPlans)].join(", ");

      return {
        groupId: group._id,
        recordId: group.recordId,
        employmentType: group.employmentType,
        companyNames,
        departmentNames,
        planDetails,
        createdAt: group.createdAt,
        originalGroup: group,
      };
    });
  }, [groups]);

  const handleDelete = (groupId: string) => {
    if (confirm("Are you sure you want to delete this entire group?")) {
      dispatch(deleteContributionGroup(groupId));
    }
  };

  const handleEditClick = (groupData: GroupRowData) => {
    setEditingGroup(groupData.originalGroup);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingGroup(null);
  };

  const columns = [
    {
      key: "sr",
      label: "Sr No",
      render: (_: GroupRowData, i: number) => i + 1,
    },
    { key: "recordId", label: "Record ID" },
    { key: "employmentType", label: "Employment Type" },
    { key: "companyNames", label: "Company Names" },
    { key: "departmentNames", label: "Departments" },
    { key: "planDetails", label: "Contribution Plans" },
    {
      key: "date",
      label: "Date Created",
      render: (row: GroupRowData) => (
        <div className="bg-green-100 text-green-800 text-center p-2 rounded-md font-semibold min-w-[100px]">
          {format(new Date(row.createdAt), "dd-MM-yyyy")}
        </div>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row: GroupRowData) => (
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="bg-green-100 text-green-700 hover:bg-green-200"
            onClick={() => handleEditClick(row)}
          >
            <Edit size={16} />
          </Button>
          {userIsAdmin && (
            <Button
              size="icon"
              variant="ghost"
              className="bg-red-100 text-red-700 hover:bg-red-200"
              onClick={() => handleDelete(row.groupId)}
              disabled={actionStatus === "loading"}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const dataToDisplay = groupDataForTable || [];

  return (
    <>
      <DataTable
        title="Contribution Groups Details"
        columns={columns}
        data={dataToDisplay}
        totalEntries={dataToDisplay.length}
        isLoading={listStatus === "loading"}
      />

      {isEditModalOpen && editingGroup && (
        <EditContributionGroupModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          groupData={editingGroup}
        />
      )}
    </>
  );
}
