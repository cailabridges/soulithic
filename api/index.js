import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend domain
    credentials: true, // This is important for cookies
  })
);
app.use(cookieParser());
app.use(express.json());

// const path = require("path");
// const __dirname = path.dirname("");
// const buildPath = path.join(__dirname, "../client/dist");

// app.use(express.static(buildPath()));

// app.get("/*", function (req, res) {
//   res.sendFile(
//     path.join(__dirname, "../client/dist/index.html"),
//     function (err) {
//       if (err) {
//         res.status(500).send(err);
//       }
//     }
//   );
// });

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/dist/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

// Express route to handle image upload
app.post("/api/upload", (req, res) => {
  const userImageUpload = multer({ storage: storage }).single("file");

  userImageUpload(req, res, function (err) {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error uploading image", error: err });
    }
    // Assuming the image was successfully uploaded and stored
    // Return the URL where the image is stored
    res.status(200).json({ imageUrl: `${req.file.filename}` });
  });
});

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(8800, () => {
  console.log("Server connected and listening on port 8800!");
});
