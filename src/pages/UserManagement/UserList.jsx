import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { Link } from "react-router-dom";
const UserList = () => {


  return (
    <>
      <div className="container-fluid px-3 pt-4">
        <div className="text-center  ">
          <h2 className="text-uppercase p-2 page-title">Manage All Users</h2>
        </div>
       
      </div>
    </>
  );
};

export default UserList;
