import React, { useEffect, useState } from "react";
import {
  DeliveredProcedureOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  AiOutlineDashboard,
  AiOutlineSetting,
  AiOutlineUserSwitch,
} from "react-icons/ai";
import { IoIosNotifications } from "react-icons/io";
import { BsCardList, BsDatabaseSlash } from "react-icons/bs";
import {
  FaFirstOrder,
  FaMailBulk,
  FaPlusCircle,
  FaCalendar,
  FaCopy,
  FaLayerGroup,
  FaShopify,
  FaUser,
  FaUserLock,
  FaUsers,
  FaTrash,
  FaUserFriends,
  FaFileInvoiceDollar,
  FaRobot,
  FaPalette,
  FaEye,
  FaEdit,
  FaChartLine,
} from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { Layout, Menu, theme } from "antd";
import { getAuth } from "firebase/auth";
import { getUserFromLocalStorage } from "../utils/localstorage";
import {
  fetchAndStoreRolePermissions,
  getFilteredMenuItems,
} from "../utils/permissions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const [userData, setUserData] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const user = getUserFromLocalStorage();
    setUserData(user);

    // Refresh role permissions when component mounts
    const refreshPermissions = async () => {
      await fetchAndStoreRolePermissions();
      generateMenuItems(user);
    };

    refreshPermissions();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("user");
    localStorage.removeItem("rolePermissions");
    toast.success("You are logged out");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleMenuClick = ({ key }) => {
    if (key === "signout") {
      handleLogout();
      return;
    }

    if (key !== "") {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login to continue");

        setTimeout(() => {
          navigate("/");
        }, 1000);
        return;
      }
    }
    navigate(key);
  };

  const generateMenuItems = (user) => {
    const defaultMenuItems = [
      {
        key: "",
        icon: <AiOutlineDashboard className="fs-4" />,
        label: "Dashboard",
      },
      {
        key: "Users",
        icon: <FaUser className="fs-4" />,
        label: "Manage Users",
        children: [
          {
            key: "Users/User-List",
            icon: <AiOutlineUserSwitch className="fs-4" />,
            label: "Users Role Management",
          },
        ],
      },
      {
        key: "SchedulePosts",
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
        key: "Marketing",
        icon: <FaUsers className="fs-4" />,
        label: "Marketing",
        children: [
          {
            key: "Contacts",
            icon: <BsDatabaseSlash className="fs-4" />,
            label: "Contacts",
          },
          
          {
            key: "Emails",
            icon: <FaMailBulk className="fs-4" />,
            label: "Emails",
          },
          {
            key: "Templates",
            icon: <FaLayerGroup className="fs-4" />,
            label: "Templates",
          },
          {
            key: "CustomerSegments",
            icon: <FaUserFriends className="fs-4" />,
            label: "Segments",
          },
        ],
      },
      {
        key: "Invoicing",
        icon: <FaFileInvoiceDollar className="fs-4" />,
        label: "Invoicing System",
        children: [
          {
            key: "Invoicing/Dashboard",
            icon: <FaChartLine className="fs-4" />,
            label: "Dashboard",
          },
          {
            key: "Invoicing/List",
            icon: <FaEye className="fs-4" />,
            label: "Invoice List",
          },
          {
            key: "Invoicing/Create",
            icon: <FaPlusCircle className="fs-4" />,
            label: "Create Invoice",
          },
          {
            key: "Invoicing/Templates",
            icon: <FaPalette className="fs-4" />,
            label: "Templates",
          },
          {
            key: "Invoicing/Automation",
            icon: <FaRobot className="fs-4" />,
            label: "Automation Rules",
          },
        ],
      },
      {
        key: "Shopify",
        icon: <FaShopify className="fs-4" />,
        label: "Shopify Store",
        children: [
          {
            key: "Shopify/OrderList",
            icon: <FaFirstOrder className="fs-4" />,
            label: "Orders",
          },
          {
            key: "Shopify/Delivered-Orders",
            icon: <DeliveredProcedureOutlined className="fs-4" />,
            label: "Delivered Orders",
          },
         
           {
            key: "Shopify/Cancelled-Orders",
            icon: <FaTrash className="fs-4" />,
            label: "Cancelled Orders",
          },
        ],
      },
      {
        key: "Settings",
        icon: <AiOutlineSetting className="fs-4" />,
        label: "Settings",
      },
      {
        key: "RegisteredUser",
        icon: <BiUser className="fs-4" />,
        label: "Registered User",
      },
    ];

    // If user doesn't exist yet, just show the default menu
    if (!user) {
      setMenuItems(defaultMenuItems);
      return;
    }

    // Filter menu items based on user role
    const userRole = user.Role || "User";
    const filteredItems = getFilteredMenuItems(defaultMenuItems, userRole);
    setMenuItems(filteredItems);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo d-flex align-items-center justify-content-center">
            <h2 className="text-white fs-5 text-center py-2 mb-0 ">
              <span className="sm-logo">
                <img src="/images/af1-short.png" alt="crm-logo" width={80} />
              </span>
              <span className="lg-logo">
                {" "}
                <img src="/images/af1-white.png" alt="crm-logo" width={140} />
              </span>
            </h2>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            className="bg-main"
            defaultSelectedKeys={[""]}
            onClick={handleMenuClick}
            items={menuItems}
          />
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
                    src={
                      userData
                        ? userData.profileImageUrl
                        : "/images/af1-short.png"
                    }
                    className="object-fit-cover rounded-circle border-main border-2 border-secondary"
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
                      <h5 className="mb-0">{userData.userName || "Admin"}</h5>
                      <p className="mb-0">{userData.userEmail}</p>
                    </div>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuLink"
                    >
                      <li>
                        <Link
                          className="dropdown-item py-1 mb-1"
                          style={{ height: "auto", lineHeight: "20px" }}
                          to="/admin/Profile"
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
                      <li>
                        <Link
                          className="dropdown-item py-1 mb-1"
                          style={{ height: "auto", lineHeight: "20px" }}
                          to="/forgotpassword"
                        >
                          Change Password
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
            {/* <DebugPermissions /> */}
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
export default MainLayout;
