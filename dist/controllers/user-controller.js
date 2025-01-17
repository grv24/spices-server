"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const mockUser = {
    id: 1,
    name: "Gourav Mahobe",
    email: "gourav.mahobe@example.com",
};
const getUser = (_req, res) => {
    res.json(mockUser);
};
exports.getUser = getUser;
//# sourceMappingURL=user-controller.js.map