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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.password = exports.getUniqueName = exports.binarySearch = exports.diff_minutes = exports.salt = exports.getMutatedMongooseField = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const unique_username_generator_1 = require("unique-username-generator");
const generate_password_1 = __importDefault(require("generate-password"));
const getMutatedMongooseField = (field) => {
    const { item } = field, otherValue = __rest(field, ["item"]);
    return otherValue;
};
exports.getMutatedMongooseField = getMutatedMongooseField;
const salt = () => __awaiter(void 0, void 0, void 0, function* () { return yield bcrypt_1.default.genSalt(10); });
exports.salt = salt;
function diff_minutes(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}
exports.diff_minutes = diff_minutes;
function binarySearch(array, key, compare) {
    let left = 0;
    let right = array.length - 1;
    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        const comparison = compare(array[middle], key);
        if (comparison === 0) {
            return middle;
        }
        else if (comparison < 0) {
            left = middle + 1;
        }
        else {
            right = middle - 1;
        }
    }
    return -1;
}
exports.binarySearch = binarySearch;
const getUniqueName = (name) => {
    const username = (0, unique_username_generator_1.generateUsername)(name, 3);
    return username;
};
exports.getUniqueName = getUniqueName;
exports.password = generate_password_1.default.generate({
    length: 10,
    numbers: true,
});
