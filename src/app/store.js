import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/cutomers/customerSlice";
import enquiryReducer from "../features/enquiry/enquirySlice";
import uploadReducer from "../features/upload/uploadSlice";
import invoiceReducer from "../features/invoice/invoiceSlice";
import automationReducer from "../features/invoice/automationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    enquiry: enquiryReducer,
    upload: uploadReducer,
    invoice: invoiceReducer,
    automation: automationReducer,
  },
});
