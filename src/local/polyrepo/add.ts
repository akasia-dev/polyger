import path from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'

import getLocale from '../../../locale'
import * as github from '../../core/github'

import { choice } from '../../core/utils'
import { inquirer } from '../../core/inquirer'
import { getConfigPath, getConfigData } from '../../core/setup'

import type { ICommand } from '../../interface'
import { getRepoList, selectOrganization } from '../utils'

export default async (commands: ICommand[]) => {
  const locale = await getLocale()
  commands.push({
    title: locale.commandAddPolyRepo(),
    localFunction
  })
}

const localFunction = async () => {
  const locale = await getLocale()
  const { configData, secretData } = await getConfigData()
  const { githubToken, githubUserName } = secretData

  const configPath = getConfigPath()

  try {
    const selectedSubFolder = await choice({
      items: configData.subFolders!,
      message: locale.pleaseSelectSubFolder()
    })

    const { isRelatedOfMe } = await inquirer.prompt({
      type: 'confirm',
      name: 'isRelatedOfMe',
      message: locale.isThisRelatedOfMe(),
      validate: (answer) => typeof answer !== 'undefined'
    })

    let isOrganization = false
    let selectedOrganization = undefined as string | undefined
    let targetGithubName = undefined as string | undefined

    if (isRelatedOfMe) {
      const answer = await selectOrganization({
        githubToken: githubToken!,
        githubUserName: githubUserName!,
        locale,
        itCanBeMe: true
      })
      isOrganization = answer.isOrganization
      selectedOrganization = answer.selectedOrganization
      targetGithubName = githubUserName
    } else {
      const { someName } = await inquirer.prompt({
        type: 'input',
        name: 'someName',
        message: locale.pleaseEnterRepoAccountName(),
        validate: (inputText: string) => {
          return inputText && inputText.length > 0
        }
      })

      const { _isOrganization } = await inquirer.prompt({
        type: 'confirm',
        name: '_isOrganization',
        message: locale.isThisOrganization(),
        validate: (answer) => typeof answer !== 'undefined'
      })

      isOrganization = _isOrganization
      if (isOrganization) {
        selectedOrganization = someName
      } else {
        targetGithubName = someName
      }
    }

    const repoList = await getRepoList({
      isOrganization,
      githubToken: githubToken!,
      organizationName: selectedOrganization,
      githubUserName: targetGithubName,
      locale
    })

    const repoName = await choice({
      items: repoList,
      message: locale.pleaseInputRepoName()
    })

    const repoUrl = `github.com/${
      isOrganization ? selectedOrganization : targetGithubName
    }/${repoName}.git`

    let { repoFolderName } = await inquirer.prompt({
      type: 'input',
      name: 'repoFolderName',
      message: locale.pleaseEnterRepoFolderName({
        name: repoName
      }),
      transformer: (inputText: string) => {
        return inputText && inputText.length > 0 ? inputText : repoName
      }
    })
    repoFolderName = repoFolderName.length > 0 ? repoFolderName : repoName

    const branches = (
      await github.fetchBranchList({
        githubToken: githubToken!,
        ownerName: isOrganization ? selectedOrganization! : targetGithubName!,
        repoName
      })
    ).map((branch) => branch.name)

    const repoBranch = await choice({
      items: branches,
      message: locale.pleaseEnterRepoBranch()
    })

    const targetPolygerListPath = path.resolve(
      configPath.projectPath,
      selectedSubFolder,
      '.polyger.list.json'
    )

    if (!existsSync(targetPolygerListPath)) {
      writeFileSync(
        targetPolygerListPath,
        JSON.stringify({ package: {} }, null, 2)
      )
    }

    const targetPolygerList = JSON.parse(
      String(readFileSync(targetPolygerListPath))
    ) ?? { package: {} }

    targetPolygerList.package[repoFolderName] = {
      url: repoUrl,
      branch: repoBranch
    }

    if (
      await github.submodule({
        url: repoUrl,
        branch: repoBranch,
        cwd: process.cwd(),
        githubToken: githubToken!,
        githubUserName: githubUserName!,
        onErrorMessage: (message) => console.log(message),
        onMessage: (message) => console.log(message),
        path: `${selectedSubFolder}/${repoFolderName}`
      })
    ) {
      writeFileSync(
        targetPolygerListPath,
        JSON.stringify(targetPolygerList, null, 2)
      )
    }
  } catch (error) {
    console.log(error)
    console.log(locale.failedGithubApiFetch())
  }
}

if (process.argv?.[1] === __filename) localFunction()
