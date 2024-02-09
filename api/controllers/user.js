import jwt from "jsonwebtoken";
import { db } from "../db.js";

export const getUserInfo = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id;

    const q = "SELECT id, username, email, img FROM users WHERE id = ?";

    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);

      if (data && data.length > 0) {
        const userInfo = data[0];
        return res.status(200).json(userInfo);
      } else {
        return res.status(404).json("User not found");
      }
    });
  });
};

export const updateUserProfile = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id;
    const { username, img } = req.body;

    const q = "UPDATE users SET username = ?, img = ? WHERE id = ?";

    const values = [username, img, userId];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.json("User profile updated successfully");
    });
  });
};

export const createUserProfile = (req, res) => {
  const { username, email, password, img } = req.body;

  const q =
    "INSERT INTO users (username, email, password, img) VALUES (?, ?, ?, ?)";

  const values = [username, email, password, img];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);

    return res.json("New user profile created successfully");
  });
};
