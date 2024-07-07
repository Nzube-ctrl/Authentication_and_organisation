import express from "express";
import {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  addUserToOrganisation,
} from "../controllers/organisation.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const organisationRoute = express.Router();

organisationRoute.get("/", protect, getAllOrganisations);
organisationRoute.get("/:orgId", protect, getOrganisationById);
organisationRoute.post("/", protect, createOrganisation);
organisationRoute.post("/:orgId/addUser", protect, addUserToOrganisation);

export default organisationRoute;
