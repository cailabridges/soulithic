import express from "express";
import { getUserInfo, updateUserProfile } from "../controllers/user.js";

const router = express.Router();

// Route to get user information
router.get("/", getUserInfo); // Adjusted route from /:userId to just /

// Route to update user profile
router.put("/:userId", updateUserProfile);

export default router;
