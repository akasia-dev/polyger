import * as github from '../core/github'

import { choice } from '../core/utils'
import type { TranslationFunctions } from 'locale/i18n-types'

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
