"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.deleteInstance = exports.getInstanceDetails = exports.getAllInstances = exports.submitFlag = exports.receiveVpnIp = exports.startInstance = void 0;
var client_ec2_1 = require("@aws-sdk/client-ec2");
var bcrypt_1 = require("bcrypt");
var Instance_1 = require("../models/Instance");
var Machine_1 = require("../models/Machine");
var User_1 = require("../models/User");
var config_1 = require("../config/config");
// Configure AWS SDK v3
var ec2Client = new client_ec2_1.EC2Client({
    region: config_1.default.aws.region,
    credentials: {
        accessKeyId: config_1.default.aws.accessKeyId,
        secretAccessKey: config_1.default.aws.secretAccessKey,
    },
});
/**
 * Start an EC2 instance based on user's machine selection.
 */
var startInstance = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var machineId, user, machine, ImageId, params, runCommand, data, instanceId, newInstance, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                machineId = req.params.machineId;
                return [4 /*yield*/, User_1.default.findById(res.locals.jwtData.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json("User not registered / token malfunctioned")];
                }
                return [4 /*yield*/, Machine_1.default.findById(machineId)];
            case 2:
                machine = _a.sent();
                if (!machine) {
                    res.status(400).json({ msg: 'Invalid machine ID selected' });
                    return [2 /*return*/];
                }
                ImageId = machine.amiId;
                params = {
                    ImageId: ImageId,
                    InstanceType: client_ec2_1._InstanceType.t2_micro, // Use the enum for InstanceType
                    MinCount: 1,
                    MaxCount: 1,
                    SecurityGroupIds: [config_1.default.aws.securityGroupId], // Add your Security Group ID here
                    TagSpecifications: [
                        {
                            ResourceType: 'instance',
                            Tags: [{ Key: 'User', Value: user.id }],
                        },
                    ],
                };
                runCommand = new client_ec2_1.RunInstancesCommand(__assign(__assign({}, params), { TagSpecifications: [
                        {
                            ResourceType: 'instance',
                            Tags: [{ Key: 'User', Value: user.id }],
                        },
                    ] }));
                return [4 /*yield*/, ec2Client.send(runCommand)];
            case 3:
                data = _a.sent();
                if (!data.Instances || data.Instances.length === 0 || !data.Instances[0].InstanceId) {
                    res.status(500).json({ msg: 'Failed to create instance' });
                    return [2 /*return*/];
                }
                instanceId = data.Instances[0].InstanceId;
                newInstance = new Instance_1.default({
                    user: user.id,
                    instanceId: instanceId,
                    machineType: machine.name,
                });
                return [4 /*yield*/, newInstance.save()];
            case 4:
                _a.sent();
                res.json({ msg: 'Instance is being created', instanceId: instanceId });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                console.error('Error starting instance:', error_1);
                res.status(500).send('Server error');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.startInstance = startInstance;
/**
 * Handle receiving VPN IP and updating instance status to 'running'.
 */
