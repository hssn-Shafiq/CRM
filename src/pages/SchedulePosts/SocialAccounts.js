import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SocialAccounts = () => {
  return (
    <>
      <main>
        <div className="text-center">
          <h2 className="text-uppercase p-2 page-title">
            Link Social Accounts
          </h2>
        </div>
      </main>
      <ToastContainer />
    </>
  );
};

export default SocialAccounts;
