import express from "express";
import authToken from "../middleware/authToken";
import {
  all_createdSchools,
  createSchoolAccount,
  createSchoolProfile,
  loginSchoolAccount,
  profileUpdate,
  resetSchoolAccountPassword,
  updateSchoolPassword,
  verifyAccount,
} from "../models-controllers/school/school.controller";
import cacheSuccesses from "../services/apicache";

const router = express.Router();

router.post("/create_school/", createSchoolAccount);

router.patch("/complete_school_profile/", authToken, createSchoolProfile);

router.patch("/update_school_password/", updateSchoolPassword);

router.post("/login_school/", loginSchoolAccount);

router.get("/all_schools/", authToken, cacheSuccesses, all_createdSchools);

router.post("/update_school_profile/", authToken, profileUpdate);

router.post("/reset_school_password/", resetSchoolAccountPassword);

router.post("/verify_account/", verifyAccount);


export default router;
