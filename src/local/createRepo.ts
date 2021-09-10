import path from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'

import getLocale from '../../locale/index'
import getSetupData from '../core/setup'
import * as github from '../core/github'

import { choice } from '../core/utils'
import { inquirer } from '../core/inquire'
import { getConfigPath, getConfigData } from '../core/setup'

import type { ICommand } from '../interface'
import type { TranslationFunctions } from 'locale/i18n-types'

export default async (commands: ICommand[]) => {
  const locale = await getLocale()
  commands.push({
    title: locale.commandCreatePolyRepo(),
    localFunction
  })
}

export const selectOrganization = async ({
  githubToken,
  githubUserName,
  locale,
  itCanBeMe
}: {
  githubToken: string
  githubUserName: string
  locale: TranslationFunctions
  itCanBeMe: boolean
}) => {
  try {
    const fetchedOrganizationsData = await github.fetchOrganization(
      githubToken!
    )
    const organizations = fetchedOrganizationsData.map((organization) => {
      return organization.login
    })

    const identifiableMy = `${githubUserName} (personal)`
    const selectableList = itCanBeMe
      ? [identifiableMy, ...organizations]
      : organizations
    const selectedOrganization = await choice({
      items: selectableList,
      message: locale.pleaseSelectOrganization()
    })

    return {
      isOrganization: selectedOrganization !== identifiableMy,
      selectedOrganization
    }
  } catch (e) {
    console.log(e.data ? e.data : e)
    console.log('\n' + locale.failedGithubApiFetch())
    throw new Error()
  }
}

export const getRepoList = async ({
  isOrganization,
  githubToken,
  organizationName,
  githubUserName,
  locale
}: {
  isOrganization: boolean
  githubToken: string
  organizationName: string | undefined
  githubUserName: string | undefined
  locale: TranslationFunctions
}) => {
  try {
    const fetchedReposData = isOrganization
      ? await github.fetchOrganizationRepos({
          githubToken,
          organizationName: organizationName!
        })
      : await github.fetchUserRepos({
          githubToken: githubToken!,
          githubUserName: githubUserName!
        })

    const beforeExistRepoList = fetchedReposData.map((repo) => {
      return repo.name
    })

    return beforeExistRepoList
  } catch (e) {
    console.log(e.data ? e.data : e)
    console.log('\n' + locale.failedGithubApiFetch())
    throw new Error()
  }
}

export const createOrganizationRepo = async ({
  githubToken,
  organizationName,
  repoName,
  isPrivateRepo,
  description,
  locale
}: {
  githubToken: string
  organizationName: string
  repoName: string
  isPrivateRepo: boolean
  description: string
  locale: TranslationFunctions
}) => {
  try {
    await github.fetchCreateOrganizationRepo({
      githubToken,
      organizationName,
      repoName,
      isPrivateRepo,
      description
    })
  } catch (e) {
    console.log(e.data ? e.data : e)
    console.log('\n' + locale.failedGithubApiFetch())
    throw new Error()
  }
}

export const createUserRepo = async ({
  githubToken,
  repoName,
  isPrivateRepo,
  description,
  locale
}: {
  githubToken: string
  repoName: string
  isPrivateRepo: boolean
  description: string
  locale: TranslationFunctions
}) => {
  try {
    await github.fetchCreateUserRepo({
      githubToken,
      repoName,
      isPrivateRepo,
      description
    })
  } catch (e) {
    console.log(e.data ? e.data : e)
    console.log('\n' + locale.failedGithubApiFetch())
    throw new Error()
  }
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

    let shouldClontIt = true
    const repoUrl = `github.com/${
      isOrganization ? selectedOrganization : githubUserName
    }/${repoName}.git`

    if (repoList.includes(repoName)) {
      const { _shouldClontIt } = await inquirer.prompt({
        type: 'confirm',
        name: '_shouldClontIt',
        message: locale.itAlreadyExistRepositoryCouldYouCloneIt(),
        validate: (inputText: string) => inputText && inputText.length > 0
      })

      shouldClontIt = _shouldClontIt
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

    // TODO 삭제 예정
    console.log('Done?', {
      isOrganization,
      selectedOrganization,
      repoName,
      repoList,
      isPrivateRepo,
      shouldClontIt
    })

    // TODO 클론
    const selectedSubFolder = await choice({
      items: configData.subFolders!,
      message: locale.pleaseSelectSubFolder()
    })
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
  } catch (e) {}
}

if (process.argv?.[1] === __filename) localFunction()
