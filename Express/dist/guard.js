"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGuard = void 0;
let adminGuard = (req, res, next) => {
    var _a, _b;
    if ((_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.is_admin) {
        next();
    }
    else {
        res.status(401).json({ error: 'only accessible by admin' });
    }
};
exports.adminGuard = adminGuard;
