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
const parents_model_1 = __importDefault(require("../parents/parents.model"));
const ControllerError_1 = require("../../middleware/ControllerError");
const sendParentsEmails_1 = __importDefault(require("../../emails/parents/sendParentsEmails"));
const utils_1 = require("../../helpers/utils");
exports.admitStudentBySchool = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { school_id } = req.query;
    const body = Object.assign({}, req.body);
    const findSchool = yield school_model_1.default
        .findOne({
        _id: school_id,
    })
        .populate("school_students school_parents")
        .select("school_students");
    if (!findSchool) {
        (0, ControllerError_1.throwError)("You need to provide valid the school _id", 404);
    }
    if ((findSchool === null || findSchool === void 0 ? void 0 : findSchool._id.toString()) !== ((_a = req.id) === null || _a === void 0 ? void 0 : _a.toString()))
        (0, ControllerError_1.throwError)("You are not authorized", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
    const findStudent = yield students_model_1.default.findOne({
        student_name: body.student_name,
    });
    const findParent = yield parents_model_1.default.findOne({
        parent_phone_number: body.parent_phone_number,
        parent_email: body.parent_email,
        parent_name: body.parent_name,
    });
    const studentExit = findSchool === null || findSchool === void 0 ? void 0 : findSchool.school_students.find((id) => (id === null || id === void 0 ? void 0 : id._id.toString()) === (findStudent === null || findStudent === void 0 ? void 0 : findStudent._id.toString()));
    const parentExit = findSchool === null || findSchool === void 0 ? void 0 : findSchool.school_parents.find((id) => (id === null || id === void 0 ? void 0 : id._id.toString()) === (findParent === null || findParent === void 0 ? void 0 : findParent._id.toString()));
    if (findStudent || studentExit) {
        (0, ControllerError_1.throwError)("Student is already admitted", http_status_codes_1.StatusCodes.CONFLICT);
    }
    else {
        if (!(body === null || body === void 0 ? void 0 : body.parent_password))
            (0, ControllerError_1.throwError)("Password required", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
        const hashPassword = yield bcrypt_1.default.hash(body === null || body === void 0 ? void 0 : body.parent_password, yield (0, utils_1.salt)());
        if (!hashPassword)
            (0, ControllerError_1.throwError)("Cant set password, try again", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
        const studentAccount = new students_model_1.default({
            user_name: (0, utils_1.getUniqueName)(body.student_name).split(" ")[1],
            student_name: body.student_name,
            date_of_birth: body.date_of_birth,
            nationality: body.nationality,
            state_of_origin: body.state_of_origin,
            local_government_area: body.local_government_area,
            profile_picture: body.profile_picture,
            student_intended_class: body.student_intended_class,
        });
        yield studentAccount.save();
        if (parentExit && findParent) {
            (_b = findParent === null || findParent === void 0 ? void 0 : findParent.students) === null || _b === void 0 ? void 0 : _b.push(studentAccount._id);
            yield (findParent === null || findParent === void 0 ? void 0 : findParent.save());
            findSchool === null || findSchool === void 0 ? void 0 : findSchool.school_students.push(studentAccount._id);
            yield findSchool.save();
            yield (students_model_1.default === null || students_model_1.default === void 0 ? void 0 : students_model_1.default.updateOne({ _id: studentAccount._id }, {
                school_ref: findSchool === null || findSchool === void 0 ? void 0 : findSchool._id,
                parent_ref: findParent === null || findParent === void 0 ? void 0 : findParent._id,
            }));
        }
        else if (!parentExit || !findParent) {
            const createParentAccount = new parents_model_1.default({
                parent_email: body.parent_email,
                parent_name: body.parent_name,
                parent_password: hashPassword,
                parent_phone_number: body.parent_phone_number,
                parent_address: body.parent_address,
                school_ref: findSchool === null || findSchool === void 0 ? void 0 : findSchool.id,
            });
            yield createParentAccount.save();
            yield (createParentAccount === null || createParentAccount === void 0 ? void 0 : createParentAccount.students.push(studentAccount._id));
            yield createParentAccount.save();
            findSchool === null || findSchool === void 0 ? void 0 : findSchool.school_students.push(studentAccount._id);
            findSchool === null || findSchool === void 0 ? void 0 : findSchool.school_parents.push(createParentAccount === null || createParentAccount === void 0 ? void 0 : createParentAccount._id);
            yield (findSchool === null || findSchool === void 0 ? void 0 : findSchool.save());
            yield (students_model_1.default === null || students_model_1.default === void 0 ? void 0 : students_model_1.default.updateOne({ _id: studentAccount._id }, {
                school_ref: findSchool === null || findSchool === void 0 ? void 0 : findSchool._id,
                parent_ref: createParentAccount === null || createParentAccount === void 0 ? void 0 : createParentAccount._id,
            }));
        }
        yield (0, sendParentsEmails_1.default)(findParent === null || findParent === void 0 ? void 0 : findParent.parent_email, studentAccount === null || studentAccount === void 0 ? void 0 : studentAccount.student_name);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Student admitted successfully",
            userName: (0, utils_1.getUniqueName)(body.student_name).split(" ")[1],
            password: body.parent_password,
        });
    }
}));
exports.getSchoolStudents = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { school_id } = req.query;
    const findSchool = yield school_model_1.default
        .findOne({
        _id: school_id,
    })
        .populate("school_students")
        .select("school_students");
    if (!findSchool) {
        (0, ControllerError_1.throwError)("You need to provide valid the school _id", 404);
    }
    if ((findSchool === null || findSchool === void 0 ? void 0 : findSchool._id.toString()) !== ((_c = req.id) === null || _c === void 0 ? void 0 : _c.toString()))
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
