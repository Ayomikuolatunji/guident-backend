"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authToken_1 = __importDefault(require("../middleware/authToken"));
const school_controller_1 = require("../models-controllers/school/school.controller");
const apicache_1 = __importDefault(require("../services/apicache"));
const router = express_1.default.Router();
router.post("/create_school/", school_controller_1.createSchoolAccount);
router.patch("/complete_school_profile/", authToken_1.default, school_controller_1.createSchoolProfile);
router.patch("/update_school_password/", school_controller_1.updateSchoolPassword);
router.post("/login_school/", school_controller_1.loginSchoolAccount);
router.get("/all_schools/", authToken_1.default, apicache_1.default, school_controller_1.all_createdSchools);
router.post("/update_school_profile/", authToken_1.default, school_controller_1.profileUpdate);
router.post("/reset_school_password/", school_controller_1.resetSchoolAccountPassword);
router.post("/verify_account/", school_controller_1.verifyAccount);
exports.default = router;
