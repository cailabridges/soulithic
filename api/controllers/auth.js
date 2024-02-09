import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(q, [req.body.username, req.body.email], (err, data) => {
    if (err) return res.json(err);
    if (data.length) return res.status(409).json("User already exists!");

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)";
    const values = [req.body.username, req.body.email, hash];

    db.query(q, values, (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  // CHECK USER
  const q = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(q, [req.body.username, req.body.username], (err, data) => {
    if (err) {
      console.error("Error while querying the database:", err);
      return res.json(err); // Return error response
    }

    if (data.length === 0) {
      console.log("User not found!");
      return res.status(404).json("User not found!");
    }

    // CHECK PASSWORD
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");

    const token = jwt.sign({ id: data[0].id }, "jwtkey");
    const userDetails = {
      id: data[0].id,
      username: data[0].username,
      email: data[0].email,
      img: data[0].img,
    };

    // Set the access_token cookie here with appropriate options
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(userDetails);
  });
};

export const logout = (req, res) => {
  // Clearing the access_token cookie with appropriate options
  res
    .clearCookie("access_token", {})
    .status(200)
    .json("User has been logged out.");
};
