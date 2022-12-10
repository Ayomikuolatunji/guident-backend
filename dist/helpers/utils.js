"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMutatedMongooseField = void 0;
const getMutatedMongooseField = (field, item) => {
    const newField = Object.assign({}, field);
    delete newField[item];
    return newField;
};
exports.getMutatedMongooseField = getMutatedMongooseField;
