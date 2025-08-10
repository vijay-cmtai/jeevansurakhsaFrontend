"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  reportPublicClaim,
  fetchPublicClaims,
  Claim,
} from "@/lib/redux/features/claims/claimsSlice";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { Loader2 } from "lucide-react";

// The data structure the form will handle
type FormData = {
  email: string;
  dateOfDeath: string;
  nomineeDetails: { name: string; accountNumber: string };
  deceasedMemberPhoto: FileList;
  deathCertificate: FileList;
};

// --- Reusable Component to Display the List of Active Claims ---
const ActiveClaimsList = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const { claims, listStatus } = useSelector(
    (state: RootState) => state.claims
  );

  useEffect(() => {
    dispatch(fetchPublicClaims());
  }, [dispatch]);

  if (listStatus === "loading") {
    return (
      <div className="text-center p-10">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (listStatus === "failed" || !claims || claims.length === 0) {
    return (
      <div className="text-center p-10 text-gray-600">
        {t("reportClaim.activeClaims.noClaims")}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {claims.map((claim) => (
        <div
          key={claim._id}
          className="bg-white p-6 rounded-lg shadow-md grid md:grid-cols-5 gap-4 items-center"
        >
          <div className="md:col-span-1 text-center">
            <Image
              src={
                claim.deceasedMemberPhotoUrl ||
                claim.deceasedMember.profileImageUrl ||
                "/default-avatar.png"
              }
              alt={claim.deceasedMember.fullName}
              width={80}
              height={80}
              className="rounded-full mx-auto object-cover border-2 border-gray-200"
            />
            <h4 className="font-bold mt-2 text-gray-800">
              {claim.deceasedMember.fullName}
            </h4>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-semibold text-gray-800">
              {t("reportClaim.activeClaims.nominee")}
            </h4>
            <p>
              <strong>{t("donateUs.label.name")}:</strong>{" "}
              {claim.nomineeDetails.name}
            </p>
          </div>
          <div className="md:col-span-1">
            <h4 className="font-semibold text-gray-800">
              {t("reportClaim.activeClaims.plan")}
            </h4>
            <p>{claim.contributionPlan}</p>
          </div>
          <div className="md:col-span-1 text-center md:text-right">
            <h4 className="font-semibold text-gray-800">
              {t("reportClaim.activeClaims.amount")}
            </h4>
            <p className="text-xl font-bold text-green-700">
              ₹{claim.contributionAmountRequired.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- The Main Page Component ---
export default function ReportClaimPage() {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const { actionStatus } = useSelector((state: RootState) => state.claims);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    const { deceasedMemberPhoto, deathCertificate, ...claimDetails } = data;

    formData.append("claimData", JSON.stringify(claimDetails));

    if (deceasedMemberPhoto?.[0])
      formData.append("deceasedMemberPhoto", deceasedMemberPhoto[0]);
    if (deathCertificate?.[0])
      formData.append("deathCertificate", deathCertificate[0]);

    dispatch(reportPublicClaim(formData)).then((result) => {
      if (reportPublicClaim.fulfilled.match(result)) {
        alert(result.payload || t("reportClaim.form.success"));
        reset();
      } else {
        alert(`Error: ${result.payload}`);
      }
    });
  };

  const heroBackgroundImage =
    "https://jeevan.atlix.in/wp-content/uploads/2025/03/10.jpg";

  return (
    <div>
      <section
        className="relative bg-cover bg-center py-24"
        style={{ backgroundImage: `url(${heroBackgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold">
            {t("reportClaim.hero.title")}
          </h1>
        </div>
      </section>

      <section className="bg-slate-100 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t("reportClaim.form.title")}
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-gray-600">
              {t("reportClaim.form.subtitle")}
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-white p-8 rounded-lg shadow-lg"
          >
            <div>
              <label className="block font-medium mb-1">
                Deceased Member's Email ID
              </label>
              <input
                type="email"
                placeholder="Enter member's registered email address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                className="w-full px-4 py-3 border rounded-md"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">
                Deceased Member's Photo
              </label>
              <input
                type="file"
                {...register("deceasedMemberPhoto")}
                accept="image/*"
                className="w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Date of Death</label>
              <input
                type="date"
                {...register("dateOfDeath", {
                  required: "Date of death is required",
                })}
                className="w-full px-4 py-3 border rounded-md"
              />
              {errors.dateOfDeath && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dateOfDeath.message}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">
                Death Certificate (PDF/Image)
              </label>
              <input
                type="file"
                {...register("deathCertificate")}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full"
              />
            </div>

            <h3 className="text-xl font-semibold pt-4 border-t">
              {t("reportClaim.form.heading.nominee")}
            </h3>

            <div>
              <label className="block font-medium mb-1">
                {t("reportClaim.form.label.nomineeName")}
              </label>
              <input
                type="text"
                {...register("nomineeDetails.name", {
                  required: "Nominee name is required",
                })}
                className="w-full px-4 py-3 border rounded-md"
              />
              {errors.nomineeDetails?.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nomineeDetails.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">
                {t("reportClaim.form.label.nomineeAccount")}
              </label>
              <input
                type="text"
                {...register("nomineeDetails.accountNumber", {
                  required: "Account number is required",
                })}
                className="w-full px-4 py-3 border rounded-md"
              />
              {errors.nomineeDetails?.accountNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nomineeDetails.accountNumber.message}
                </p>
              )}
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={actionStatus === "loading"}
                className="bg-orange-600 text-white font-semibold px-8 py-3 rounded-md hover:bg-orange-700 disabled:bg-orange-400"
              >
                {actionStatus === "loading"
                  ? t("reportClaim.form.button.submitting")
                  : t("reportClaim.form.button.submit")}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t("reportClaim.activeClaims.title")}
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-gray-600">
              {t("reportClaim.activeClaims.subtitle")}
            </p>
          </div>
          <ActiveClaimsList />
        </div>
      </section>
    </div>
  );
}
