import type { BaseTranslation } from 'typesafe-i18n'

const en: BaseTranslation = {
  messageOfNeedToken: `Access token is required for GitHub repo clone.
How to get a GitHub Access Token: (URL)
https://git.io/JsPkj`,

  messageOfClone: `
The project must download the polyrepos in GitHub for execution.
The total number of polyrepos to clone is {count:number}.

New incoming polyrepo list: {list:string}`,

  pleaseEnterGithubCLIToken: 'Please enter the GitHub CLI token.',
  pleaseEnterUsername: 'Please enter GitHub user name. (NOT EMAIL)',
  selectCommandWantToExecute:
    'Please select the project command you want to use.\nIf you select a command, it will be executed.\n',
  runningCommand: 'Running... "{title:string}"',

  shallWeClone: 'Do you want to clone the project?'
}

export default en
