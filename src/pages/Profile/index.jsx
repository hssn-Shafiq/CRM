import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  query,
  where,
  getDocs,
  collection,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/Config";
import {
  getUserFromLocalStorage,
  storeUserToLocalStorage,
} from "../../utils/localstorage";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css"; // Import custom CSS file

function Profile() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null); // For storing selected image
  const [profileImageUrl, setProfileImageUrl] = useState(""); // For storing profile image URL
  const [newUserName, setNewUserName] = useState(""); // For updating userName
  const [imagePreview, setImagePreview] = useState(""); // Preview image before upload
const [loading, setLoading] = useState(false);
  // Fetch data from localStorage when component mounts
  useEffect(() => {
    const userData = getUserFromLocalStorage();
    if (userData) {
      console.log("User data from localStorage:", userData); // Debugging
      setUserName(userData.userName || "");
      setEmail(userData.email || "");
      setProfileImageUrl(userData.profileImageUrl || ""); // Load existing profile image if available
      console.log(
        "Profile image URL from localStorage:",
        userData.profileImageUrl
      ); // Debugging
    }
  }, []);

  // Handle profile image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file)); // Preview the image
    console.log("Selected profile image:", file); // Debugging
    console.log("Image preview URL:", URL.createObjectURL(file)); // Debugging
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
        setLoading(true);
      const userData = getUserFromLocalStorage();
      if (!userData) {
        toast.error("No user data found in local storage.");
        return;
      }

      // Update profile image in Firebase Storage
      let uploadedImageUrl = profileImageUrl;
      if (profileImage) {
        console.log("Uploading new image:", profileImage.name); // Debugging
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `profileImages/${userData.uid}/${profileImage.name}`
        );
        await uploadBytes(storageRef, profileImage);
        uploadedImageUrl = await getDownloadURL(storageRef); // Get the image URL
        console.log("Uploaded image URL:", uploadedImageUrl); // Debugging
      }

      // Query the Firestore to find the document with the matching uid
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("uid", "==", userData.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Get the first document found
        const userDocRef = userDoc.ref; // Reference to the document to update

        // Update Firestore user document
        await updateDoc(userDocRef, {
          userName: newUserName || userName, // Update userName if changed
          profileImageUrl: uploadedImageUrl, // Update profileImageUrl
        });

        // Update localStorage with new data
        storeUserToLocalStorage({
          ...userData,
          userName: newUserName || userName,
          profileImageUrl: uploadedImageUrl,
        });

        console.log(
          "Profile updated successfully in Firestore and localStorage."
        ); // Debugging
        toast.success("Profile updated successfully!");
      } else {
        toast.error("User document not found.");
      }
    } catch (error) {
      toast.error("Error updating profile: " + error.message);
      console.log("Error updating profile: " + error.message);
    } finally{
        setLoading(false);
        
    }
  };

  return (
    <>
      <main>
        <div className="container profile-container mt-5">
          <div className="text-center">
            <h2 className="text-uppercase mb-4 page-title">
              Profile Settings
            </h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="card d-flex flex-column flex-lg-row align-items-center align-items-lg-start  justify-content-between profile-card bg-main border-main shadow-lg p-4">
                <div className="col-lg-4 profile_sec">
                  <div className=" mb-4">
                    {/* Display current profile image */}
                    <img
                      src={
                        imagePreview ||
                        profileImageUrl ||
                        "/images/af1-white.png"
                      }
                      alt="Profile"
                      className="rounded-circle profile-image mb-3"
                      width="200"
                      height="200"
                    />
                  </div>
                </div>
                <div className="col-lg-8 content-sec">
                  <div className="mb-3">
                    <label htmlFor="userName" className="form-label text-light">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control profile-input"
                      id="userName"
                      value={newUserName || userName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Enter new username"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label text-light">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control profile-input"
                      id="email"
                      value={email}
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="profileImage"
                      className="form-label text-light"
                    >
                      Profile Image
                    </label>
                    <input
                      type="file"
                      className="form-control profile-input"
                      id="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  <button
                    className="btn btn-primary w-100 profile-btn"
                    onClick={handleProfileUpdate}
                    disabled={loading}
                  >
                    {loading ? "saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Profile;
