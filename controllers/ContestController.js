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
exports.deleteContest = exports.updateContest = exports.useHintInContest = exports.submitFlagForContest = exports.participateInContest = exports.createContest = void 0;
var bcrypt_1 = require("bcrypt");
var Contest_1 = require("../models/Contest");
var ContestParticipation_1 = require("../models/ContestParticipation");
var Machine_1 = require("../models/Machine");
var User_1 = require("../models/User");
/**
 * Create a new contest.
 */
var createContest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, description, startTime, endTime, machines, contestExp, machineDocs, newContest, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, name_1 = _a.name, description = _a.description, startTime = _a.startTime, endTime = _a.endTime, machines = _a.machines, contestExp = _a.contestExp;
                return [4 /*yield*/, Machine_1.default.find({ _id: { $in: machines } })];
            case 1:
                machineDocs = _b.sent();
                if (machineDocs.length !== machines.length) {
                    res.status(400).json({ msg: 'One or more machines are invalid.' });
                    return [2 /*return*/];
                }
                newContest = new Contest_1.default({
                    name: name_1,
                    description: description,
                    startTime: startTime,
                    endTime: endTime,
                    machines: machines,
                    contestExp: contestExp
                });
                return [4 /*yield*/, newContest.save()];
            case 2:
                _b.sent();
                res.status(201).json({ msg: 'Contest created successfully.', contest: newContest });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error('Error creating contest:', error_1);
                res.status(500).send('Server error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createContest = createContest;
/**
 * Participate in a contest.
 */
var participateInContest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, contestId, machineId, userId, contest, currentTime, existingParticipation, newParticipation, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, contestId = _a.contestId, machineId = _a.machineId;
                userId = res.locals.jwtData.id;
                return [4 /*yield*/, Contest_1.default.findById(contestId)];
            case 1:
                contest = _b.sent();
                if (!contest) {
                    res.status(404).json({ msg: 'Contest not found.' });
                    return [2 /*return*/];
                }
                currentTime = new Date();
                if (currentTime < contest.startTime || currentTime > contest.endTime) {
                    res.status(400).json({ msg: 'Contest is not active.' });
                    return [2 /*return*/];
                }
                // Check if machine is part of the contest
                if (!contest.machines.includes(machineId)) {
                    res.status(400).json({ msg: 'Machine not part of the contest.' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, ContestParticipation_1.default.findOne({ user: userId, contest: contestId, machine: machineId })];
            case 2:
                existingParticipation = _b.sent();
                if (existingParticipation) {
                    res.status(400).json({ msg: 'Already participated in this contest for this machine.' });
                    return [2 /*return*/];
                }
                newParticipation = new ContestParticipation_1.default({
                    user: userId,
                    contest: contestId,
                    machine: machineId
                });
                return [4 /*yield*/, newParticipation.save()];
            case 3:
                _b.sent();
                res.status(201).json({ msg: 'Participation successful.', participation: newParticipation });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error('Error participating in contest:', error_2);
                res.status(500).send('Server error');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.participateInContest = participateInContest;
/**
 * Submit a flag for a contest.
 */
var submitFlagForContest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, contestId, machineId, flag, userId, contest, currentTime, machine, participation, isMatch, timeTaken, hintsUsed, expEarned, user, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                _a = req.body, contestId = _a.contestId, machineId = _a.machineId, flag = _a.flag;
                userId = res.locals.jwtData.id;
                return [4 /*yield*/, Contest_1.default.findById(contestId)];
            case 1:
                contest = _b.sent();
                if (!contest) {
                    res.status(404).json({ msg: 'Contest not found.' });
                    return [2 /*return*/];
                }
                currentTime = new Date();
                if (currentTime < contest.startTime || currentTime > contest.endTime) {
                    res.status(400).json({ msg: 'Contest is not active.' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Machine_1.default.findById(machineId)];
            case 2:
                machine = _b.sent();
                if (!machine) {
                    res.status(404).json({ msg: 'Machine not found.' });
                    return [2 /*return*/];
                }
                // Verify if the machine is part of the contest
                if (!contest.machines.includes(machineId)) {
                    res.status(400).json({ msg: 'Machine not part of the contest.' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, ContestParticipation_1.default.findOne({ user: userId, contest: contestId, machine: machineId })];
            case 3:
                participation = _b.sent();
                if (!participation) {
                    res.status(400).json({ msg: 'Participation not found. Please participate first.' });
                    return [2 /*return*/];
                }
                // Ensure that the contest has started for this participation
                if (!participation.participationStartTime) {
                    res.status(400).json({ msg: 'Contest has not started yet. Please wait until the instance is running.' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(flag, machine.flag)];
            case 4:
                isMatch = _b.sent();
                if (!isMatch) {
                    res.status(400).json({ msg: 'Incorrect flag.' });
                    return [2 /*return*/];
                }
                timeTaken = (currentTime.getTime() - participation.participationStartTime.getTime()) / 1000;
                hintsUsed = participation.hintsUsed;
                expEarned = contest.contestExp;
                expEarned -= Math.floor(timeTaken / 60); // Reduce 1 EXP per minute taken
                expEarned -= hintsUsed * 5; // Reduce 5 EXP per hint used
                if (expEarned < 0)
                    expEarned = 0;
                participation.participationEndTime = currentTime;
                participation.expEarned = expEarned;
                return [4 /*yield*/, participation.save()];
            case 5:
                _b.sent();
                return [4 /*yield*/, User_1.default.findById(userId)];
            case 6:
                user = _b.sent();
                if (!user) return [3 /*break*/, 9];
                user.exp += expEarned;
                return [4 /*yield*/, user.updateLevel()];
            case 7:
                _b.sent(); // Assuming updateLevel is properly typed
                return [4 /*yield*/, user.save()];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9:
                res.status(200).json({ msg: 'Flag accepted.', expEarned: expEarned, totalExp: user === null || user === void 0 ? void 0 : user.exp });
                return [3 /*break*/, 11];
            case 10:
                error_3 = _b.sent();
                console.error('Error submitting flag for contest:', error_3);
                res.status(500).send('Server error');
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.submitFlagForContest = submitFlagForContest;
/**
 * Use a hint in a contest.
 */
var useHintInContest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, contestId, machineId, userId, participation, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, contestId = _a.contestId, machineId = _a.machineId;
                userId = res.locals.jwtData.id;
                return [4 /*yield*/, ContestParticipation_1.default.findOne({ user: userId, contest: contestId, machine: machineId })];
            case 1:
                participation = _b.sent();
                if (!participation) {
                    res.status(400).json({ msg: 'Participation not found.' });
                    return [2 /*return*/];
                }
                participation.hintsUsed += 1;
                return [4 /*yield*/, participation.save()];
            case 2:
                _b.sent();
                res.status(200).json({ msg: 'Hint used.', hintsUsed: participation.hintsUsed });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                console.error('Error using hint in contest:', error_4);
                res.status(500).send('Server error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.useHintInContest = useHintInContest;
/**
 * Update an existing contest.
 */
var updateContest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contestId, _a, name_2, description, startTime, endTime, machines, contestExp, contest, machineDocs, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                contestId = req.params.contestId;
                _a = req.body, name_2 = _a.name, description = _a.description, startTime = _a.startTime, endTime = _a.endTime, machines = _a.machines, contestExp = _a.contestExp;
                return [4 /*yield*/, Contest_1.default.findById(contestId)];
            case 1:
                contest = _b.sent();
                if (!contest) {
                    res.status(404).json({ msg: 'Contest not found.' });
                    return [2 /*return*/];
                }
                // Set existing startTime for validation if not provided
                if (!startTime && endTime) {
                    req.body.startTime = contest.startTime;
                }
                if (!machines) return [3 /*break*/, 3];
                return [4 /*yield*/, Machine_1.default.find({ _id: { $in: machines } })];
            case 2:
                machineDocs = _b.sent();
                if (machineDocs.length !== machines.length) {
                    res.status(400).json({ msg: 'One or more machines are invalid.' });
                    return [2 /*return*/];
                }
                contest.machines = machines;
                _b.label = 3;
            case 3:
                // Update other fields if provided
                if (name_2)
                    contest.name = name_2;
                if (description)
                    contest.description = description;
                if (startTime)
                    contest.startTime = startTime;
                if (endTime)
                    contest.endTime = endTime;
                if (contestExp !== undefined)
                    contest.contestExp = contestExp;
                return [4 /*yield*/, contest.save()];
            case 4:
                _b.sent();
                res.status(200).json({ msg: 'Contest updated successfully.', contest: contest });
                return [3 /*break*/, 6];
            case 5:
                error_5 = _b.sent();
                console.error('Error updating contest:', error_5);
                res.status(500).send('Server error');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateContest = updateContest;
/**
 * Delete a contest.
 */
var deleteContest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contestId, contest, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                contestId = req.params.contestId;
                return [4 /*yield*/, Contest_1.default.findById(contestId)];
            case 1:
                contest = _a.sent();
                if (!contest) {
                    res.status(404).json({ msg: 'Contest not found.' });
                    return [2 /*return*/];
                }
                // Delete all participations related to this contest
                return [4 /*yield*/, ContestParticipation_1.default.deleteMany({ contest: contestId })];
            case 2:
                // Delete all participations related to this contest
                _a.sent();
                // Delete the contest
                return [4 /*yield*/, Contest_1.default.findByIdAndDelete(contestId)];
            case 3:
                // Delete the contest
                _a.sent();
                res.status(200).json({ msg: 'Contest and related participations deleted successfully.' });
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                console.error('Error deleting contest:', error_6);
                res.status(500).send('Server error');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteContest = deleteContest;
