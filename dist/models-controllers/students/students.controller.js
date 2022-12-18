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
exports.loginParents = exports.getSchoolStudents = exports.admitStudentBySchool = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_status_codes_1 = require("http-status-codes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const students_model_1 = __importDefault(require("./students.model"));
const school_model_1 = __importDefault(require("../school/school.model"));
const ControllerError_1 = require("../../middleware/ControllerError");
const sendParentsEmails_1 = __importDefault(require("../../emails/parents/sendParentsEmails"));
const utils_1 = require("../../helpers/utils");
exports.admitStudentBySchool = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { school_id } = req.query;
    const body = Object.assign({}, req.body);
    const findSchool = yield school_model_1.default
        .findOne({
        _id: school_id,
    })
        .populate("school_students_parents")
        .select("school_students_parents");
    if (!findSchool) {
        (0, ControllerError_1.throwError)("You need to provide valid the school _id", 404);
    }
    if ((findSchool === null || findSchool === void 0 ? void 0 : findSchool._id.toString()) !== ((_a = req.id) === null || _a === void 0 ? void 0 : _a.toString()))
        (0, ControllerError_1.throwError)("You are not authorized", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    const findStudent = yield students_model_1.default.findOne({
        parent_email: body.parent_email,
        student_name: body.student_name,
        parent_phone_number: body.parent_phone_number,
    });
    const studentExit = findSchool === null || findSchool === void 0 ? void 0 : findSchool.school_students_parents.find((id) => (id === null || id === void 0 ? void 0 : id._id.toString()) === (findStudent === null || findStudent === void 0 ? void 0 : findStudent._id.toString()));
    if (findStudent || studentExit) {
        (0, ControllerError_1.throwError)("Student is already admitted", http_status_codes_1.StatusCodes.CONFLICT);
    }
    else {
        let _id = "";
        const hashPassword = yield bcrypt_1.default.hash(utils_1.password, yield (0, utils_1.salt)());
        const parentStudentAccount = new students_model_1.default(Object.assign(Object.assign({}, req.body), { parent_password: hashPassword, user_name: (0, utils_1.getUniqueName)(body.student_name).split(" ")[1] }));
        if (parentStudentAccount)
            _id = parentStudentAccount._id;
        yield parentStudentAccount.save();
        findSchool === null || findSchool === void 0 ? void 0 : findSchool.school_students_parents.push(_id);
        yield findSchool.save();
        (0, sendParentsEmails_1.default)(parentStudentAccount === null || parentStudentAccount === void 0 ? void 0 : parentStudentAccount.parent_email, parentStudentAccount === null || parentStudentAccount === void 0 ? void 0 : parentStudentAccount.student_name);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Student admitted successfully",
            userName: (0, utils_1.getUniqueName)(body.student_name),
            password: utils_1.password,
        });
    }
}));
exports.getSchoolStudents = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { school_id } = req.query;
    const findSchool = yield school_model_1.default
        .findOne({
        _id: school_id,
    })
        .populate("school_students_parents")
        .select("school_students_parents");
    if (!findSchool) {
        (0, ControllerError_1.throwError)("You need to provide valid the school _id", 404);
    }
    if ((findSchool === null || findSchool === void 0 ? void 0 : findSchool._id.toString()) !== ((_b = req.id) === null || _b === void 0 ? void 0 : _b.toString()))
        (0, ControllerError_1.throwError)("You are not authorized", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    let _id = "";
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ message: "Fetched successfully", data: findSchool });
}));
exports.loginParents = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parents_name = req.body.parents_email;
    const password = req.body.parent_password;
    if (!parents_name) {
        (0, ControllerError_1.throwError)("No body field must be empty", 422);
    }
    const findOne = yield students_model_1.default.findById({
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