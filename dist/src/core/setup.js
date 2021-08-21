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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSetupData = void 0;
var path_1 = __importDefault(require("path"));
var inquire_1 = require("./inquire");
var fs_1 = __importDefault(require("fs"));
var utils_1 = require("./utils");
var locale_1 = __importDefault(require("../../locale"));
var getSetupData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var projectPath, projectDotEnvPath, setupData, _a, locale, subFolders, _i, _b, subFolder, subFolderPath, githubToken, username;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                projectPath = path_1.default.resolve(process.cwd());
                projectDotEnvPath = path_1.default.resolve(projectPath, '.env.json');
                _a = [{}];
                return [4 /*yield*/, utils_1.loadJSONFile(projectDotEnvPath)];
            case 1:
                setupData = __assign.apply(void 0, _a.concat([(_c.sent())]));
                return [4 /*yield*/, locale_1.default()
                    // * subFolders
                ];
            case 2:
                locale = _c.sent();
                if (!(!setupData.subFolders || setupData.subFolders.length === 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, inquire_1.inquirer.prompt({
                        type: 'input',
                        name: 'subFolders',
                        message: locale.pleaseEnterUsername()
                    })];
            case 3:
                subFolders = (_c.sent()).subFolders;
                setupData.subFolders = subFolders.split(' ').join('').split(',');
                _c.label = 4;
            case 4:
                // TODO Initiate Sub Folders
                for (_i = 0, _b = setupData.subFolders; _i < _b.length; _i++) {
                    subFolder = _b[_i];
                    subFolderPath = path_1.default.resolve(projectPath, subFolder);
                    if (!fs_1.default.existsSync(subFolderPath))
                        fs_1.default.mkdirSync(subFolderPath);
                }
                if (!(!setupData.githubToken || setupData.githubToken.length === 0)) return [3 /*break*/, 7];
                return [4 /*yield*/, utils_1.animateText(locale.messageOfNeedToken())];
            case 5:
                _c.sent();
                return [4 /*yield*/, inquire_1.inquirer.prompt({
                        type: 'password',
                        mask: '*',
                        name: 'githubToken',
                        message: locale.messageOfSubFolders()
                    })];
            case 6:
                githubToken = (_c.sent()).githubToken;
                setupData.githubToken = githubToken;
                _c.label = 7;
            case 7:
                if (!(!setupData.githubUserName || setupData.githubUserName.length === 0)) return [3 /*break*/, 9];
                return [4 /*yield*/, inquire_1.inquirer.prompt({
                        type: 'input',
                        name: 'username',
                        message: locale.pleaseEnterUsername()
                    })];
            case 8:
                username = (_c.sent()).username;
                setupData.githubUserName = username;
                _c.label = 9;
            case 9:
                fs_1.default.writeFileSync(projectDotEnvPath, JSON.stringify(setupData, null, 2));
                return [2 /*return*/, setupData];
        }
    });
}); };
exports.getSetupData = getSetupData;
exports.default = exports.getSetupData;
