"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Member,
  fetchActiveMembers,
} from "@/lib/redux/features/members/membersSlice";
import { sendSingleNotice } from "@/lib/redux/features/notices/noticesSlice";

export default function SendNoticeToSinglePage() {
  const dispatch = useDispatch<AppDispatch>();

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const { activeMembers, listStatus } = useSelector(
    (state: RootState) => state.members
  );
  const { actionStatus } = useSelector((state: RootState) => state.notices);

  useEffect(() => {
    // Fetch a large number to get all active members for the list
    dispatch(fetchActiveMembers({ limit: 1000 }));
  }, [dispatch]);

  const handleOpenModal = (member: Member) => {
    setSelectedMember(member);
    // Reset form fields
    setTitle("");
    setSubject("");
    setContent("");
  };

  const handleSendNotice = () => {
    if (!selectedMember || !title || !subject || !content) {
      alert("Please fill all fields: Title, Subject, and Content.");
      return;
    }
    dispatch(
      sendSingleNotice({
        memberId: selectedMember._id,
        title,
        subject,
        content,
      })
    ).then((result) => {
      if (sendSingleNotice.fulfilled.match(result)) {
        alert(`Notice sent successfully to ${selectedMember.fullName}!`);
        setSelectedMember(null); // Close the dialog
      } else {
        alert(`Error: ${result.payload}`);
      }
    });
  };

  const columns = [
    {
      key: "sr",
      label: "Sr.No.",
      render: (_: Member, index: number) => index + 1,
    },
    {
      key: "details",
      label: "Reg. No / Name / Email / Mobile",
      render: (row: Member) => (
        <div>
          <p className="font-semibold">
            {row.registrationNo || "N/A"} / {row.fullName}
          </p>
          <p className="text-xs text-gray-500">
            {row.email} / {row.phone}
          </p>
        </div>
      ),
    },
    {
      key: "regDate",
      label: "Reg. Date",
      render: (row: Member) => format(new Date(row.createdAt), "dd-MM-yyyy"),
    },
    {
      key: "action",
      label: "Action",
      render: (row: Member) => (
        <Button size="sm" onClick={() => handleOpenModal(row)}>
          Send Notice Now
        </Button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        title="Send Notice To Single User"
        columns={columns}
        data={activeMembers}
        totalEntries={activeMembers.length}
        isLoading={listStatus === "loading"}
      />

      <Dialog
        open={!!selectedMember}
        onOpenChange={() => setSelectedMember(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Notice to {selectedMember?.fullName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Textarea
              placeholder="Notice Content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              onClick={handleSendNotice}
              className="w-full"
              disabled={actionStatus === "loading"}
            >
              {actionStatus === "loading" ? "Sending..." : "Send Now"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
