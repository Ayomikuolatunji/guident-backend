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
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const GOOGLE_CLIENTID = process.env.GOOGLE_CLIENTID;
const GOOGLE_SECRET_KEY = process.env.GOOGLE_SECRET_KEY;
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const auth2 = new googleapis_1.google.auth.OAuth2(GOOGLE_CLIENTID, GOOGLE_SECRET_KEY, GOOGLE_REDIRECT_URL);
auth2.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
const transporter = () => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield auth2.getAccessToken();
    return nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.G_MAIL,
            clientId: GOOGLE_CLIENTID,
            clientSecret: GOOGLE_SECRET_KEY,
            refreshToken: GOOGLE_REFRESH_TOKEN,
            accessToken: accessToken,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
});
exports.default = transporter;
