import React, { useState} from "react";
import { storage, db } from "../../firebase/Config";
import { ref, uploadBytesResumable, getDownloadURL } from "@firebase/storage";
import { collection, addDoc } from "@firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Button, Col, Row } from "antd";

const videoMetadataCollectionRef = collection(db, "visitorvideo");
const UserRole = () => {

  return (
    <main>

      <ToastContainer />
    </main>
  );
};

export default UserRole;
