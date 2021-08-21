"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var en = {
    messageOfNeedToken: "Access token is required for GitHub repo clone.\nHow to get a GitHub Access Token: (URL)\nhttps://git.io/JsPkj",
    messageOfClone: "\nThe project must download the polyrepos in GitHub for execution.\nThe total number of polyrepos to clone is {count:number}.\n\nNew incoming polyrepo list: {list:string}",
    messageOfSubFolders: "Please enter at least one polyrepo category.\ne.g.: frontend, backend, release\n\nEach category folder is created at the top,\nand you can add a polyrepo to the sub-path.\n\nYou can type multiple folders by separating them with \",\"\n\nPolyrepo category:\n",
    pleaseEnterGithubCLIToken: 'Please enter the GitHub CLI token.',
    pleaseEnterUsername: 'Please enter GitHub user name. (NOT EMAIL)',
    selectCommandWantToExecute: 'Please select the project command you want to use.\nIf you select a command, it will be executed.\n',
    runningCommand: 'Running... "{title:string}"',
    shallWeClone: 'Do you want to clone the project?',
    commandPull: 'Update the entire local repos from the GitHub (pull)',
    downloadingPolyrepos: '"{packageName:string}" Downloading polyrepos...'
};
exports.default = en;
