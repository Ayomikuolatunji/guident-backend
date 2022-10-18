import express from "express";
import { createParentStudentAccount } from "../models-controllers/parents/parents.controller";
import authToken from "../middleware/authToken";
const router = express.Router();

// register a student under a school endpoint

/**
 * @swagger
 *  /admit_student/:school_id:
 *   post:
 *       summary: Creating school endpoints
 *       tags: [School]
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

export default router;
