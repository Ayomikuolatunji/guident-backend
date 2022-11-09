"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apicache_1 = __importDefault(require("apicache"));
let cache = apicache_1.default.middleware;
const onlyStatus200 = (req, res) => res.statusCode === 200;
const cacheSuccesses = cache("5 minutes", onlyStatus200);
exports.default = cacheSuccesses;
