import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteABrand,
  getBrands,
  resetState,
} from "../features/brand/brandSlice";
import CustomModal from "../components/CustomModal";
import { Container } from "react-bootstrap";


const Customization = () => {

  return (
    <Container className="container-fluid px-3 pt-4">
      <div>
        <div className="text-center  ">
          <h2 className="text-uppercase p-2 page-title">Customization</h2>
        </div>
    </div>
    </Container>
  );
};

export default Customization;
