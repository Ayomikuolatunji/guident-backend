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
exports.loginParents = exports.getSchoolStudents = exports.createParentStudentAccount = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_status_codes_1 = require("http-status-codes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const parents_model_1 = __importDefault(require("./parents.model"));
const school_model_1 = __importDefault(require("../school/school.model"));
const ControllerError_1 = require("../../middleware/ControllerError");
const sendParentsEmails_1 = __importDefault(require("../../emails/parents/sendParentsEmails"));
exports.createParentStudentAccount = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { school_id } = req.query;
    const findSchool = yield school_model_1.default.findById({
        _id: school_id,
    });
    if (!findSchool) {
        (0, ControllerError_1.throwError)("You need to provide valid the school _id", 404);
        next();
    }
    let _id = "";
    const parentStudentAccount = new parents_model_1.default(Object.assign({}, req.body));
    if (parentStudentAccount)
        _id = parentStudentAccount._id;
    yield parentStudentAccount.save();
    findSchool === null || findSchool === void 0 ? void 0 : findSchool.school_students_parents.push(_id);
    yield findSchool.save();
    (0, sendParentsEmails_1.default)(parentStudentAccount === null || parentStudentAccount === void 0 ? void 0 : parentStudentAccount.parent_email, parentStudentAccount === null || parentStudentAccount === void 0 ? void 0 : parentStudentAccount.student_name);
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ Message: "student admitted successfully" });
}));
exports.getSchoolStudents = (0, express_async_handler_1.default)(() => __awaiter(void 0, void 0, void 0, function* () { }));
exports.loginParents = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parents_name = req.body.parents_email;
    const password = req.body.parent_password;
    if (!parents_name) {
        (0, ControllerError_1.throwError)("No body field must be empty", 422);
    }
    const findOne = yield parents_model_1.default.findById({
        parents_name: parents_name,
    });
    const comparePassword = bcrypt_1.default.compareSync(password, findOne === null || findOne === void 0 ? void 0 : findOne.parent_name);
    if (!comparePassword) {
        (0, ControllerError_1.throwError)("Invalid email or password", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const token = jsonwebtoken_1.default.sign({
        email: findOne === null || findOne === void 0 ? void 0 : findOne.parent_name,
        id: findOne === null || findOne === void 0 ? void 0 : findOne._id.toString(),
    }, `${process.env.JWT_SECRET_KEY}`, { expiresIn: "30d" });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "Login successfully",
        school_credentials: { token: token, parent_id: findOne === null || findOne === void 0 ? void 0 : findOne._id },
    });
}));
