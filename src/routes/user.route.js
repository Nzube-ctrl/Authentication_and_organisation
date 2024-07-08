import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const UserRoute = express.Router();

UserRoute.post("/auth/register", registerUser);
UserRoute.post("/auth/login", loginUser);
UserRoute.get("/:id", protect, getUser);

export default UserRoute;
