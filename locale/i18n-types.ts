// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */

import type { LocalizedString } from 'typesafe-i18n'

export type BaseLocale = 'en'

export type Locales =
	| 'en'
	| 'ko'

export type Translation = {
	/**
	 * Access token is required for GitHub repo clone.
How to get a GitHub Access Token: (URL)
https://git.io/JsPkj
	 */
	'messageOfNeedToken': string
	/**
	 * 
The project must download the polyrepos in GitHub for execution.
The total number of polyrepos to clone is {count}.

New incoming polyrepo list: {list}
	 * @param {number} count
	 * @param {string} list
	 */
	'messageOfClone': RequiredParams2<'count', 'list'>
	/**
	 * Please enter at least one polyrepo category.
e.g.: frontend, backend, release

Each category folder is created at the top,
and you can add a polyrepo to the sub-path.

You can type multiple folders by separating them with ","

Polyrepo category:

	 */
	'messageOfSubFolders': string
	/**
	 * Please enter the GitHub CLI token.
	 */
	'pleaseEnterGithubCLIToken': string
	/**
	 * Please enter GitHub user name. (NOT EMAIL)
	 */
	'pleaseEnterUsername': string
	/**
	 * Polyrepo initial setup and structure creation are complete.
You can add polyrepo and add or excute project commands.
Please enter "npm start" to run the polyrepo manager.
	 */
	'afterFirstInitWelcome': string
	/**
	 * Please select the project command you want to use.
If you select a command, it will be executed.

	 */
	'selectCommandWantToExecute': string
	/**
	 * Running... "{title}"
	 * @param {string} title
	 */
	'runningCommand': RequiredParams1<'title'>
	/**
	 * Do you want to clone the project?
	 */
	'shallWeClone': string
	/**
	 * Update the entire local poyrepos from the GitHub (pull)
	 */
	'commandPull': string
	/**
	 * "{packageName}" Downloading polyrepos...
	 * @param {string} packageName
	 */
	'downloadingPolyrepos': RequiredParams1<'packageName'>
	/**
	 * The terminal does not appear to support interaction.
Interactive terminals are needed for smooth execution.

For Windows, the recommended installation methods are as follows:
1. git-bash install: https://git.io/JENSe
2. hyper install: https://git.io/JEN7V
3. hyper setup: https://bit.ly/hyper-setup
	 */
	'detectedNonInteractiveTerminal': string
	/**
	 * Add project command (add-script)
	 */
	'commandAddScript': string
	/**
	 * Enter the name of the folder where the shellscript files
for the project will be contained (default: sh)
	 */
	'pleaseSelectShellScriptFolderName': string
	/**
	 * Please enter the name of the script file you want to create. (e.g. my-script-file)
	 */
	'pleaseEnterScriptFileName': string
	/**
	 * Please enter the name of the script command to be displayed. (e.g., 🍉 Run build script)
	 */
	'pleaseEnterScriptTitle': string
	/**
	 * Do you want this command to be executed automatically on initial project installation?
	 */
	'isItEntryScript': string
	/**
	 * "{title}" Command added successfully.
Open the script file to configure the command.
Script file path: {scriptPath}
	 * @param {string} scriptPath
	 * @param {string} title
	 */
	'scriptFileCreated': RequiredParams2<'scriptPath', 'title'>
	/**
	 * Add polyrepo (add-polyrepo)
	 */
	'commandAddPolyRepo': string
	/**
	 * Please select a category to save the polyrepo.
	 */
	'pleaseSelectSubFolder': string
	/**
	 * Please enter the URL of the polyrepo. (e.g. github.com/akasia-dev/polyger.git)
	 */
	'pleaseEnterRepoUrl': string
	/**
	 * Please enter the branch name of the polyrepo. (e.g. main)
	 */
	'pleaseEnterRepoBranch': string
	/**
	 * Please enter the name of the folder where the polyrepo will be stored (e.g., polyger-main))
	 */
	'pleaseEnterRepoFolderName': string
	/**
	 * Create polyrepo in the GitHub (create-polyrepo)
	 */
	'commandCreatePolyRepo': string
	/**
	 * Please choose the location in the GitHub.
	 */
	'pleaseSelectOrganization': string
	/**
	 * Please enter the name of the reformer you want to create.
	 */
	'pleaseInputRepoName': string
	/**
	 * Do you want to create as a private repo?
	 */
	'isItPrivateRepo': string
	/**
	 * A problem occurred during the GitHub API call. Please check the token permission and network status.
	 */
	'failedGithubApiFetch': string
	/**
	 * It's a repo that already exists. shall we clone it?(Y) or should stop?(N)
	 */
	'itAlreadyExistRepositoryCouldYouCloneIt': string
	/**
	 * Please fill out the description of the repo. (will be uploaded on Github)
	 */
	'pleaseTypeRepoDescription': string
	/**
	 * Successfully created the repository in github.
	 */
	'successfullyCreatedRepository': string
	/**
	 * Is it a repo that I have access to on my account? (My personal repo and in-group repo are Y)
	 */
	'isThisRelatedOfMe': string
	/**
	 * Please enter the GitHub ID or organization ID to download the repo.
	 */
	'pleaseEnterRepoAccountName': string
	/**
	 * Is it a GitHub organization? (Y) or a personal repo? (N)
	 */
	'isThisOrganization': string
	/**
	 * Add a submodule (add-submodule)
	 */
	'commandAddSubmodule': string
	/**
	 * Please select a category to create a submodule.
	 */
	'pleaseSelectCategoryToCreateSubmodule': string
	/**
	 * Please select a project to create a submodule.
	 */
	'pleaseSelectProjectToCreateSubmodule': string
	/**
	 * Please enter the detailed path in the folder where the submodule will be created. (e.g. lib/some-module)
	 */
	'pleaseEnterDetailSubmodulePathToSave': string
	/**
	 * Please select the Git project you want to receive as a submodule.
	 */
	'pleaseSelectGitProjectAsSubmodule': string
	/**
	 * No polyrepo added to the category exists.
First, please add the polyrepo to the category.
	 */
	'polyrepoIsEmptyPleaseAddOne': string
	/**
	 * Delete submodule (delete-submodule)
	 */
	'commandDeleteSubmodule': string
	/**
	 * Please select the category of the project containing the submodule.
	 */
	'pleaseSelectCategoryOfSubmodule': string
	/**
	 * Please select a project containing the submodule.
	 */
	'pleaseSelectProjectOfSubmodule': string
	/**
	 * Please select the submodule.
	 */
	'pleaseEnterDetailSubmodulePath': string
	/**
	 * Submodules do not exist in the project.
	 */
	'submoduleDoesntExist': string
	/**
	 * Update submodule (update-submodule)
	 */
	'commandUpdateSubmodule': string
	/**
	 * {name} submodule update is complete.
	 * @param {unknown} name
	 */
	'finishedUpdateSubmodule': RequiredParams1<'name'>
	/**
	 * Delete polyrepo (delete-polyrepo)
	 */
	'commandDeletePolyRepo': string
	/**
	 * Please select a category containing the project you want to delete.
	 */
	'pleaseSelectCategoryOfDeleteProject': string
	/**
	 * Please select a project to delete.
	 */
	'pleaseSelectProjectOfDelete': string
	/**
	 * Please enter the project name that you want to delete. {name}:
	 * @param {unknown} name
	 */
	'reallySureToDeleteProject': RequiredParams1<'name'>
	/**
	 * The project does not exist in that category.
	 */
	'noProjectsInCategory': string
	/**
	 * {name} polyrepo deletion is complete.
	 * @param {unknown} name
	 */
	'finishedDeletePolyRepo': RequiredParams1<'name'>
	/**
	 * 
Execution of the submodule installation command failed. (git submodule update)
It is identified as a problem within the Git client installed on the computer.
If you are using windows, please look at the document below and complete the git path setting.

URL: https://stackoverflow.com/a/50833818
	 */
	'windowsGitShSetupIssueDetected': string
	/**
	 * If you run the "Update the entire local poyrepos from the GitHub (pull)"
command after client setup fixed, you can automatically
re-receive all sub-modules that have not been downloaded.
	 */
	'youCanBePullSubmoduleAnytime': string
}

