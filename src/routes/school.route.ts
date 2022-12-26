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
  verifyEmailAccount,
  requestVerificationOtp,
  verifyForgetPasswordOTp,
  requestOtp,
} from "../models-controllers/school/school.controller";
import cacheSuccesses from "../services/apicache";

const router = express.Router();

router.post("/create_school/", createSchoolAccount);

router.patch("/complete_school_profile/", authToken, createSchoolProfile);

router.post("/login_school/", loginSchoolAccount);

router.get("/all_schools/", authToken, cacheSuccesses, all_createdSchools);

router.post("/update_school_profile/", authToken, profileUpdate);

router.post("/request_email_address_otp/", requestVerificationOtp);

router.patch("/verify_email_account/", verifyEmailAccount);

router.post("/request_otp", requestOtp);

router.patch("/verify_school_password_account/", verifyForgetPasswordOTp);

router.post("/reset_school_password/", resetSchoolAccountPassword);

router.patch("/update_school_password/", updateSchoolPassword);

export default router;
