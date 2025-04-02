"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDb = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        await mongoose_1.default.connect(MONGO_URI.toString());
        console.log('DB connected ---');
    }
    catch (err) {
        console.log(err);
        return err;
    }
};
exports.default = connectDb;
