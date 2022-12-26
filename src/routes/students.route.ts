import express from "express";
import {
  admitStudentBySchool,
  getSchoolStudents,
  loginParents,
} from "../models-controllers/students/students.controller";
import authToken from "../middleware/authToken";
const router = express.Router();

router.post("/admit_student/school", authToken, admitStudentBySchool);

router.post("/login_parent/school", loginParents);

router.get("/get_school_students/school", authToken, getSchoolStudents);

export default router;
