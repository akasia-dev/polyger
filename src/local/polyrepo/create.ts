import path from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'

import getLocale from '../../../locale/index'
import * as github from '../../core/github'

import { choice } from '../../core/utils'
import { inquirer } from '../../core/inquirer'
import { getConfigPath, getConfigData } from '../../core/setup'

import type { ICommand } from '../../interface'
import {
  createOrganizationRepo,
  createUserRepo,
  getRepoList,
  selectOrganization
} from '../utils'

export default async (commands: ICommand[]) => {
  const locale = await getLocale()
  commands.push({
    title: locale.commandCreatePolyRepo(),
    localFunction
  })
}

const localFunction = async () => {
  const locale = await getLocale()
  const { configData, secretData } = await getConfigData()
  const { githubToken, githubUserName } = secretData

  const configPath = getConfigPath()

  try {
    const { isOrganization, selectedOrganization } = await selectOrganization({
      githubToken: githubToken!,
      githubUserName: githubUserName!,
      locale,
      itCanBeMe: true
    })

    const { repoName } = await inquirer.prompt({
      type: 'input',
      name: 'repoName',
      message: locale.pleaseInputRepoName(),
      validate: (inputText: string) => inputText && inputText.length > 0
    })

    const repoList = await getRepoList({
      isOrganization,
      githubToken: githubToken!,
      organizationName: selectedOrganization,
      githubUserName,
      locale
    })

    const { isPrivateRepo } = await inquirer.prompt({
      type: 'confirm',
      name: 'isPrivateRepo',
      message: locale.isItPrivateRepo(),
      validate: (inputText: string) => inputText && inputText.length > 0
    })

    const repoUrl = `github.com/${
      isOrganization ? selectedOrganization : githubUserName
    }/${repoName}.git`

    if (repoList.includes(repoName)) {
      const { shouldClontIt } = await inquirer.prompt({
        type: 'confirm',
        name: 'shouldClontIt',
        message: locale.itAlreadyExistRepositoryCouldYouCloneIt(),
        validate: (inputText: string) => inputText && inputText.length > 0
      })
      if (!shouldClontIt) return
    } else {
      const { description } = await inquirer.prompt({
        type: 'input',
        name: 'description',
        message: locale.pleaseTypeRepoDescription(),
        validate: (inputText: string) => inputText && inputText.length > 0
      })

      if (isOrganization) {
        await createOrganizationRepo({
          githubToken: githubToken!,
          organizationName: selectedOrganization,
          repoName,
          isPrivateRepo,
          description,
          locale
        })
      } else {
        await createUserRepo({
          githubToken: githubToken!,
          repoName,
          isPrivateRepo,
          description,
          locale
        })
      }

      console.log(
        locale.successfullyCreatedRepository() + `\nURL: ${repoUrl}\n`
      )
    }

    const selectedSubFolder = await choice({
      items: configData.subFolders!,
      message: locale.pleaseSelectSubFolder()
    })
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
        ownerName: isOrganization ? selectedOrganization! : githubUserName!,
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

    writeFileSync(
      targetPolygerListPath,
      JSON.stringify(targetPolygerList, null, 2)
    )

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
  } catch (error) {
    console.log(error)
    console.log(locale.failedGithubApiFetch())
  }
}

if (process.argv?.[1] === __filename) localFunction()