var receiveVpnIp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, instanceId, vpnIp, instance, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, instanceId = _a.instanceId, vpnIp = _a.vpnIp;
                console.log(instanceId, vpnIp);
                return [4 /*yield*/, Instance_1.default.findOne({ instanceId: instanceId })];
            case 1:
                instance = _b.sent();
                if (!instance) {
                    res.status(404).json({ msg: 'Instance not found' });
                    return [2 /*return*/];
                }
                // Update instance with VPN IP and status
                instance.vpnIp = vpnIp;
                instance.status = 'running';
                return [4 /*yield*/, instance.save()];
            case 2:
                _b.sent();
                res.json({ msg: 'VPN IP updated successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error('Error receiving VPN IP:', error_2);
                res.status(500).send('Server error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.receiveVpnIp = receiveVpnIp;
/**
 * Handle flag submission, terminate instance, and clean up.
 */
var submitFlag = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var instanceId, flag, user, isValidFlag, instance, terminateParams, terminateCommand, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                instanceId = req.params.instanceId;
                flag = req.body.flag;
                return [4 /*yield*/, User_1.default.findById(res.locals.jwtData.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json("User not registered / token malfunctioned")];
                }
                return [4 /*yield*/, validateFlag(flag, user.id, instanceId)];
            case 2:
                isValidFlag = _a.sent();
                if (!isValidFlag) {
                    res.status(400).json({ msg: 'Invalid flag' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Instance_1.default.findOne({ instanceId: instanceId, user: user.id })];
            case 3:
                instance = _a.sent();
                if (!instance) {
                    res.status(404).json({ msg: 'Instance not found' });
                    return [2 /*return*/];
                }
                terminateParams = {
                    InstanceIds: [instanceId],
                };
                terminateCommand = new client_ec2_1.TerminateInstancesCommand(terminateParams);
                return [4 /*yield*/, ec2Client.send(terminateCommand)];
            case 4:
                _a.sent();
                // Update instance status in DB
                instance.status = 'terminated';
                return [4 /*yield*/, instance.save()];
            case 5:
                _a.sent();
                // Optionally, delete the instance record from DB
                return [4 /*yield*/, Instance_1.default.deleteOne({ instanceId: instanceId })];
            case 6:
                // Optionally, delete the instance record from DB
                _a.sent();
                res.json({ msg: 'Flag accepted. Instance terminated.' });
                return [3 /*break*/, 8];
            case 7:
                error_3 = _a.sent();
                console.error('Error submitting flag:', error_3);
                res.status(500).send('Server error');
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.submitFlag = submitFlag;
/**
 * Get details of all instances.
 */
var getAllInstances = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, instances, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, User_1.default.findById(res.locals.jwtData.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json("User not registered / token malfunctioned")];
                }
                return [4 /*yield*/, Instance_1.default.find({ user: user.id })];
            case 2:
                instances = _a.sent();
                res.json(instances);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error('Error fetching all instances:', error_4);
                res.status(500).send('Server error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAllInstances = getAllInstances;
/**
 * Get details of a specific instance.
 */
var getInstanceDetails = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var instanceId, user, instance, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                instanceId = req.params.instanceId;
                return [4 /*yield*/, User_1.default.findById(res.locals.jwtData.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json("User not registered / token malfunctioned")];
                }
                return [4 /*yield*/, Instance_1.default.findOne({ instanceId: instanceId, user: user.id })];
            case 2:
                instance = _a.sent();
                if (!instance) {
                    res.status(404).json({ msg: 'Instance not found' });
                    return [2 /*return*/];
                }
                res.json(instance);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error('Error fetching instance details:', error_5);
                res.status(500).send('Server error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getInstanceDetails = getInstanceDetails;
/**
 * Delete a specific instance.
 */
var deleteInstance = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var instanceId, user, instance, terminateParams, terminateCommand, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                instanceId = req.params.instanceId;
                return [4 /*yield*/, User_1.default.findById(res.locals.jwtData.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json("User not registered / token malfunctioned")];
                }
                return [4 /*yield*/, Instance_1.default.findOne({ instanceId: instanceId, user: user.id })];
            case 2:
                instance = _a.sent();
                if (!instance) {
                    res.status(404).json({ msg: 'Instance not found' });
                    return [2 /*return*/];
                }
                terminateParams = {
                    InstanceIds: [instanceId],
                };
                terminateCommand = new client_ec2_1.TerminateInstancesCommand(terminateParams);
                return [4 /*yield*/, ec2Client.send(terminateCommand)];
            case 3:
                _a.sent();
                // Update instance status in DB
                instance.status = 'terminated';
                return [4 /*yield*/, instance.save()];
            case 4:
                _a.sent();
                // Optionally, delete the instance record from DB
                return [4 /*yield*/, Instance_1.default.deleteOne({ instanceId: instanceId })];
            case 5:
                // Optionally, delete the instance record from DB
                _a.sent();
                res.json({ msg: 'Instance terminated and deleted successfully.' });
                return [3 /*break*/, 7];
            case 6:
                error_6 = _a.sent();
                console.error('Error deleting instance:', error_6);
                res.status(500).send('Server error');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.deleteInstance = deleteInstance;
/**
 * Validate the submitted flag.
 */
var validateFlag = function (flag, userId, instanceId) { return __awaiter(void 0, void 0, void 0, function () {
    var instance, machine, isMatch, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, Instance_1.default.findOne({ instanceId: instanceId, user: userId })];
            case 1:
                instance = _a.sent();
                if (!instance) {
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, Machine_1.default.findOne({ name: instance.machineType })];
            case 2:
                machine = _a.sent();
                if (!machine) {
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(flag, machine.flag)];
            case 3:
                isMatch = _a.sent();
                return [2 /*return*/, isMatch];
            case 4:
                error_7 = _a.sent();
                console.error('Error validating flag:', error_7);
                return [2 /*return*/, false];
            case 5: return [2 /*return*/];
        }
    });
}); };
