"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const students_controller_1 = require("../models-controllers/students/students.controller");
const authToken_1 = __importDefault(require("../middleware/authToken"));
const router = express_1.default.Router();
router.post("/admit_student/school", authToken_1.default, students_controller_1.admitStudentBySchool);
router.post("/login_parent/school", students_controller_1.loginParents);
router.get("/get_school_students/school", authToken_1.default, students_controller_1.getSchoolStudents);
exports.default = router;
