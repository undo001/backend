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
exports.deleteMachine = exports.updateMachine = exports.getMachine = exports.getAllMachines = exports.createMachine = void 0;
var Machine_1 = require("../models/Machine");
var bcrypt_1 = require("bcrypt");
/**
 * Create a new machine.
 */
var createMachine = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, category, info, exp, amiId, flag, existingMachine, saltRounds, hashedFlag, newMachine, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, name_1 = _a.name, category = _a.category, info = _a.info, exp = _a.exp, amiId = _a.amiId, flag = _a.flag;
                // Validate required fields
                if (!name_1 || !category || !amiId || !flag) {
                    res.status(400).json({ msg: 'Please provide name, category, amiId, and flag.' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Machine_1.default.findOne({ name: name_1 })];
            case 1:
                existingMachine = _b.sent();
                if (existingMachine) {
                    res.status(400).json({ msg: 'Machine with this name already exists.' });
                    return [2 /*return*/];
                }
                saltRounds = 10;
                return [4 /*yield*/, bcrypt_1.default.hash(flag, saltRounds)];
            case 2:
                hashedFlag = _b.sent();
                newMachine = new Machine_1.default({
                    name: name_1,
                    category: category,
                    info: info,
                    exp: exp,
                    amiId: amiId,
                    flag: hashedFlag, // Assign the hashed flag
                });
                return [4 /*yield*/, newMachine.save()];
            case 3:
                _b.sent();
                res.status(201).json({ msg: 'Machine created successfully.', machine: newMachine });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error('Error creating machine:', error_1);
                res.status(500).send('Server error');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createMachine = createMachine;
/**
 * Get all machines.
 */
var getAllMachines = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var machines, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Machine_1.default.find({})];
            case 1:
                machines = _a.sent();
                res.json({ machines: machines });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching machines:', error_2);
                res.status(500).send('Server error');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllMachines = getAllMachines;
/**
 * Get a single machine by ID.
 */
var getMachine = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var machineName, machine, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                machineName = req.params.machineName;
                console.log(machineName);
                return [4 /*yield*/, Machine_1.default.findOne({ name: machineName })];
            case 1:
                machine = _a.sent();
                if (!machine) {
                    res.status(404).json({ msg: 'Machine not found.' });
                    return [2 /*return*/];
                }
                res.json({ machine: machine });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error fetching machine:', error_3);
                res.status(500).send('Server error');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMachine = getMachine;
/**
 * Update a machine by ID.
 */
var updateMachine = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var machineId, _a, name_2, category, info, exp, amiId, flag, machine, saltRounds, hashedFlag, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                machineId = req.params.machineId;
                _a = req.body, name_2 = _a.name, category = _a.category, info = _a.info, exp = _a.exp, amiId = _a.amiId, flag = _a.flag;
                return [4 /*yield*/, Machine_1.default.findById(machineId)];
            case 1:
                machine = _b.sent();
                if (!machine) {
                    res.status(404).json({ msg: 'Machine not found.' });
                    return [2 /*return*/];
                }
                // Update fields if provided
                if (name_2)
                    machine.name = name_2;
                if (category)
                    machine.category = category;
                if (info)
                    machine.info = info;
                if (exp !== undefined)
                    machine.exp = exp;
                if (amiId)
                    machine.amiId = amiId;
                if (!flag) return [3 /*break*/, 3];
                saltRounds = 10;
                return [4 /*yield*/, bcrypt_1.default.hash(flag, saltRounds)];
            case 2:
                hashedFlag = _b.sent();
                machine.flag = hashedFlag;
                _b.label = 3;
            case 3: // Update flag if provided
            return [4 /*yield*/, machine.save()];
            case 4:
                _b.sent();
                res.json({ msg: 'Machine updated successfully.', machine: machine });
                return [3 /*break*/, 6];
            case 5:
                error_4 = _b.sent();
                console.error('Error updating machine:', error_4);
                res.status(500).send('Server error');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateMachine = updateMachine;
/**
 * Delete a machine by ID.
 */
var deleteMachine = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var machineId, machine, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                machineId = req.params.machineId;
                return [4 /*yield*/, Machine_1.default.findByIdAndDelete(machineId)];
            case 1:
                machine = _a.sent();
                if (!machine) {
                    res.status(404).json({ msg: 'Machine not found.' });
                    return [2 /*return*/];
                }
                res.json({ msg: 'Machine deleted successfully.' });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error deleting machine:', error_5);
                res.status(500).send('Server error');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteMachine = deleteMachine;
