import express from "express";
import {
  createParentStudentAccount,
  loginParents,
} from "../models-controllers/parents/parents.controller";
import authToken from "../middleware/authToken";
const router = express.Router();

router.post("/admit_student/school", authToken, createParentStudentAccount);

router.post("/login_parent/school", loginParents);

export default router;
