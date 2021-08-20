"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localCommands = void 0;
var pull_1 = __importDefault(require("./pull"));
var localCommands = [];
exports.localCommands = localCommands;
pull_1.default(localCommands);
