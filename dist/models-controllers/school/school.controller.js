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
exports.updateSchoolPassword = exports.verifyAccount = exports.resetSchoolAccountPassword = exports.all_createdSchools = exports.profileUpdate = exports.loginSchoolAccount = exports.createSchoolProfile = exports.createSchoolAccount = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_status_codes_1 = require("http-status-codes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ControllerError_1 = require("../../middleware/ControllerError");
const school_model_1 = __importDefault(require("./school.model"));
const SchoolRegEmail_1 = __importDefault(require("../../emails/schools/SchoolRegEmail"));
const utils_1 = require("../../helpers/utils");
const ResetPasswordEmail_1 = __importDefault(require("../../emails/schools/ResetPasswordEmail"));
const opt_generator_1 = require("../../helpers/opt-generator");
dotenv_1.default.config();
exports.createSchoolAccount = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.admin_password;
    const IfSchoolExits = yield school_model_1.default
        .findOne({
        school_email: req.body.school_email,
    })
        .exec();
    if (IfSchoolExits) {
        (0, ControllerError_1.throwError)("School already exist", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    }
    else if (password === "") {
        (0, ControllerError_1.throwError)("password is required", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    }
    else if (password.length < 8) {
        (0, ControllerError_1.throwError)("Password must be 8 characters long", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    }
    const hashPassword = bcrypt_1.default.hashSync(password, yield (0, utils_1.salt)());
    const school = new school_model_1.default({
        school_email: req.body.school_email,
        admin_password: hashPassword,
    });
    const result = yield school.save();
    (0, SchoolRegEmail_1.default)(result.school_email, result.school_name);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "Account created successfully",
        data: (0, utils_1.getMutatedMongooseField)({
            field: result._doc,
            item: "admin_password",
        }),
    });
}));
exports.createSchoolProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const school_id = req.query.school_id;
    const IfSchoolExits = yield school_model_1.default.findOne({ _id: school_id });
    if (!IfSchoolExits)
        (0, ControllerError_1.throwError)("Invalid id was provide", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    else if ((IfSchoolExits === null || IfSchoolExits === void 0 ? void 0 : IfSchoolExits._id.toString()) !== ((_a = req.id) === null || _a === void 0 ? void 0 : _a.toString()))
        (0, ControllerError_1.throwError)("You are not authorized", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    if (!req.body.school_name)
        (0, ControllerError_1.throwError)("school_name", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    else if (!req.body.rc_number)
        (0, ControllerError_1.throwError)("RC number required", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    else if (!req.body.school_logo)
        (0, ControllerError_1.throwError)("School logo is required", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    else if (!req.body.admin_first_name)
        (0, ControllerError_1.throwError)("Admin first name", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    else if (!req.body.phone_number)
        (0, ControllerError_1.throwError)("Admin phone number", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    else if (!req.body.admin_position)
        (0, ControllerError_1.throwError)("Admin position required", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    const updateSchoolProfile = yield school_model_1.default.updateOne({ _id: school_id }, {
        school_name: req.body.school_name,
        school_address: req.body.school_address,
        rc_number: req.body.rc_number,
        school_logo: req.body.school_logo,
        admin_first_name: req.body.admin_first_name,
        admin_last_name: req.body.admin_last_name,
        phone_number: parseInt(req.body.phone_number),
        admin_position: req.body.admin_position,
        profile_completed: true,
    }, {
        upsert: true,
    });
    res.status(200).json({
        message: "Profile updated successfully",
        data: updateSchoolProfile._doc,
    });
}));
exports.loginSchoolAccount = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.school_email;
    const admin_password = req.body.admin_password;
    const loginSchool = yield school_model_1.default.findOne({
        school_email: email,
    });
    if (!loginSchool)
        (0, ControllerError_1.throwError)("Invalid email or password", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    const comparePassword = bcrypt_1.default.compareSync(admin_password, loginSchool === null || loginSchool === void 0 ? void 0 : loginSchool.admin_password);
    if (!comparePassword) {
        (0, ControllerError_1.throwError)("Invalid email or password", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const token = jsonwebtoken_1.default.sign({
        email: loginSchool === null || loginSchool === void 0 ? void 0 : loginSchool.school_email,
        id: loginSchool === null || loginSchool === void 0 ? void 0 : loginSchool._id.toString(),
    }, `${process.env.JWT_SECRET_KEY}`, { expiresIn: "30d" });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "Login successfully",
        school_credentials: { token: token, school_id: loginSchool === null || loginSchool === void 0 ? void 0 : loginSchool._id },
    });
}));
exports.profileUpdate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const school_id = req.query.school_id;
    const IfSchoolExits = yield school_model_1.default.findOne({
        _id: school_id,
    });
    if (!IfSchoolExits)
        (0, ControllerError_1.throwError)("Invalid query id was provide", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    res.status(200).json({
        message: "School status fetched",
        data: {
            profileUpdate: IfSchoolExits.profile_completed,
        },
    });
}));
exports.all_createdSchools = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const all_schools = yield school_model_1.default.find({});
    const schoolArrays = [];
    all_schools.forEach((ele) => {
        const newObj = (0, utils_1.getMutatedMongooseField)({
            field: ele._doc,
            item: "admin_password",
        });
        schoolArrays.push(newObj);
    });
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ message: "All created school data", data: schoolArrays });
}));
exports.resetSchoolAccountPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schoolEmail = req.body.school_email;
    if (!schoolEmail)
        (0, ControllerError_1.throwError)("school email is not provided", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    const findSchool = yield school_model_1.default.findOne({
        school_email: schoolEmail,
    });
    if (!findSchool)
        (0, ControllerError_1.throwError)("School does not exist with the email provided", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    const otp = (0, opt_generator_1.generateOTP)();
    yield school_model_1.default.updateOne({ school_email: schoolEmail }, { otp: otp });
    (0, ResetPasswordEmail_1.default)(findSchool === null || findSchool === void 0 ? void 0 : findSchool.school_email, findSchool === null || findSchool === void 0 ? void 0 : findSchool.school_name, otp);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Opt sent successfully" });
}));
exports.verifyAccount = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = req.body.otp;
    const findAccountByOtp = yield school_model_1.default
        .findOne({
        otp: otp,
    })
        .exec();
    if (!otp)
        (0, ControllerError_1.throwError)("Token not provided or invalid token", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    if (!findAccountByOtp)
        (0, ControllerError_1.throwError)("Request a new token", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    const dateElapseTime = (0, utils_1.diff_minutes)(findAccountByOtp === null || findAccountByOtp === void 0 ? void 0 : findAccountByOtp.updatedAt, new Date());
    if (dateElapseTime > 2) {
        (0, ControllerError_1.throwError)("Token expired, try again", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    }
    else {
        yield school_model_1.default.updateOne({ opt: otp }, { tokenVerification: true });
    }
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ message: "You are verified to reset password", otp });
}));
exports.updateSchoolPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = req.query.otp;
    const newSchoolPassword = req.body.admin_password;
    const findbyOtp = yield school_model_1.default.findOne({
        otp: otp,
        tokenVerification: true,
    });
    if (!findbyOtp)
        (0, ControllerError_1.throwError)("Not allowed", http_status_codes_1.StatusCodes.NOT_ACCEPTABLE);
    const hashPassword = bcrypt_1.default.hashSync(newSchoolPassword, yield (0, utils_1.salt)());
    yield school_model_1.default.updateOne({ otp: otp }, { tokenVerification: false, otp: "", admin_password: hashPassword }, {
        upsert: true,
    });
    res.status(200).json({ message: "Password updated successfully" });
}));
