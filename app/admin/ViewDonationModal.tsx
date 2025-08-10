// "use client";
// import { useSelector, useDispatch } from "react-redux";
// import { AppDispatch, RootState } from "@/lib/redux/store";
// import { selectDonation } from "@/lib/redux/features/visitordonations/visitorDonationSlice";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { format } from "date-fns";

// // Helper row component
// const DetailRow = ({ label, value }: { label: string; value: any }) => (
//   <div className="flex justify-between py-2 border-b">
//     <p className="font-semibold text-gray-600">{label}</p>
//     <p className="text-gray-800">{value || "N/A"}</p>
//   </div>
// );

// export function ViewDonationModal() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { selectedDonation } = useSelector(
//     (state: RootState) => state.visitorDonation
//   );

//   const handleClose = () => {
//     dispatch(selectDonation(null)); // Close modal by clearing the selected donation
//   };

//   return (
//     <Dialog
//       open={!!selectedDonation}
//       onOpenChange={(isOpen) => !isOpen && handleClose()}
//     >
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Donation Details</DialogTitle>
//           <DialogDescription>
//             Full details for Receipt No: {selectedDonation?.receiptNo || "N/A"}
//           </DialogDescription>
//         </DialogHeader>
//         <div className="py-4 space-y-2 text-sm">
//           <DetailRow label="Donor Name" value={selectedDonation?.name} />
//           <DetailRow label="Mobile" value={selectedDonation?.mobile} />
//           <DetailRow label="Email" value={selectedDonation?.email} />
//           <DetailRow label="Amount" value={`₹${selectedDonation?.amount}`} />
//           <DetailRow label="Status" value={selectedDonation?.status} />
//           <DetailRow
//             label="Transaction ID"
//             value={selectedDonation?.transactionId}
//           />
//           <DetailRow
//             label="Date"
//             value={
//               selectedDonation
//                 ? format(new Date(selectedDonation.createdAt), "dd MMM, yyyy")
//                 : "N/A"
//             }
//           />
//           <DetailRow label="Address" value={selectedDonation?.address} />
//           <DetailRow label="PAN Number" value={selectedDonation?.panNumber} />
//         </div>
//         <DialogFooter>
//           <Button onClick={handleClose}>Close</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
