// File: app/volunteers/page.tsx
"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchConfigData } from "@/lib/redux/features/config/configSlice";
import { Loader2, AlertTriangle, UserX } from "lucide-react";

export default function VolunteersPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Redux store se data aur status get karein
  const { volunteers, status, error } = useSelector(
    (state: RootState) => state.config
  );

  // Component load hone par data fetch karein
  useEffect(() => {
    // Agar volunteers pehle se nahi hain, tabhi fetch karein
    if (volunteers.length === 0) {
      dispatch(fetchConfigData());
    }
  }, [dispatch, volunteers.length]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-slate-800">
          Our Volunteers
        </h1>

        {/* --- Loading State --- */}
        {status === "loading" && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="ml-4 text-lg text-slate-600">Loading Volunteers...</p>
          </div>
        )}

        {/* --- Error State --- */}
        {status === "failed" && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p className="font-bold">Error Fetching Data</p>
            <p>{error || "An unknown error occurred."}</p>
          </div>
        )}

        {/* --- Success State with Data --- */}
        {status === "succeeded" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {volunteers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-100">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                      >
                        Volunteer Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                      >
                        Contact
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                      >
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {volunteers.map((volunteer, index) => (
                      <tr
                        key={volunteer._id}
                        className="even:bg-slate-50 hover:bg-blue-50 transition-colors"
                      >
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-slate-500 sm:pl-6">
                          {index + 1}
                        </td>
                        <td className="px-3 py-4 text-sm">
                          <div className="font-medium text-slate-900">
                            {volunteer.name}
                          </div>
                          <div className="text-slate-500">{volunteer.code}</div>
                        </td>
                        <td className="px-3 py-4 text-sm text-slate-700">
                          {volunteer.phone}
                        </td>
                        <td className="px-3 py-4 text-sm text-slate-700">
                          {volunteer.district}, {volunteer.state}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // --- No Data Found State ---
              <div className="text-center py-20">
                <UserX className="h-16 w-16 mx-auto text-slate-400" />
                <h3 className="mt-4 text-lg font-semibold text-slate-700">
                  No Volunteers Found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  There are currently no volunteers in the system.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
