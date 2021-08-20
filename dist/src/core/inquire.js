"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inquirer = void 0;
var inquirer_1 = __importDefault(require("inquirer"));
exports.inquirer = inquirer_1.default;
var inquirer_search_list_1 = __importDefault(require("inquirer-search-list"));
inquirer_1.default.registerPrompt('search-list', inquirer_search_list_1.default);
