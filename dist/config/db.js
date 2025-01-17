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
const index_1 = require("./index");
const mongoose_1 = __importDefault(require("mongoose"));
const DB_NAME = "Spieces";
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!index_1.config.DB_URL) {
            throw new Error("DB_URL is not defined in the configuration");
        }
        yield mongoose_1.default.connect(index_1.config.DB_URL, {
            dbName: DB_NAME,
        });
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
});
exports.default = connectToDatabase;
//# sourceMappingURL=db.js.map