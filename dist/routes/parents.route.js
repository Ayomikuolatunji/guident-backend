"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const parents_controller_1 = require("../models-controllers/parents/parents.controller");
const authToken_1 = __importDefault(require("../middleware/authToken"));
const router = express_1.default.Router();
router.post("/admit_student/school", authToken_1.default, parents_controller_1.createParentStudentAccount);
router.post("/login_parent/school", parents_controller_1.loginParents);
exports.default = router;
