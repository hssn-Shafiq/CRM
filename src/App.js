import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Signup";
import Resetpassword from "./pages/Resetpassword";
import Forgotpassword from "./pages/Forgotpassword";
import MainLayout from "./components/MainLayout";

import UserList from "./pages/UserManagement/UserList";
import RegisteredUser from "./pages/RegisteredUser";
// import UserPermission from "./pages/UserManagement/UserPermission";
// import UserRole from "./pages/UserManagement/UserRole";

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
import CustomerSegments from "./pages/CustomerSegments";
import Profile from "./pages/Profile";
// import EmailEditors from "./pages/EmailEditors";
import ForgotPassword from "./pages/ForgetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsCondition from "./pages/TermsCondition";
import TemplateEditor from "./pages/TemplateEditor";
import TemplatePreview from "./pages/TemplatePreview";
import LinkedInCallback from "./pages/LinkedInCallback";

function App() {
  const user = getUserFromLocalStorage();
  const role = user?.role || "Guest";
  const permissions =
    JSON.parse(localStorage.getItem("routePermissions")) || {};

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
          <Route index element={<Dashboard />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="RegisteredUser" element={<RegisteredUser />} />
          <Route path="Users/User-List" element={<UserList />} />
          {/* <Route path="Users/User-Permission"
                        element={< UserPermission />}
                    />
                    <Route path="Users/User-Role"
                        element={< UserRole />}
                    /> */}
          <Route path="SchedulePosts/Create-Post" element={<CreatePosts />} />
          <Route path="SchedulePosts/Calendar" element={<Calendar />} />
          <Route
            path="SchedulePosts/SocialAccounts"
            element={<SocialAccounts />}
          />
          <Route path="SchedulePosts/Posts" element={<Posts />} />
          <Route path="Contacts" element={<Contacts />} />
          <Route path="Emails" element={<Emails />} />{" "}
          <Route
            path="Check-Book-Appointments"
            element={<CheckBookedAppointments />}
          />
          <Route path="Templates" element={<Templates />} />
          <Route path="Shopify/OrderList" element={<OrderList />} />
          <Route path="Shopify/Order/:orderId" element={<OrderDetail />} />
          <Route
            path="Shopify/Delivered-Orders"
            element={<DeliveredOrders />}
          />
          <Route path="Shopify/Cancelled-Orders" element={<RejectedOrders />} />
          <Route path="Settings" element={<Settings />} />
          <Route path="Product-Approval" element={<DeliveredOrders />} />
          <Route path="CustomerSegments" element={<CustomerSegments />} />
          <Route path="template-editor" element={<TemplateEditor />} />
          <Route
            path="/admin/template-editor/:id"
            element={<TemplateEditor />}
          />
          <Route
            path="/admin/template-preview/:id"
            element={<TemplatePreview />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
