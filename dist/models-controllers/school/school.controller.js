"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchoolEmail = exports.updatePassword = exports.resetSchoolAccountPassword = exports.all_createdSchools = exports.loginSchoolAccount = exports.createSchoolAccount = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_status_codes_1 = require("http-status-codes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ControllerError_1 = require("../../middleware/ControllerError");
const school_model_1 = __importDefault(require("./school.model"));
const SchoolRegEmail_1 = __importDefault(require("../../emails/schools/SchoolRegEmail"));
const utils_1 = require("../../helpers/utils");
dotenv_1.default.config();
exports.createSchoolAccount = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const IfSchoolExits = yield school_model_1.default.findOne({
        school_email: req.body.school_email,
    });
    if (IfSchoolExits) {
        (0, ControllerError_1.throwError)("School already created with the email provided", 409);
    }
    const salt = yield bcrypt_1.default.genSalt(15);
    const hashPassword = bcrypt_1.default.hashSync(req.body.admin_password, salt);
    const school = new school_model_1.default(Object.assign(Object.assign({}, req.body), { admin_password: hashPassword }));
    const result = yield school.save();
    if (result) {
        (0, SchoolRegEmail_1.default)(result.school_email, result.school_name);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Account created successfully",
            data: (0, utils_1.getMutatedMomgooseField)(result._doc),
        });
    }
}));
exports.loginSchoolAccount = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.school_email;
    const admin_password = req.body.admin_password;
    const loginSchool = yield school_model_1.default.findOne({
        email: email,
    });
    const comparePassword = bcrypt_1.default.compareSync(admin_password, loginSchool === null || loginSchool === void 0 ? void 0 : loginSchool.admin_password);
    if (!comparePassword) {
        (0, ControllerError_1.throwError)("Invalid email or password", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const token = jsonwebtoken_1.default.sign({
        school_email: loginSchool === null || loginSchool === void 0 ? void 0 : loginSchool.school_email,
        id: loginSchool === null || loginSchool === void 0 ? void 0 : loginSchool._id.toString(),
    }, `${process.env.JWT_SECRET_KEY}`, { expiresIn: "30d" });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "Login successfully",
        school_credentials: { token: token, school_id: loginSchool === null || loginSchool === void 0 ? void 0 : loginSchool._id },
    });
}));
exports.all_createdSchools = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const all_schools = yield school_model_1.default.find({});
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ message: "All created school data", all_schools });
}));
exports.resetSchoolAccountPassword = (0, express_async_handler_1.default)((req, res, next) => { });
exports.updatePassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.updateSchoolEmail = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () { }));
