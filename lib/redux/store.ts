// File: lib/redux/store.js

import { configureStore } from "@reduxjs/toolkit";

import registrationReducer from "./features/registration/registrationSlice";
import authReducer from "./features/auth/authSlice";
import membersReducer from "./features/members/membersSlice";
import memberCertificatesReducer from "./features/memberCertificates/memberCertificatesSlice";
import noticesReducer from "./features/notices/noticesSlice";
import usersReducer from "./features/users/usersSlice"; // Sahi path dein
import cashDonationsReducer from "./features/donations/cashDonationsSlice";
import visitorCertificatesReducer from "./features/certificates/visitorCertificatesSlice";
import receiptsReducer from "./features/receipts/receiptsSlice";
import contributionPlansReducer from "./features/contributionPlans/contributionPlansSlice";
import employmentConfigReducer from "./features/employmentConfig/employmentConfigSlice";
import reportReducer from "./features/reports/reportSlice";
import visitorDonationReducer from "./features/visitordonations/visitorDonationSlice";
import paymentStatusReducer from "./features/paymentStatus/paymentStatusSlice";
import memberPaymentReducer from "./features/payments/memberPaymentSlice";
import dashboardReducer from "./features/dashboard/dashboardSlice";
import memberDonationReducer from "./features/payment/memberDonationSlice";
import configReducer from "./features/config/configSlice";

import claimsReducer from "./features/claims/claimsSlice";

export const store = configureStore({
  reducer: {
    registration: registrationReducer,
    auth: authReducer,
    members: membersReducer,
    memberCertificates: memberCertificatesReducer,
    notices: noticesReducer,
    users: usersReducer,
    cashDonations: cashDonationsReducer,
    visitorCertificates: visitorCertificatesReducer,
    receipts: receiptsReducer,
    contributionPlans: contributionPlansReducer,
    employmentConfig: employmentConfigReducer,
    reports: reportReducer,
    visitorDonation: visitorDonationReducer,
    paymentStatus: paymentStatusReducer,
    memberPayment: memberPaymentReducer,
    dashboard: dashboardReducer,
    memberDonation: memberDonationReducer,
    config: configReducer,

    // --- 🚨 STEP 2: ADD THE NEW REDUCER 🚨 ---
    claims: claimsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
