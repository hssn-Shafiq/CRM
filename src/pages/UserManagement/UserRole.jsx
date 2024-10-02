import { React, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserRole = () => {
  return (
    <>
      <main>
        <div className="container-fluid px-3 pt-4">
          <div className="text-center  ">
            <h2 className="text-uppercase p-2 page-title">Manage All Users Role</h2>
          </div>
        </div>
      </main>
      <ToastContainer />
    </>
  );
};

export default UserRole;
