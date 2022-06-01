"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = void 0;
function catchError(res) {
    return (error) => res.status(500).json({ error: String(error) });
}
exports.catchError = catchError;
