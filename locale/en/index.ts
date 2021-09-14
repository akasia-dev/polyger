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
Please enter "npm start" to run the polyrepo manager.`,

  selectCommandWantToExecute:
    'Please select the project command you want to use.\nIf you select a command, it will be executed.\n',
  runningCommand: 'Running... "{title:string}"',

  shallWeClone: 'Do you want to clone the project?',
  commandPull:
    '[polyger] Update the entire local poyrepos from the GitHub (pull)',
  downloadingPolyrepos: '"{packageName:string}" Downloading polyrepos...',

  detectedNonInteractiveTerminal: `The terminal does not appear to support interaction.
Interactive terminals are needed for smooth execution.

For Windows, the recommended installation methods are as follows:
1. git-bash install: https://git.io/JENSe
2. hyper install: https://git.io/JEN7V
3. hyper setup: https://bit.ly/hyper-setup`,

  commandAddScript: '[polyger] Add Project Command (add-script)',
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
Script file path: {scriptPath:string}`,

  commandAddPolyRepo: `[polyger] Add a polyrepo (add-polyrepo)`,
  pleaseSelectSubFolder: 'Please select a category to save the polyrepo.',
  pleaseEnterRepoUrl: `Please enter the URL of the polyrepo. (e.g. github.com/akasia-dev/polyger.git)`,
  pleaseEnterRepoBranch: `Please enter the branch name of the polyrepo. (e.g. main)`,
  pleaseEnterRepoFolderName: `Please enter the name of the folder where the polyrepo will be stored (e.g., polyger-main))`,

  commandCreatePolyRepo: `[polyger] Create a polyrepo in the GitHub (create-polyrepo)`,
  pleaseSelectOrganization: `Please choose the location in the GitHub where you want to create the repo.`,
  pleaseInputRepoName: `Please enter the name of the reformer you want to create.`,
  isItPrivateRepo: `Do you want to create as a private repo?`,
  failedGithubApiFetch: `A problem occurred during the GitHub API call. Please check the token permission and network status.`,
  itAlreadyExistRepositoryCouldYouCloneIt: `It's a repo that already exists. shall we clone it?(Y) or should stop?(N)`,
  pleaseTypeRepoDescription: `Please fill out the description of the repo. (will be uploaded on Github)`,
  successfullyCreatedRepository: `Successfully created the repository in github.`,

  isThisRelatedOfMe: `Is it a repo that I have access to on my account? (My personal repo and in-group repo are Y)`,
  pleaseEnterRepoAccountName: `Please enter the GitHub ID or organization ID to download the repo.`,
  isThisOrganization: `Is it a GitHub organization? (Y) or a personal repo? (N)`,

  commandAddSubmodule: `[polyger] Add a submodule (add-submodule)`,
  pleaseSelectCategoryToCreateSubmodule: `Please select a category to create a submodule.`,
  pleaseSelectProjectToCreateSubmodule: `Please select a project to create a submodule.`,
  pleaseEnterDetailSubmodulePathToSave: `Please enter the detailed path in the folder where the submodule will be created. (e.g. lib/some-module)`,
  pleaseSelectGitProjectAsSubmodule: `Please select the Git project you want to receive as a submodule.`,
  polyrepoIsEmptyPleaseAddOne: `No polyrepo added to the category exists.\nFirst, please add the polyrepo to the category.`,

  commandDeleteSubmodule: `[polyger] Delete submodule (delete-submodule)`,
  pleaseSelectCategoryToDeleteSubmodule: `Please select the category of the project containing the submodule you want to delete.`,
  pleaseSelectProjectToDeleteSubmodule: `Please select a project containing the submodule you want to delete.`,
  pleaseEnterDetailSubmodulePathToDelete: `Please select the submodule you want to delete.`,
  submoduleDoesntExist: `Submodules do not exist in the project.`
}

export default en
