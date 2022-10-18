import express from "express";
import {
  createParentStudentAccount,
  loginParents,
} from "../models-controllers/parents/parents.controller";
import authToken from "../middleware/authToken";
const router = express.Router();

// register a student under a school endpoint
/**
 * @swagger
 *  /admit_student/school:
 *   post:
 *       summary: Creating school endpoints
 *       tags: [Parents/Student]
 *       responses:
 *          201:
 *            description: Account created successfully
 *            content:
 *              application/json:
 *
 *       requestBody:
 *          required: true
 *          content:
 *            application/json:
 *
 */
router.post("/admit_student/school", authToken, createParentStudentAccount);

// login a parent(student)
/**
 * @swagger
 *  /login_parent/school:
 *   post:
 *       summary: Creating school endpoints
 *       tags: [Parents/Student]
 *       responses:
 *          201:
 *            description: Account created successfully
 *            content:
 *              application/json:
 *
 *       requestBody:
 *          required: true
 *          content:
 *            application/json:
 *
 */
router.post("/login_parent/school", loginParents);

export default router;
