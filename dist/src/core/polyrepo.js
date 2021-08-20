"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.init = exports.getPackages = exports.getRepos = void 0;
var path_1 = __importDefault(require("path"));
var promises_1 = __importDefault(require("fs/promises"));
var utils_1 = require("./utils");
var inquire_1 = require("./inquire");
var setup_1 = __importDefault(require("./setup"));
var github = __importStar(require("./github"));
var locale_1 = __importDefault(require("locale"));
var projectPath = path_1.default.resolve(process.cwd());
var targetProjectPaths = ['frontend', 'backend', 'release'].map(function (name) {
    return path_1.default.resolve(projectPath, name);
});
var getRepos = function (projectPath) { return __awaiter(void 0, void 0, void 0, function () {
    var listJSON, _a, _b, _c, packageList, packagePath, packageFolders, e_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _b = (_a = JSON).parse;
                _c = String;
                return [4 /*yield*/, promises_1.default.readFile(path_1.default.join(projectPath, 'list.json'))];
            case 1:
                listJSON = _b.apply(_a, [_c.apply(void 0, [_d.sent()])]);
                packageList = Object.keys(listJSON.package);
                packagePath = path_1.default.join(projectPath, 'package');
                return [4 /*yield*/, promises_1.default.readdir(packagePath, {
                        withFileTypes: true
                    })];
            case 2:
                packageFolders = (_d.sent())
                    .filter(function (e) { return e.isDirectory(); })
                    .map(function (e) { return e.name; });
                return [2 /*return*/, {
                        package: listJSON.package,
                        packageList: packageList,
                        packageFolders: packageFolders,
                        packagePath: packagePath
                    }];
            case 3:
                e_1 = _d.sent();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, null];
        }
    });
}); };
exports.getRepos = getRepos;
var getPackages = function () { return __awaiter(void 0, void 0, void 0, function () {
    var packages, _i, targetProjectPaths_1, targetProjectPath, repos, _a, _b, packageName;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                packages = [];
                _i = 0, targetProjectPaths_1 = targetProjectPaths;
                _c.label = 1;
            case 1:
                if (!(_i < targetProjectPaths_1.length)) return [3 /*break*/, 4];
                targetProjectPath = targetProjectPaths_1[_i];
                return [4 /*yield*/, exports.getRepos(targetProjectPath)];
            case 2:
                repos = _c.sent();
                if (!repos)
                    return [3 /*break*/, 3];
                for (_a = 0, _b = repos.packageList; _a < _b.length; _a++) {
                    packageName = _b[_a];
                    if (repos.packageFolders.includes(packageName)) {
                        packages.push({
                            packageName: packageName,
                            packagePath: repos.packagePath,
                            url: repos.package[packageName].url
                        });
                    }
                }
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, packages];
        }
    });
}); };
exports.getPackages = getPackages;
var init = function () { return __awaiter(void 0, void 0, void 0, function () {
    var locale, needToInitProjects, _i, targetProjectPaths_2, targetProjectPath, repos, _a, _b, packageName, isProceed, _c, githubToken, githubUserName, _d, needToInitProjects_1, _e, packageName, packagePath, url, branch;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, locale_1.default()];
            case 1:
                locale = _f.sent();
                needToInitProjects = [];
                _i = 0, targetProjectPaths_2 = targetProjectPaths;
                _f.label = 2;
            case 2:
                if (!(_i < targetProjectPaths_2.length)) return [3 /*break*/, 5];
                targetProjectPath = targetProjectPaths_2[_i];
                return [4 /*yield*/, exports.getRepos(targetProjectPath)];
            case 3:
                repos = _f.sent();
                if (!repos)
                    return [3 /*break*/, 4];
                for (_a = 0, _b = repos.packageList; _a < _b.length; _a++) {
                    packageName = _b[_a];
                    if (!repos.packageFolders.includes(packageName)) {
                        needToInitProjects.push({
                            packageName: packageName,
                            packagePath: repos.packagePath,
                            url: repos.package[packageName].url,
                            branch: repos.package[packageName].branch
                        });
                    }
                }
                _f.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                if (needToInitProjects.length === 0)
                    return [2 /*return*/];
                return [4 /*yield*/, utils_1.animateText(locale.messageOfClone({
                        count: needToInitProjects.length,
                        list: needToInitProjects.map(function (e) { return "\"" + e.packageName + "\""; }).join(', ')
                    }) + "\n")];
            case 6:
                _f.sent();
                return [4 /*yield*/, inquire_1.inquirer.prompt({
                        type: 'confirm',
                        name: 'isProceed',
                        message: locale.shallWeClone()
                    })];
            case 7:
                isProceed = (_f.sent()).isProceed;
                if (!isProceed)
                    return [2 /*return*/];
                return [4 /*yield*/, setup_1.default()];
            case 8:
                _c = _f.sent(), githubToken = _c.githubToken, githubUserName = _c.githubUserName;
                _d = 0, needToInitProjects_1 = needToInitProjects;
                _f.label = 9;
            case 9:
                if (!(_d < needToInitProjects_1.length)) return [3 /*break*/, 12];
                _e = needToInitProjects_1[_d], packageName = _e.packageName, packagePath = _e.packagePath, url = _e.url, branch = _e.branch;
                return [4 /*yield*/, github.clone({
                        cwd: packagePath,
                        githubToken: githubToken,
                        githubUserName: githubUserName,
                        name: packageName,
                        branch: branch,
                        url: url,
                        onMessage: function (message) { return console.log(message); },
                        onError: function (message) { return console.log(message); },
                        onErrorMessage: function (message) { return console.log(message); }
                    })];
            case 10:
                _f.sent();
                _f.label = 11;
            case 11:
                _d++;
                return [3 /*break*/, 9];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.init = init;
exports.default = exports.init;
