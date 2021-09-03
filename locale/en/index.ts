import type { BaseTranslation } from 'typesafe-i18n'

const en: BaseTranslation = {
  messageOfNeedToken: `Access token is required for GitHub repo clone.
How to get a GitHub Access Token: (URL)
https://git.io/JsPkj`,

  messageOfClone: `
The project must download the polyrepos in GitHub for execution.
The total number of polyrepos to clone is {count:number}.

New incoming polyrepo list: {list:string}`,

  messageOfSubFolders: `Please enter at least one polyrepo category.
e.g.: frontend, backend, release

Each category folder is created at the top,
and you can add a polyrepo to the sub-path.

You can type multiple folders by separating them with ","

Polyrepo category:
`,

  pleaseEnterGithubCLIToken: 'Please enter the GitHub CLI token.',
  pleaseEnterUsername: 'Please enter GitHub user name. (NOT EMAIL)',

  afterFirstInitWelcome: `Polyrepo initial setup and structure creation are complete.
You can add polyrepo and add or excute project commands.
Please enter "npm start" to run the project manager.`,

  selectCommandWantToExecute:
    'Please select the project command you want to use.\nIf you select a command, it will be executed.\n',
  runningCommand: 'Running... "{title:string}"',

  shallWeClone: 'Do you want to clone the project?',
  commandPull: 'Update the entire local repos from the GitHub (pull)',
  downloadingPolyrepos: '"{packageName:string}" Downloading polyrepos...',

  detectedNonInteractiveTerminal: `The terminal does not appear to support interaction.
Interactive terminals are needed for smooth execution.

For Windows, the recommended installation methods are as follows:
1. git-bash install: https://git.io/JENSe
2. hyper install: https://git.io/JEN7V
3. hyper setup: https://bit.ly/hyper-setup`,

  commandAddScript: 'Add Project Command (add-script)',
  pleaseSelectShellScriptFolderName: `Enter the name of the folder where the shellscript files
for the project will be contained (default: sh)`,
  pleaseEnterScriptFileName:
    'Please enter the name of the script file you want to create. (e.g. my-script-file)',
  pleaseEnterScriptTitle:
    'Please enter the name of the script command to be displayed. (e.g., 🍉 Run build script)',
  isItEntryScript:
    'Do you want this command to be executed automatically on initial project installation?',
  scriptFileCreated: `"{title:string}" Command added successfully.
Open the script file to configure the command.
Script file path: {scriptPath:string}`
}

export default en
