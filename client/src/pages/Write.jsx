import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const Write = () => {
  const state = useLocation().state;

  const [value, setValue] = useState(state?.desc || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [prevImageName, setPrevImageName] = useState(""); // State for previous image name

  useEffect(() => {
    if (state?.img) {
      setImagePreview(
        `http://localhost:5173/dist/upload/${getImageName(state.img)}`
      );
      setPrevImageName(getImageName(state.img));
    }
  }, [state]);

  const navigate = useNavigate();

  const getImageName = (imageUrl) => {
    // Extract image name from the URL
    const urlParts = imageUrl.split("/");
    return decodeURIComponent(urlParts[urlParts.length - 1]); // Decoding the image name
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

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        "http://localhost:8800/api/upload",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.imageUrl; // Assuming the response contains the image URL
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      let imgUrl = state?.img || imagePreview;

      if (file) {
        imgUrl = await upload();
      }

      const postData = {
        title,
        desc: value,
        cat,
        img: imgUrl || imagePreview,
        date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      };

      const apiUrl = state
        ? `http://localhost:8800/api/posts/${state.id}`
        : `http://localhost:8800/api/posts/`;

      console.log("POST Data:", postData); // Log the data being sent

      const response = state
        ? await axios.put(apiUrl, postData, { withCredentials: true })
        : await axios.post(apiUrl, postData, { withCredentials: true });

      console.log("Post request response:", response.data);
      navigate("/");
    } catch (err) {
      console.error("Handle Click Error:", err);

      if (err.response) {
        console.log("Server Error Response:", err.response.data);
      }

      // Log the specific response status if available
      console.log("Response status:", err?.response?.status);
    }
  };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>

          <span>
            <b>Visibility: </b> Public
          </span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            name=""
            onChange={handleFileChange}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          {/* Display the selected image as preview */}
          {imagePreview && (
            <div>
              <img src={imagePreview} alt={prevImageName} width="100" />
            </div>
          )}

          <div className="button">
            <button>Save as a draft</button>
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "tech"}
              name="cat"
              value="tech"
              id="tech"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="tech">Tech</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "movies"}
              name="cat"
              value="movies"
              id="movies"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="movies">Movies</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "design"}
              name="cat"
              value="design"
              id="design"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="design">Design</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "food"}
              name="cat"
              value="food"
              id="food"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="food">Food</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
