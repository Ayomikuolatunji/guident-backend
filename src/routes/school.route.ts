import express from "express";
import authToken from "../middleware/authToken";
import {
  all_createdSchools,
  createSchoolAccount,
  createSchoolProfile,
  loginSchoolAccount,
  profileUpdate,
  resetSchoolAccountPassword,
} from "../models-controllers/school/school.controller";
import cacheSuccesses from "../services/apicache";
const router = express.Router();

router.post("/create_school/", createSchoolAccount);

router.patch("/complete_school_profile/", authToken, createSchoolProfile);

router.post("/login_school/", loginSchoolAccount);

router.patch("/reset_school_password/", resetSchoolAccountPassword);

router.get("/all_schools/", cacheSuccesses, all_createdSchools);

router.get("/update_school_profile/", authToken, profileUpdate);

export default router;
