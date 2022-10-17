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
exports.resetSchoolAccountPassword = exports.loginSchoolAccount = exports.createSchoolAccount = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_status_codes_1 = require("http-status-codes");
const ControllerError_1 = require("../../middleware/ControllerError");
const school_model_1 = __importDefault(require("./school.model"));
exports.createSchoolAccount = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const IfSchoolExits = yield school_model_1.default.findOne({
        school_email: req.body.second_email,
    });
    if (IfSchoolExits) {
        (0, ControllerError_1.throwError)("School already created with his email adress provided", 409);
    }
    yield school_model_1.default.create({
        school_name: req.body.school_name,
        school_adress: req.body.school_adress,
        rc_number: req.body.rc_number,
        school_logo: req.body.school_logo,
        admin_firstname: req.body.admin_firstname,
        admin_lastname: req.body.admin_lastname,
        phone_number: req.body.phone_number,
        school_email: req.body.second_email,
        admin_position: req.body.school_location,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Account created successfully" });
}));
exports.loginSchoolAccount = (0, express_async_handler_1.default)((req, res, next) => { });
exports.resetSchoolAccountPassword = (0, express_async_handler_1.default)((req, res, next) => { });
