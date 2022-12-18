import express from "express";
import {
  admitStudentBySchool,
  loginParents,
} from "../models-controllers/parentStudents/parentStudents.controller";
import authToken from "../middleware/authToken";
const router = express.Router();

router.post("/admit_student/school", authToken, admitStudentBySchool);

router.post("/login_parent/school", loginParents);

export default router;
