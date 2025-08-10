"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchConfigData,
  addStateWithDistricts,
  addVolunteer,
  deleteState,
  deleteDistrict,
  deleteVolunteer,
  clearConfigError,
} from "@/lib/redux/features/config/configSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AddStateForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [stateName, setStateName] = useState("");
  const [districtsText, setDistrictsText] = useState("");
  const { status, error } = useSelector((state: RootState) => state.config);
  const isLoading = status === "loading";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearConfigError());
    if (!stateName.trim() || !districtsText.trim()) return;
    const districtsArray = districtsText
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);
    if (districtsArray.length === 0) return;
    dispatch(
      addStateWithDistricts({
        name: stateName.trim(),
        districts: districtsArray,
      })
    )
      .unwrap()
      .then(() => {
        setStateName("");
        setDistrictsText("");
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New State and Districts</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="stateName">State Name</Label>
            <Input
              id="stateName"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              placeholder="e.g., Maharashtra"
              required
            />
          </div>
          <div>
            <Label htmlFor="districts">Districts (comma-separated)</Label>
            <Textarea
              id="districts"
              value={districtsText}
              onChange={(e) => setDistrictsText(e.target.value)}
              placeholder="e.g., Mumbai, Pune, Nagpur"
              required
              rows={4}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
              </>
            ) : (
              "Add State"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function AddVolunteerForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [volunteerName, setVolunteerName] = useState("");
  const [volunteerCode, setVolunteerCode] = useState("");
  const { status, error } = useSelector((state: RootState) => state.config);
  const isLoading = status === "loading";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearConfigError());
    if (!volunteerName.trim() || !volunteerCode.trim()) return;
    dispatch(
      addVolunteer({ name: volunteerName.trim(), code: volunteerCode.trim() })
    )
      .unwrap()
      .then(() => {
        setVolunteerName("");
        setVolunteerCode("");
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Volunteer (Optional)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="volunteerName">Volunteer Name</Label>
            <Input
              id="volunteerName"
              value={volunteerName}
              onChange={(e) => setVolunteerName(e.target.value)}
              placeholder="e.g., John Doe"
              required
            />
          </div>
          <div>
            <Label htmlFor="volunteerCode">Volunteer Code</Label>
            <Input
              id="volunteerCode"
              value={volunteerCode}
              onChange={(e) => setVolunteerCode(e.target.value)}
              placeholder="e.g., VOL123"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
              </>
            ) : (
              "Add Volunteer"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ManageConfigPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { states, volunteers, status, error } = useSelector(
    (state: RootState) => state.config
  );
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const userIsAdmin = userInfo?.role === "Admin";
  const isLoading = status === "loading";

  useEffect(() => {
    dispatch(fetchConfigData());
  }, [dispatch]);

  const handleDeleteState = (stateId: string, stateName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the state "${stateName}" and all its districts?`
      )
    ) {
      dispatch(deleteState(stateId));
    }
  };

  const handleDeleteDistrict = (
    stateId: string,
    districtId: string,
    districtName: string
  ) => {
    if (
      window.confirm(
        `Are you sure you want to delete the district "${districtName}"?`
      )
    ) {
      dispatch(deleteDistrict({ stateId, districtId }));
    }
  };

  const handleDeleteVolunteer = (
    volunteerId: string,
    volunteerName: string
  ) => {
    if (
      window.confirm(
        `Are you sure you want to delete the volunteer "${volunteerName}"?`
      )
    ) {
      dispatch(deleteVolunteer(volunteerId));
    }
  };

  if (status === "loading" && states.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "failed" && error) {
    return (
      <div className="p-6 text-red-500">
        <AlertCircle className="mr-2 inline" /> {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Manage Configuration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <AddStateForm />
        <AddVolunteerForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Existing States & Districts</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {states.map((state) => (
              <div
                key={state._id}
                className="mb-4 p-2 border-b last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold">{state.name}</h4>
                  {userIsAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteState(state._id, state.name)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
                <ul className="mt-2 list-disc list-inside pl-4 text-sm text-gray-600">
                  {state.districts.map((dist) => (
                    <li
                      key={dist._id}
                      className="flex justify-between items-center py-1"
                    >
                      <span>{dist.name}</span>
                      {userIsAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDeleteDistrict(state._id, dist._id, dist.name)
                          }
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Existing Volunteers</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <ul className="space-y-1">
              {volunteers.map((vol) => (
                <li
                  key={vol._id}
                  className="flex justify-between items-center text-sm p-2 border-b last:border-b-0"
                >
                  <span>
                    <span className="font-semibold">{vol.name}</span> -{" "}
                    <span className="text-gray-500">{vol.code}</span>
                  </span>
                  {userIsAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteVolunteer(vol._id, vol.name)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