export type TranslationFunctions = {
	/**
	 * Access token is required for GitHub repo clone.
How to get a GitHub Access Token: (URL)
https://git.io/JsPkj
	 */
	'messageOfNeedToken': () => LocalizedString
	/**
	 * 
The project must download the polyrepos in GitHub for execution.
The total number of polyrepos to clone is {count}.

New incoming polyrepo list: {list}
	 */
	'messageOfClone': (arg: { count: number, list: string }) => LocalizedString
	/**
	 * Please enter at least one polyrepo category.
e.g.: frontend, backend, release

Each category folder is created at the top,
and you can add a polyrepo to the sub-path.

You can type multiple folders by separating them with ","

Polyrepo category:

	 */
	'messageOfSubFolders': () => LocalizedString
	/**
	 * Please enter the GitHub CLI token.
	 */
	'pleaseEnterGithubCLIToken': () => LocalizedString
	/**
	 * Please enter GitHub user name. (NOT EMAIL)
	 */
	'pleaseEnterUsername': () => LocalizedString
	/**
	 * Polyrepo initial setup and structure creation are complete.
You can add polyrepo and add or excute project commands.
Please enter "npm start" to run the polyrepo manager.
	 */
	'afterFirstInitWelcome': () => LocalizedString
	/**
	 * Please select the project command you want to use.
If you select a command, it will be executed.

	 */
	'selectCommandWantToExecute': () => LocalizedString
	/**
	 * Running... "{title}"
	 */
	'runningCommand': (arg: { title: string }) => LocalizedString
	/**
	 * Do you want to clone the project?
	 */
	'shallWeClone': () => LocalizedString
	/**
	 * Update the entire local poyrepos from the GitHub (pull)
	 */
	'commandPull': () => LocalizedString
	/**
	 * "{packageName}" Downloading polyrepos...
	 */
	'downloadingPolyrepos': (arg: { packageName: string }) => LocalizedString
	/**
	 * The terminal does not appear to support interaction.
Interactive terminals are needed for smooth execution.

For Windows, the recommended installation methods are as follows:
1. git-bash install: https://git.io/JENSe
2. hyper install: https://git.io/JEN7V
3. hyper setup: https://bit.ly/hyper-setup
	 */
	'detectedNonInteractiveTerminal': () => LocalizedString
	/**
	 * Add project command (add-script)
	 */
	'commandAddScript': () => LocalizedString
	/**
	 * Enter the name of the folder where the shellscript files
for the project will be contained (default: sh)
	 */
	'pleaseSelectShellScriptFolderName': () => LocalizedString
	/**
	 * Please enter the name of the script file you want to create. (e.g. my-script-file)
	 */
	'pleaseEnterScriptFileName': () => LocalizedString
	/**
	 * Please enter the name of the script command to be displayed. (e.g., 🍉 Run build script)
	 */
	'pleaseEnterScriptTitle': () => LocalizedString
	/**
	 * Do you want this command to be executed automatically on initial project installation?
	 */
	'isItEntryScript': () => LocalizedString
	/**
	 * "{title}" Command added successfully.
Open the script file to configure the command.
Script file path: {scriptPath}
	 */
	'scriptFileCreated': (arg: { scriptPath: string, title: string }) => LocalizedString
	/**
	 * Add polyrepo (add-polyrepo)
	 */
	'commandAddPolyRepo': () => LocalizedString
	/**
	 * Please select a category to save the polyrepo.
	 */
	'pleaseSelectSubFolder': () => LocalizedString
	/**
	 * Please enter the URL of the polyrepo. (e.g. github.com/akasia-dev/polyger.git)
	 */
	'pleaseEnterRepoUrl': () => LocalizedString
	/**
	 * Please enter the branch name of the polyrepo. (e.g. main)
	 */
	'pleaseEnterRepoBranch': () => LocalizedString
	/**
	 * Please enter the name of the folder where the polyrepo will be stored (e.g., polyger-main))
	 */
	'pleaseEnterRepoFolderName': () => LocalizedString
	/**
	 * Create polyrepo in the GitHub (create-polyrepo)
	 */
	'commandCreatePolyRepo': () => LocalizedString
	/**
	 * Please choose the location in the GitHub.
	 */
	'pleaseSelectOrganization': () => LocalizedString
	/**
	 * Please enter the name of the reformer you want to create.
	 */
	'pleaseInputRepoName': () => LocalizedString
	/**
	 * Do you want to create as a private repo?
	 */
	'isItPrivateRepo': () => LocalizedString
	/**
	 * A problem occurred during the GitHub API call. Please check the token permission and network status.
	 */
	'failedGithubApiFetch': () => LocalizedString
	/**
	 * It's a repo that already exists. shall we clone it?(Y) or should stop?(N)
	 */
	'itAlreadyExistRepositoryCouldYouCloneIt': () => LocalizedString
	/**
	 * Please fill out the description of the repo. (will be uploaded on Github)
	 */
	'pleaseTypeRepoDescription': () => LocalizedString
	/**
	 * Successfully created the repository in github.
	 */
	'successfullyCreatedRepository': () => LocalizedString
	/**
	 * Is it a repo that I have access to on my account? (My personal repo and in-group repo are Y)
	 */
	'isThisRelatedOfMe': () => LocalizedString
	/**
	 * Please enter the GitHub ID or organization ID to download the repo.
	 */
	'pleaseEnterRepoAccountName': () => LocalizedString
	/**
	 * Is it a GitHub organization? (Y) or a personal repo? (N)
	 */
	'isThisOrganization': () => LocalizedString
	/**
	 * Add a submodule (add-submodule)
	 */
	'commandAddSubmodule': () => LocalizedString
	/**
	 * Please select a category to create a submodule.
	 */
	'pleaseSelectCategoryToCreateSubmodule': () => LocalizedString
	/**
	 * Please select a project to create a submodule.
	 */
	'pleaseSelectProjectToCreateSubmodule': () => LocalizedString
	/**
	 * Please enter the detailed path in the folder where the submodule will be created. (e.g. lib/some-module)
	 */
	'pleaseEnterDetailSubmodulePathToSave': () => LocalizedString
	/**
	 * Please select the Git project you want to receive as a submodule.
	 */
	'pleaseSelectGitProjectAsSubmodule': () => LocalizedString
	/**
	 * No polyrepo added to the category exists.
First, please add the polyrepo to the category.
	 */
	'polyrepoIsEmptyPleaseAddOne': () => LocalizedString
	/**
	 * Delete submodule (delete-submodule)
	 */
	'commandDeleteSubmodule': () => LocalizedString
	/**
	 * Please select the category of the project containing the submodule.
	 */
	'pleaseSelectCategoryOfSubmodule': () => LocalizedString
	/**
	 * Please select a project containing the submodule.
	 */
	'pleaseSelectProjectOfSubmodule': () => LocalizedString
	/**
	 * Please select the submodule.
	 */
	'pleaseEnterDetailSubmodulePath': () => LocalizedString
	/**
	 * Submodules do not exist in the project.
	 */
	'submoduleDoesntExist': () => LocalizedString
	/**
	 * Update submodule (update-submodule)
	 */
	'commandUpdateSubmodule': () => LocalizedString
	/**
	 * {name} submodule update is complete.
	 */
	'finishedUpdateSubmodule': (arg: { name: unknown }) => LocalizedString
	/**
	 * Delete polyrepo (delete-polyrepo)
	 */
	'commandDeletePolyRepo': () => LocalizedString
	/**
	 * Please select a category containing the project you want to delete.
	 */
	'pleaseSelectCategoryOfDeleteProject': () => LocalizedString
	/**
	 * Please select a project to delete.
	 */
	'pleaseSelectProjectOfDelete': () => LocalizedString
	/**
	 * Please enter the project name that you want to delete. {name}:
	 */
	'reallySureToDeleteProject': (arg: { name: unknown }) => LocalizedString
	/**
	 * The project does not exist in that category.
	 */
	'noProjectsInCategory': () => LocalizedString
	/**
	 * {name} polyrepo deletion is complete.
	 */
	'finishedDeletePolyRepo': (arg: { name: unknown }) => LocalizedString
	/**
	 * 
Execution of the submodule installation command failed. (git submodule update)
It is identified as a problem within the Git client installed on the computer.
If you are using windows, please look at the document below and complete the git path setting.

URL: https://stackoverflow.com/a/50833818
	 */
	'windowsGitShSetupIssueDetected': () => LocalizedString
	/**
	 * If you run the "Update the entire local poyrepos from the GitHub (pull)"
command after client setup fixed, you can automatically
re-receive all sub-modules that have not been downloaded.
	 */
	'youCanBePullSubmoduleAnytime': () => LocalizedString
}

export type Formatters = {}

type Param<P extends string> = `{${P}}`

type Params1<P1 extends string> =
	`${string}${Param<P1>}${string}`

type Params2<P1 extends string, P2 extends string> =
	`${string}${Param<P1>}${string}${Param<P2>}${string}`

type RequiredParams1<P1 extends string> =
	| Params1<P1>

type RequiredParams2<P1 extends string, P2 extends string> =
	| Params2<P1, P2>
	| Params2<P2, P1>
