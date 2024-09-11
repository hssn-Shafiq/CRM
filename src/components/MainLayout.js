import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  AiOutlineDashboard,
  AiOutlineSetting,
  AiOutlineShoppingCart,
  AiOutlineUserSwitch,
} from "react-icons/ai";
import {
  FaCalendar,
  FaCopy,
  FaFacebook,
  FaGoogle,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaPlus,
  FaTiktok,
  FaTwitter,
  FaUpload,
  FaUser,
  FaUserLock,
  FaUsers,
} from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { FcDataConfiguration } from "react-icons/fc";
import { IoIosNotifications } from "react-icons/io";
import { FaDatabase, FaHandsHelping, FaPlusCircle, FaRegBookmark } from "react-icons/fa";
import { BiCalendarCheck, BiCategoryAlt, BiCustomize, BiUser } from "react-icons/bi";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { BsCardList, BsDatabaseSlash, BsFileSpreadsheet } from "react-icons/bs";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { getUserFromLocalStorage } from "../utils/localstorage";
import { getAuth } from "firebase/auth";
const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const [userData, setUserData] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const user = getUserFromLocalStorage();
    setUserData(user);
  }, []);

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("user");
    toast.success("you are logged out");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleMenuClick = ({ key }) => {
    if (key === "signout") {
      auth.signOut();
      return;
    }

    if (key !== "") {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        // User is not logged in, redirect to login page
        toast.error("Please login to continue");

        setTimeout(() => {
          navigate("/");
        }, 1000);
        return;
      }
    }

    // Navigate to the selected page
    navigate(key);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout /* onContextMenu={(e) => e.preventDefault()} */>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo d-flex align-items-center justify-content-center">
          <h2 className="text-white fs-5 text-center py-2 mb-0 ">
            <span className="sm-logo">
              <img src="/images/logo-bg.png" width={80} />
            </span>
            <span className="lg-logo">
              {" "}
              <img src="/images/logo-bg.png" width={150} />
            </span>
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[""]}
          onClick={handleMenuClick}
          items={[
            {
              key: "",
              icon: <AiOutlineDashboard className="fs-4" />,
              label: "Dashboard",
            },

            {
              key: "Manage Users",
              icon: <FaUser className="fs-4" />,
              label: "Manage Users",
              children: [
                {
                  key: "User-List",
                  icon: <BsCardList className="fs-4" />,
                  label: "All Users",
                },
                // {
                //   key: "VisitorProfile/UploadVisitorCheels",
                //   icon: <AiOutlineShoppingCart className="fs-4" />,
                //   label: "Add Cheels",
                // },
                {
                  key: "AccessPermissions/UserRole",
                  icon: <AiOutlineUserSwitch className="fs-4" />,
                  label: "User Role",
                },
                {
                  key: "AccessPermissions/UserPermission",
                  icon: <FaUserLock className="fs-4" />,
                  label: "User Permission",
                },
                // {
                //   key: "Add-Designer",
                //   icon: <FaPenSquare className="fs-4" />,
                //   label: "Add Designer",
                // },

                {
                  key: "User-Details",
                  icon: <BiCategoryAlt className="fs-4" />,
                  label: "User Details",
                },

                // {
                //   key: "Product-Type",
                //   icon: <BsCardList className="fs-4" />,
                //   label: "Product Type",
                // },
                // {
                //   key: "Add-Edits",
                //   icon: <BiEdit className="fs-4" />,
                //   label: "Add Edits",
                // },
              ],
            },
            // {
            //   key: "orders",
            //   icon: <FcDataConfiguration className="fs-4" />,
            //   label: "Orders",
            // },
            {
              key: "Admin For Mobile",
              icon: <FaCopy className="fs-4" />,
              label: "Schedule Posts",
              children: [
                {
                  key: "SchedulePosts/Create-Post",
                  icon: <FaPlusCircle className="fs-4" />,
                  label: "Create Post",
                },
                {
                  key: "SchedulePosts/Calendar",
                  icon: <FaCalendar className="fs-4" />,
                  label: "Calendar",
                },
                {
                  key: "SchedulePosts/Posts",
                  icon: <FaCopy className="fs-4" />,
                  label: "Posts",
                },
                {
                  key: "SchedulePosts/SocialAccounts",
                  icon: <FaUsers className="fs-4" />,
                  label: "Social Accounts",
                },
              ],
            },
            {
              key: "Track Leads",
              icon: <FaDatabase className="fs-4" />,
              label: "Track Leads",
              children: [
                {
                  key: "CustomLead/Data",
                  icon: <BsDatabaseSlash className="fs-4" />,
                  label: "Custom Leads",
                },
                {
                  key: "Book-Appointments",
                  icon: <FaHandsHelping className="fs-4" />,
                  label: "Book Appointments",
                },
              ],
            },
            {
              key: "Check-Book-Appointments",
              icon: <BiCalendarCheck className="fs-4" />,
              label: "Check Appointments",
            },
            {
              key: "customization",
              icon: <BiCustomize className="fs-4" />,
              label: "Customization",
            },
            {
              key: "Configration",
              icon: <FcDataConfiguration className="fs-4" />,
              label: "Configration",
            },
            {
              key: "settings",
              icon: <AiOutlineSetting className="fs-4" />,
              label: "Settings",
            },
            // {
            //   key: "Product-Approval",
            //   icon: <BiCheckSquare className="fs-4" />,
            //   label: "Product Approval",
            // },
            {
              key: "RegisteredUser",
              icon: <BiUser className="fs-4" />,
              label: "Registered User",
            },
          ]}
        />
        <div className="mt-5 bg-dark p-3 text-light social_login">
          {/* <h5 className="w-100 fs-5 bg-light text-dark rounded-4 p-2"><BiUser className="fs-4" /> Hassan</h5> */}
          <h5 className="w-100 fs-5 mb-0">Linked Accounts</h5>
          <div className="linked-accounts my-2 d-flex gap-1">
            <span
              className="account bg-light rounded-circle p-1 d-flex align-items-center justify-content-center text-dark"
              style={{ width: "20px", height: "20px" }}
            >
              <FaFacebook />{" "}
            </span>
            <span
              className="account bg-light rounded-circle p-1 d-flex align-items-center justify-content-center text-dark"
              style={{ width: "20px", height: "20px" }}
            >
              <FaInstagram />{" "}
            </span>
            <span
              className="account bg-light rounded-circle p-1 d-flex align-items-center justify-content-center text-dark"
              style={{ width: "20px", height: "20px" }}
            >
              <FaLinkedin />{" "}
            </span>
            <span
              className="account bg-light rounded-circle p-1 d-flex align-items-center justify-content-center text-dark"
              style={{ width: "20px", height: "20px" }}
            >
              <FaTwitter />{" "}
            </span>
            <span
              className="account bg-light rounded-circle p-1 d-flex align-items-center justify-content-center text-dark"
              style={{ width: "20px", height: "20px" }}
            >
              <FaPinterest />{" "}
            </span>{" "}
            <span
              className="account bg-light rounded-circle p-1 d-flex align-items-center justify-content-center text-dark"
              style={{ width: "20px", height: "20px" }}
            >
              <FaGoogle />{" "}
            </span>
            <span
              className="account bg-light rounded-circle p-1 d-flex align-items-center justify-content-center text-dark"
              style={{ width: "20px", height: "20px" }}
            >
              <FaTiktok />{" "}
            </span>
          </div>

          <Link to="SchedulePosts/SocialAccounts">
            <button className="btn btn-primary btn-sm fw-medium w-100 d-flex align-items-center justify-content-center gap-2">
              <FaPlusCircle /> Add Social Account
            </button>
          </Link>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="sticky-top d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: "#1d1e22",
            color: "#fff",
            borderBottom: "2px solid hsla(225, 6%, 26%, 1)",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="d-flex gap-4 align-items-center">
            <div className="position-relative">
              <IoIosNotifications className="fs-4" />
              <span className="badge bg-warning rounded-circle p-1 position-absolute">
                3
              </span>
            </div>

            <div className="d-flex gap-3 align-items-center dropdown">
              <div>
                <img
                  width={45}
                  height={45}
                  src="/images/logo-bg.png"
                  className="object-fit-contain"
                  alt=""
                />
              </div>
              {userData ? (
                <>
                  <div
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <h5 className="mb-0">Admin</h5>
                    <p className="mb-0">{userData.email}</p>
                  </div>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <li>
                      <Link
                        className="dropdown-item py-1 mb-1"
                        style={{ height: "auto", lineHeight: "20px" }}
                      >
                        View Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item py-1 mb-1"
                        style={{ height: "auto", lineHeight: "20px" }}
                        onClick={handleLogout}
                      >
                        Signout
                      </Link>
                    </li>
                  </div>
                </>
              ) : (
                <div className="">
                  <Link to="/" className="nav-link">
                    <b>Login</b>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Header>
        <Content
          style={{
            background: "rgb(25 25 25)",
            color: "#fff",
          }}
        >
          <ToastContainer
            position="top-right"
            autoClose={250}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
