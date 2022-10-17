"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const school_controller_1 = require("../models/school/school.controller");
const router = express_1.default.Router();
/**
 * @swagger
 *  /signup_school:
 *   post:
 *       summary: Creating school endpoints
 *       response:
 *           200:
 *             description:Account created successfully
 */
/**
 * @swagger
 *  /login_school:
 *   post:
 *       summary: Login school admin endpoints
 *       response: 200
 */
/**
 * @swagger
 *  /reset_school_password:
 *   post:
 *       summary: Login school admin endpoints
 *       response: 200
 */
router.post("/signup_school", school_controller_1.createSchoolAccount);
router.post("/login_school", school_controller_1.loginSchoolAccount);
router.post("/reset_school_password", school_controller_1.resetSchoolAccountPassword);
exports.default = router;
