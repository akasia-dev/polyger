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

const localFunction = async () => {
  const locale = await getLocale()
  const configData = await getConfigData()
  const { githubToken, githubUserName } = await getSetupData()

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
      name: '_shouldClontIt',
      message: locale.isItPrivateRepo(),
      validate: (inputText: string) => inputText && inputText.length > 0
    })

    let shouldClontIt = true
    if (repoList.includes(repoName)) {
      const { _shouldClontIt } = await inquirer.prompt({
        type: 'confirm',
        name: '_shouldClontIt',
        message: locale.itAlreadyExistRepositoryCouldYouCloneIt(),
        validate: (inputText: string) => inputText && inputText.length > 0
      })

      shouldClontIt = _shouldClontIt
    } else {
      // TODO 생성
      if (isOrganization) {
        // TODO https://docs.github.com/en/rest/reference/repos#create-an-organization-repository
      } else {
        // TODO https://docs.github.com/en/rest/reference/repos#create-a-repository-for-the-authenticated-user
      }
    }

    // TODO 삭제 예정
    console.log({
      isOrganization,
      selectedOrganization,
      repoName,
      repoList,
      isPrivateRepo,
      shouldClontIt
    })

    // TODO 클론
  } catch (e) {}
}

if (process.argv?.[1] === __filename) localFunction()
