import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Signup";
import Resetpassword from "./pages/Resetpassword";
import Forgotpassword from "./pages/Forgotpassword";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import UserList from "./pages/UserManagement/UserList";
import RegisteredUser from "./pages/RegisteredUser";

import Contacts from "./pages/Contacts";
import Posts from "./pages/SchedulePosts/Posts";
import CreatePosts from "./pages/SchedulePosts/CreatePosts";
import Calendar from "./pages/SchedulePosts/Calendar";
import SocialAccounts from "./pages/SchedulePosts/SocialAccounts";

import Emails from "./pages/Emails";
import CheckBookedAppointments from "./pages/CheckBookedAppointments";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";

import OrderList from "./pages/ShopifyManagement/OrderList";
import DeliveredOrders from "./pages/ShopifyManagement/DeliveredOrders";
import RejectedOrders from "./pages/ShopifyManagement/RejectedOrders";
import OrderDetail from "./pages/ShopifyManagement/OrderDetail";
import { getUserFromLocalStorage } from "./utils/localstorage";
import { fetchAndStoreRolePermissions } from "./utils/permissions";
import CustomerSegments from "./pages/CustomerSegments";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsCondition from "./pages/TermsCondition";
import TemplateEditor from "./pages/TemplateEditor";
import TemplatePreview from "./pages/TemplatePreview";
import LinkedInCallback from "./pages/LinkedInCallback";
import { useEffect } from "react";

function App() {
  // Fetch and store role permissions when the app loads
  useEffect(() => {
    const initializePermissions = async () => {
      await fetchAndStoreRolePermissions();
    };

    initializePermissions();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="ForgotPassword" element={<ForgotPassword />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsCondition />} />
        <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />

        <Route path="/admin" element={<MainLayout />}>
          {/* Dashboard is accessible to all logged-in users */}
          <Route
            index
            element={
              <ProtectedRoute requiredRoute="Dashboard">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="Profile" element={<Profile />} />

          {/* User Management Routes */}
          <Route
            path="RegisteredUser"
            element={
              <ProtectedRoute requiredRoute="RegisteredUser">
                <RegisteredUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="Users/User-List"
            element={
              <ProtectedRoute requiredRoute="Users/User-List">
                <UserList />
              </ProtectedRoute>
            }
          />

          {/* Schedule Posts Routes */}
          <Route
            path="SchedulePosts/Create-Post"
            element={
              <ProtectedRoute requiredRoute="SchedulePosts/Create-Post">
                <CreatePosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="SchedulePosts/Calendar"
            element={
              <ProtectedRoute requiredRoute="SchedulePosts/Calendar">
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="SchedulePosts/SocialAccounts"
            element={
              <ProtectedRoute requiredRoute="SchedulePosts/SocialAccounts">
                <SocialAccounts />
              </ProtectedRoute>
            }
          />
          <Route
            path="SchedulePosts/Posts"
            element={
              <ProtectedRoute requiredRoute="SchedulePosts/Posts">
                <Posts />
              </ProtectedRoute>
            }
          />

          {/* Marketing Routes */}
          <Route
            path="Contacts"
            element={
              <ProtectedRoute requiredRoute="Contacts">
                <Contacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="Emails"
            element={
              <ProtectedRoute requiredRoute="Emails">
                <Emails />
              </ProtectedRoute>
            }
          />
          <Route
            path="Check-Book-Appointments"
            element={
              <ProtectedRoute requiredRoute="Check-Book-Appointments">
                <CheckBookedAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="Templates"
            element={
              <ProtectedRoute requiredRoute="Templates">
                <Templates />
              </ProtectedRoute>
            }
          />

          {/* Shopify Routes */}
          <Route
            path="Shopify/OrderList"
            element={
              <ProtectedRoute requiredRoute="Shopify/OrderList">
                <OrderList />
              </ProtectedRoute>
            }
          />
          <Route
            path="Shopify/Order/:orderId"
            element={
              <ProtectedRoute requiredRoute="Shopify/OrderList">
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="Shopify/Delivered-Orders"
            element={
              <ProtectedRoute requiredRoute="Shopify/Delivered-Orders">
                <DeliveredOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="Shopify/Cancelled-Orders"
            element={
              <ProtectedRoute requiredRoute="Shopify/Cancelled-Orders">
                <RejectedOrders />
              </ProtectedRoute>
            }
          />

          {/* Settings and Other Routes */}
          <Route
            path="Settings"
            element={
              <ProtectedRoute requiredRoute="Settings">
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="Product-Approval"
            element={
              <ProtectedRoute requiredRoute="Product-Approval">
                <DeliveredOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="CustomerSegments"
            element={
              <ProtectedRoute requiredRoute="CustomerSegments">
                <CustomerSegments />
              </ProtectedRoute>
            }
          />
          <Route
            path="template-editor"
            element={
              <ProtectedRoute requiredRoute="Templates">
                <TemplateEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="template-editor/:id"
            element={
              <ProtectedRoute requiredRoute="Templates">
                <TemplateEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="template-preview/:id"
            element={
              <ProtectedRoute requiredRoute="Templates">
                <TemplatePreview />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch all undefined routes and redirect to dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
