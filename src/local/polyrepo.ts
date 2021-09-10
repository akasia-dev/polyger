import path from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'

import getLocale from '../../locale'
import * as github from '../core/github'

import { choice } from '../core/utils'
import { inquirer } from '../core/inquire'
import { getConfigPath, getConfigData } from '../core/setup'

import type { ICommand } from '../interface'
import { getRepoList, selectOrganization } from './utils'

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

    // const { repoUrl } = await inquirer.prompt({
    //   type: 'input',
    //   name: 'repoUrl',
    //   message: locale.pleaseEnterRepoUrl(),
    //   validate: (inputText: string) => {
    //     return inputText.includes('github.com')
    //   }
    // })

    const { isRelatedOfMe } = await inquirer.prompt({
      type: 'confirm',
      name: 'isRelatedOfMe',
      message: locale.isThisRelatedOfMe(),
      validate: (answer) => typeof answer !== 'undefined'
    })

    let isOrganization = false
    let selectedOrganization = undefined as string | undefined
    let targetGithubName = undefined as string | undefined

    // TODO 단체 목록 선택
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

      // 그룹명 받아온 후 처리
      const { _isOrganization } = await inquirer.prompt({
        type: 'confirm',
        name: '_isOrganization',
        message: locale.isThisOrganization(),
        validate: (answer) => typeof answer !== 'undefined'
      })

      isOrganization = _isOrganization
      if (isOrganization) {
        targetGithubName = someName
      } else {
        selectedOrganization = someName
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
      targetGithubName ? targetGithubName : selectedOrganization
    }/${repoName}.git`

    const { repoFolderName } = await inquirer.prompt({
      type: 'input',
      name: 'repoFolderName',
      message: locale.pleaseEnterRepoFolderName(),
      validate: (inputText: string) => {
        return inputText && inputText.length > 0
      }
    })

    const { repoBranch } = await inquirer.prompt({
      type: 'input',
      name: 'repoBranch',
      message: locale.pleaseEnterRepoBranch(),
      validate: (inputText: string) => {
        return inputText && inputText.length > 0
      }
    })

    const targetPolygerPackagePath = path.resolve(
      configPath.projectPath,
      selectedSubFolder,
      'package'
    )
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

    writeFileSync(
      targetPolygerListPath,
      JSON.stringify(targetPolygerList, null, 2)
    )

    await github.clone({
      cwd: targetPolygerPackagePath,
      githubToken: githubToken!,
      githubUserName: githubUserName!,
      name: repoFolderName,
      branch: repoBranch,
      url: repoUrl,
      onMessage: (message) => console.log(message),
      onError: (message) => console.log(message),
      onErrorMessage: (message) => console.log(message)
    })
  } catch (error) {}
}

if (process.argv?.[1] === __filename) localFunction()
