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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPassword = exports.changePassword = exports.verifyUserStatus = exports.logoutUser = exports.postLoginUser = exports.postSignUp = exports.getAllUser = void 0;
var express_validator_1 = require("express-validator");
var gravatar_1 = require("gravatar");
var bcrypt_1 = require("bcrypt");
var User_1 = require("../models/User");
var Token_1 = require("../middlewares/Token");
var Constants_1 = require("../middlewares/Constants");
// GET all user information
var getAllUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.find()];
            case 1:
                users = _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "OK", users: users })];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                return [2 /*return*/, res.status(500).json({ message: "ERROR", cause: error_1.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllUser = getAllUser;
// POST user signup
var postSignUp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, user_id, email, password, user, avatar, salt, _b, token, expires, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, name = _a.name, user_id = _a.user_id, email = _a.email, password = _a.password;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 6, , 7]);
                return [4 /*yield*/, User_1.default.findOne({ email: email, user_id: user_id })];
            case 2:
                user = _c.sent();
                if (user) {
                    res.status(400).json({
                        errors: [{
                                msg: 'User already exists'
                            }]
                    });
                    return [2 /*return*/];
                }
                avatar = gravatar_1.default.url(email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                user = new User_1.default({
                    name: name,
                    user_id: user_id,
                    email: email,
                    avatar: avatar,
                    password: password
                });
                return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
            case 3:
                salt = _c.sent();
                _b = user;
                return [4 /*yield*/, bcrypt_1.default.hash(password, salt)];
            case 4:
                _b.password = _c.sent();
                return [4 /*yield*/, user.save()];
            case 5:
                _c.sent();
                token = (0, Token_1.createToken)(user._id.toString(), user.email, "7d");
                expires = new Date();
                expires.setDate(expires.getDate() + 7);
                res.cookie(Constants_1.COOKIE_NAME, token, {
                    path: "/", //cookie directory in browser
                    domain: process.env.DOMAIN, // our website domain
                    expires: expires, // same as token expiration time
                    httpOnly: true,
                    signed: true,
                    sameSite: 'lax',
                    secure: true,
                });
                return [2 /*return*/, res
                        .status(201)
                        .json({ message: "OK", name: user.name, email: user.email })];
            case 6:
                err_1 = _c.sent();
                console.error(err_1.message);
                res.status(500).send('Server error');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.postSignUp = postSignUp;
// POST user login
var postLoginUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, user_id, password, user, isMatch, token, expires, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        errors: errors.array()
                    });
                    return [2 /*return*/];
                }
                _a = req.body, user_id = _a.user_id, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, User_1.default.findOne({ user_id: user_id })];
            case 2:
                user = _b.sent();
                if (!user) {
                    res.status(400).json({
                        errors: [{
                                msg: 'User does not exist'
                            }]
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 3:
                isMatch = _b.sent();
                if (!isMatch) {
                    res.status(400).json({
                        errors: [{
                                msg: 'Passwords do not match'
                            }]
                    });
                    return [2 /*return*/];
                }
                // if user will login again we have to -> set new cookies -> erase previous cookies
                res.cookie(Constants_1.COOKIE_NAME, 'clear_token', {
                    path: "/", //cookie directory in browser
                    domain: process.env.DOMAIN, // our website domain
                    maxAge: 0,
                    httpOnly: true,
                    signed: true,
                    sameSite: 'lax',
                    secure: true,
                });
                token = (0, Token_1.createToken)(user._id.toString(), user.email, "7d");
                expires = new Date();
                expires.setDate(expires.getDate() + 7);
                res.cookie(Constants_1.COOKIE_NAME, token, {
                    path: "/", //cookie directory in browser
                    domain: process.env.DOMAIN, // our website domain
                    expires: expires, // same as token expiration time
                    httpOnly: true,
                    signed: true,
                    sameSite: 'lax',
                    secure: true,
                });
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "OK", name: user.name, email: user.email })];
            case 4:
                err_2 = _b.sent();
                console.error(err_2.message);
                res.status(500).send('Server error');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.postLoginUser = postLoginUser;
var logoutUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.findById(res.locals.jwtData.id)];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(401).json({
                            message: "ERROR",
                            cause: "User doesn't exist or token malfunctioned",
                        })];
                if (user._id.toString() !== res.locals.jwtData.id) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "ERROR", cause: "Permissions didn't match" })];
                }
                res.cookie(Constants_1.COOKIE_NAME, 'clear_token', {
                    path: "/", //cookie directory in browser
                    domain: process.env.DOMAIN, // our website domain
                    maxAge: 0,
                    httpOnly: true,
                    signed: true,
                    sameSite: 'lax',
                    secure: true,
                });
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "OK", name: user.name, email: user.email })];
            case 2:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "ERROR", cause: err_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.logoutUser = logoutUser;
var verifyUserStatus = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.findById(res.locals.jwtData.id)];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(401).json({
                            message: "ERROR",
                            cause: "User doesn't exist or token malfunctioned",
                        })];
                if (user._id.toString() !== res.locals.jwtData.id) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "ERROR", cause: "Permissions didn't match" })];
                }
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "OK", user_id: user.user_id, name: user.name, email: user.email })];
            case 2:
                err_4 = _a.sent();
                console.log(err_4);
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "ERROR", cause: err_4.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.verifyUserStatus = verifyUserStatus;
var changePassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var password, user, hashedPassword, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                password = req.body.password;
                return [4 /*yield*/, User_1.default.findById(res.locals.jwtData.id)];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(401).json({
                            message: "ERROR",
                            cause: "User doesn't exist or token malfunctioned",
                        })];
                if (user._id.toString() !== res.locals.jwtData.id) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "ERROR", cause: "Permissions didn't match" })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _a.sent();
                user.password = hashedPassword;
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "OK", name: user.name, email: user.email })];
            case 4:
                err_5 = _a.sent();
                console.log(err_5);
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "ERROR", cause: err_5.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.changePassword = changePassword;
var checkPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var password, user, isPasswordCorrect, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                password = req.body.password;
                return [4 /*yield*/, User_1.default.findById(res.locals.jwtData.id)];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(401).json({
                            message: "ERROR",
                            cause: "User doesn't exist or token malfunctioned",
                        })];
                if (user._id.toString() !== res.locals.jwtData.id) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "ERROR", cause: "Permissions didn't match" })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 2:
                isPasswordCorrect = _a.sent();
                if (!isPasswordCorrect)
                    return [2 /*return*/, res
                            .status(403)
                            .json({ message: "ERROR", cause: "Incorrect Password" })];
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "OK", name: user.name, email: user.email })];
            case 3:
                err_6 = _a.sent();
                console.log(err_6);
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "ERROR", cause: err_6.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.checkPassword = checkPassword;
