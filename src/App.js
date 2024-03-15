import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Resetpassword from "./pages/Resetpassword";
import Forgotpassword from "./pages/Forgotpassword";
import MainLayout from "./components/MainLayout";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Productlist from "./pages/Productlist";
import Addcolor from "./pages/Producttype";
import Addcat from "./pages/Addcat";
import Addbrand from "./pages/AddDesigner";
import Addproduct from "./pages/Addproduct";
import AddCoupon from "./pages/AddCollections";
import ViewEnq from "./pages/ViewEnq";
import ViewOrder from "./pages/ViewOrder";
import Deleteproduct from "./pages/Deleteproduct";
import ProductType from "./pages/Producttype";
import AddEdits from "./pages/AddEdits";
import AddCollections from "./pages/AddCollections";
import RegisteredUser from "./pages/RegisteredUser";
import Lender from "./pages/Lender";
import Render from "./pages/Render";
import ProductApproval from "./pages/ProductApproval";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="RegisteredUser" element={<RegisteredUser />} />
          <Route path="enquiries/:id" element={<ViewEnq />} />
          <Route path="Render" element={<Render />} />
          <Route path="Add-Collections" element={<AddCollections />} />
          <Route path="coupon/:id" element={<AddCoupon />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order/:id" element={<ViewOrder />} />
          <Route path="customers" element={<Customers />} />
          <Route path="Add-Edits" element={<AddEdits />} />
          <Route path="Product-Type" element={<ProductType />} />
          <Route path="color/:id" element={<Addcolor />} />
          <Route path="Product-Approval" element={<ProductApproval />} />
          <Route path="category" element={<Addcat />} />
          <Route path="category/:id" element={<Addcat />} />
          <Route path="Lender" element={<Lender />} />
          <Route path="add-designer" element={<Addbrand />} />
          <Route path="brand/:id" element={<Addbrand />} />
          <Route path="list-product" element={<Productlist />} />
          <Route path="product" element={<Addproduct />} />
          <Route path="delete-product" element={<Deleteproduct />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
