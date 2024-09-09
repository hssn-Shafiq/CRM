import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteACoupon, getAllCoupon } from "../features/coupon/couponSlice";
import CustomModal from "../components/CustomModal";
import { Container } from "react-bootstrap";



const Configration = () => {
 
  return (
    <Container className="container-fluid px-3 pt-4">
      
    </Container>
  );
};

export default Configration;
