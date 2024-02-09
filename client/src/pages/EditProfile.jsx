import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [username, setUsername] = useState(currentUser?.username || "");
  const [img, setImg] = useState(currentUser?.img || "");
  const [userId, setUserId] = useState(currentUser?.id || "");
  const [isAdmin, setIsAdmin] = useState(currentUser?.isAdmin || false);
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // Initialize image preview state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/users", {
          withCredentials: true,
        });
        const userData = res.data;
        setUsername(userData.username || "");
        setImg(userData.img || "");
        setUserId(userData.id || "");
        setIsAdmin(userData.isAdmin || false);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleImgChange = (e) => {
    setImg(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create a preview of the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };
  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        "http://localhost:8800/api/upload",
        formData,
        {
          withCredentials: true,
        }
      );
      return res.data.imageUrl; // Assuming the response contains the image URL
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let uploadedImgUrl = img;
      let usernameUpdated = false;
      let imageUpdated = false;

      if (file) {
        uploadedImgUrl = await uploadImage();
        imageUpdated = true;
      }

      console.log("Save Changes button clicked!");
      console.log("User ID:", userId);

      // Check if username has been updated
      if (username !== currentUser.username) {
        usernameUpdated = true;
      }

      // Update 'img' state with the new uploaded image URL
      setImg(uploadedImgUrl); // Update the 'img' state with the new URL

      await axios.put(
        `http://localhost:8800/api/users/${userId}`,
        { username, img: uploadedImgUrl }, // Send the updated 'img' URL to the backend
        {
          withCredentials: true,
        }
      );

      const updatedUser = { ...currentUser, username, img: uploadedImgUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update the current user in context
      setCurrentUser(updatedUser);

      let successMsg = "Profile updated successfully!";
      if (usernameUpdated && !imageUpdated) {
        successMsg = "Username updated successfully!";
      } else if (!usernameUpdated && imageUpdated) {
        successMsg = "Profile image updated successfully!";
      }

      setSuccessMessage(successMsg);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" value={username} onChange={handleUsernameChange} />
        <label>Profile Image:</label>
        <input type="file" id="file" name="file" onChange={handleFileChange} />
        {imagePreview && (
          <div>
            <img src={imagePreview} alt="Preview" width="100" />
          </div>
        )}
        <button type="submit">Save Changes</button>
        {successMessage && <p>{successMessage}</p>}
      </form>
    </div>
  );
};

export default EditProfile;
