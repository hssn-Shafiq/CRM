import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Resetpassword from "./pages/Resetpassword";
import Forgotpassword from "./pages/Forgotpassword";
import MainLayout from "./components/MainLayout";
import Productlist from "./pages/Productlist";
import Addcolor from "./pages/UserList";
import Addcat from "./pages/UserDetails";
import Posts from "./pages/SchedulePosts/Posts";
// import AddCoupon from "./pages/ManageMobileData";
import ViewEnq from "./pages/ViewEnq";
import ViewOrder from "./pages/ViewOrder";
import AddEdits from "./pages/AddEdits";
import RegisteredUser from "./pages/RegisteredUser";
import ProductApproval from "./pages/ProductApproval";
import UploadVisitorCheels from "./pages/AccessPermissions/UploadVisitorCheels";
import UploadVisitorGallery from "./pages/AccessPermissions/UserPermission";
import Register from "./pages/Signup";
import Settings from "./pages/Settings";
import UserList from "./pages/UserList";
import UserDetails from "./pages/UserDetails";
import UserPermission from "./pages/AccessPermissions/UserPermission";
import UserRole from "./pages/AccessPermissions/UserRole";
import Customization from "./pages/Customization";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CreatePosts from "./pages/SchedulePosts/CreatePosts";
import Calendar from "./pages/SchedulePosts/Calendar";
import SocialAccounts from "./pages/SchedulePosts/SocialAccounts";
import CustomLeadForm from "./pages/CustomLeadForm";
import ScheduleAppointments from "./pages/ScheduleAppointments";
import CheckBookedAppointments from "./pages/CheckBookedAppointments";
import ClientAppointments from "./pages/ClientAppointments";
import TermCondition from "./pages/TermConditions";

function App() {
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
          <Route path="enquiries/:id" element={<ViewEnq />} />
          <Route path="Privacy-Policy" element={<PrivacyPolicy />} />
          <Route path="Terms-and-Condition" element={<TermCondition />} />
          {/* <Route path="coupon/:id" element={<AddCoupon />} /> */}
          
          <Route path="SchedulePosts/Create-Post" element={<CreatePosts />} />
          <Route path="SchedulePosts/Calendar" element={<Calendar />} />
          <Route path="SchedulePosts/SocialAccounts" element={<SocialAccounts />} />
          <Route path="SchedulePosts/Posts" element={<Posts />} />
          
          {/* Leads & Appointment Booking */}
          <Route path="CustomLead/Data" element={<CustomLeadForm />} />
          <Route path="Book-Appointments" element={<ScheduleAppointments />} />
          <Route path="Check-Book-Appointments" element={<CheckBookedAppointments />} />
          <Route path="Client-Appointments" element={<ClientAppointments />} />


          <Route path="order/:id" element={<ViewOrder />} />
          <Route path="Settings" element={<Settings />} />
          <Route path="Add-Edits" element={<AddEdits />} />
          <Route path="User-List" element={<UserList />} />
          <Route path="color/:id" element={<Addcolor />} />
          <Route path="Product-Approval" element={<ProductApproval />} />
          <Route path="category" element={<Addcat />} />
          <Route path="User-Details" element={<UserDetails />} />
          <Route path="Customization" element={<Customization />} />
          <Route path="list-product" element={<Productlist />} />
          <Route path="AccessPermissions/UserPermission" element={<UserPermission />} />
          <Route path="AccessPermissions/UserRole" element={<UserRole />} />
          <Route path="AccessPermissions/UploadVisitorCheels" element={<UploadVisitorCheels />} />
          <Route path="AccessPermissions/UploadVisitorCheels" element={<UploadVisitorGallery />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
