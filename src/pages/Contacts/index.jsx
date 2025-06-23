import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import "./Contacts.css";
import { Link } from "react-router-dom";
import CustomerData from "../../components/CustomersData";



const Contacts = () => {


  return (
    <>

      <main className=" mb-5  parent-lead-data-form" id="custom_lead_top_bar">
        <div className="text-center">
          <h2 className="text-uppercase p-2 page-title">Leads Management </h2>
        </div>

        <CustomerData />
      </main>
    </>
  );
};

export default Contacts;
