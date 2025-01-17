"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const app = (0, express_1.default)();
//Health check endpoint at root
app.get("/", (req, res) => {
    res.status(200).send("Server is live");
});
app.use(express_1.default.json());
app.use("/api", user_route_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map