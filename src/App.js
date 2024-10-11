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
import UserPermission from "./pages/UserManagement/UserPermission";
import UserRole from "./pages/UserManagement/UserRole";

import Posts from "./pages/SchedulePosts/Posts";
import CreatePosts from "./pages/SchedulePosts/CreatePosts";
import Calendar from "./pages/SchedulePosts/Calendar";
import SocialAccounts from "./pages/SchedulePosts/SocialAccounts";

import CustomLeadForm from "./pages/CustomLeadForm";
import ScheduleAppointments from "./pages/ScheduleAppointments";
import CheckBookedAppointments from "./pages/CheckBookedAppointments";
import ClientAppointments from "./pages/ClientAppointments";

import Settings from "./pages/Settings";

import OrderList from "./pages/ShopifyManagement/OrderList";
import DeliveredOrders from "./pages/ShopifyManagement/DeliveredOrders";
import RejectedOrders from "./pages/ShopifyManagement/RejectedOrders";
import OrderDetail from "./pages/ShopifyManagement/OrderDetail";
import { getUserFromLocalStorage } from "./utils/localstorage";

function App() {
  const user = getUserFromLocalStorage();
  const role = user?.role || "Guest";

  // Retrieve permissions from localStorage
  const permissions =
    JSON.parse(localStorage.getItem("routePermissions")) || {};

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/admin" element={<MainLayout />}>

          <Route index element={<Dashboard />} />

          <Route path="RegisteredUser" element={<RegisteredUser />} />
          <Route path="Users/User-List" element={<UserList />} />
          <Route path="Users/User-Permission" element={<UserPermission />} />
          <Route path="Users/User-Role" element={<UserRole />} />
          {/* <Route path="coupon/:id" element={<AddCoupon />} /> */}

          {/* social media routes */}
          <Route path="SchedulePosts/Create-Post" element={<CreatePosts />} />
          <Route path="SchedulePosts/Calendar" element={<Calendar />} />
          <Route
            path="SchedulePosts/SocialAccounts"
            element={<SocialAccounts />}
          />
          <Route path="SchedulePosts/Posts" element={<Posts />} />

          {/* Leads Management Routes */}
          <Route path="CustomLead/Data" element={<CustomLeadForm />} />
          <Route path="Book-Appointments" element={<ScheduleAppointments />} />
          <Route
            path="Check-Book-Appointments"
            element={<CheckBookedAppointments />}
          />
          <Route path="Client-Appointments" element={<ClientAppointments />} />

          {/* Shopify Management Routes */}
          <Route path="Shopify/OrderList" element={<OrderList />} />
          <Route path="Shopify/Order/:orderId" element={<OrderDetail />} />
          <Route
            path="Shopify/Delivered-Orders"
            element={<DeliveredOrders />}
          />
          <Route path="Shopify/Cancelled-Orders" element={<RejectedOrders />} />

          <Route path="Settings" element={<Settings />} />

          <Route path="Product-Approval" element={<DeliveredOrders />} />
          {/* <Route path="list-product" element={<Productlist />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
