/* eslint-disable no-console */
import { exec } from 'child_process'
import path from 'path'
import patternGrab from 'pattern-grab'

import { axios } from '../axios'
import { IBranch, IOrganization, IRepo } from './interface'
import { gitModulesPathAndUrlRegex } from '../utils'
import { existsSync, readFileSync } from 'fs'
import getLocale from '../../../locale'

export interface ICloneProps {
  name: string
  url: string
  githubUserName: string
  githubToken: string
  cwd: string
  branch: string
  onMessage: (message: string) => void | Promise<void>
  onErrorMessage: (errorMessage: string) => void | Promise<void>
}

export interface IRunCommandProps {
  command: string
  cwd: string
  onMessage?: (message: string) => void | Promise<void>
  onErrorMessage?: (errorMessage: string) => void | Promise<void>
}

export interface ISubmoduleProps {
  path: string
  url: string
  githubUserName: string
  githubToken: string
  cwd: string
  branch: string
  onMessage?: (message: string) => void | Promise<void>
  onErrorMessage?: (errorMessage: string) => void | Promise<void>
}

export interface ISubmoduleDeleteProps {
  path: string
  cwd: string
  onMessage?: (message: string) => void | Promise<void>
  onErrorMessage?: (errorMessage: string) => void | Promise<void>
}

export const runCommand = (props: IRunCommandProps) => {
  return new Promise<boolean>((resolve) => {
    const child = exec(props.command, {
      cwd: props.cwd
    })

    child.stdout?.on(
      'data',
      (data) => typeof props.onMessage === 'function' && props.onMessage(data)
    )
    child.stderr?.on(
      'data',
      (data) =>
        typeof props.onErrorMessage === 'function' && props.onErrorMessage(data)
    )

    child.on('exit', () => resolve(true))
    child.on('error', () => resolve(false))
  })
}

export const clone = async (props: ICloneProps) => {
  const command = `git clone -b ${props.branch} https://${props.githubUserName}:${props.githubToken}@${props.url} ${props.name}`
  const isSuccess = await runCommand({
    command,
    cwd: props.cwd,
    onErrorMessage: props.onErrorMessage,
    onMessage: props.onMessage
  })

  if (!isSuccess) return false

  await submodulePull({
    cwd: path.resolve(props.cwd, props.name),
    githubUserName: props.githubUserName,
    githubToken: props.githubToken,
    onMessage: props.onMessage,
    onErrorMessage: props.onErrorMessage
  })

  return true
}

export const submodulePull = async (props: {
  cwd: string
  githubUserName: string
  githubToken: string
  onMessage?: (message: string) => void | Promise<void>
  onErrorMessage?: (errorMessage: string) => void | Promise<void>
}) => {
  const gitModulesPath = path.resolve(props.cwd, '.gitmodules')
  if (existsSync(gitModulesPath)) {
    const gitModulesContent = String(readFileSync(gitModulesPath))

    const { data, positions } = patternGrab({
      regex: gitModulesPathAndUrlRegex,
      string: gitModulesContent
    })

    const submodulePaths = data
      .filter((_, index) => positions.includes(index))
      .map((item: string) =>
        item.split('\n').map((item) => item.split('=')[1].trim())
      )

    for (const [submodulePath, fullUrl] of submodulePaths) {
      const safeSubmodulePath = submodulePath.replace('\\', '')
      const submoduleUrl = fullUrl.split('://')[1]
      await runCommand({
        command: `git config submodule.${safeSubmodulePath}.url https://${props.githubUserName}:${props.githubToken}@${submoduleUrl}`,
        cwd: props.cwd,
        onErrorMessage: props.onErrorMessage,
        onMessage: props.onMessage
      })

      const isSuccess = await runCommand({
        command: `git submodule update --init --recursive`,
        cwd: path.resolve(props.cwd, safeSubmodulePath),
        onErrorMessage: props.onErrorMessage,
        onMessage: props.onMessage
      })
      if (!isSuccess) {
        const locale = await getLocale()
        console.log(locale.windowsGitShSetupIssueDetected())
        console.log(locale.youCanBePullSubmoduleAnytime())
      }
    }
  }
}

export const submodule = async (props: ISubmoduleProps) => {
  const safePath = props.path.replace('\\', '')
  await submoduleDelete({
    cwd: props.cwd,
    path: safePath
  })

  for (const command of [
    `git submodule add -b ${props.branch} https://${props.url} ${safePath}`,
    `git config submodule.${safePath}.url https://${props.githubUserName}:${props.githubToken}@${props.url}`
  ]) {
    await runCommand({
      command,
      cwd: props.cwd,
      onErrorMessage: props.onErrorMessage,
      onMessage: props.onMessage
    })
  }

  const isSuccess = await runCommand({
    command: `git submodule update --init --recursive`,
    cwd: path.resolve(props.cwd, safePath),
    onErrorMessage: props.onErrorMessage,
    onMessage: props.onMessage
  })

  if (!isSuccess) {
    const locale = await getLocale()
    console.log(locale.windowsGitShSetupIssueDetected())
    console.log(locale.youCanBePullSubmoduleAnytime())
    return false
  }

  return true
}

export const submoduleDelete = async (props: ISubmoduleDeleteProps) => {
  const safePath = props.path.replace('\\', '')

  for (const command of [
    `git rm -f ${safePath}`,
    `git submodule deinit -f ${safePath}`,
    `rm -rf .git/modules/${safePath}`
  ]) {
    const isSuccess = await runCommand({
      command,
      cwd: props.cwd,
      onErrorMessage: props.onErrorMessage,
      onMessage: props.onMessage
    })

    if (!isSuccess) return false
  }
  return true
}

export const pull = async (props: {
  name: string
  cwd: string
  githubUserName: string
  githubToken: string
  onMessage?: (message: string) => void | Promise<void>
  onErrorMessage?: (errorMessage: string) => void | Promise<void>
}) => {
  await runCommand({
    command: `git pull --ff-only`,
    cwd: props.cwd,
    onErrorMessage: props.onErrorMessage,
    onMessage: props.onMessage
  })

  await submodulePull({
    cwd: props.cwd,
    githubUserName: props.githubUserName,
    githubToken: props.githubToken,
    onMessage: props.onMessage,
    onErrorMessage: props.onErrorMessage
  })
}

export const init = async (props: {
  cwd: string
  onMessage?: (message: string) => void | Promise<void>
  onErrorMessage?: (errorMessage: string) => void | Promise<void>
}) => {
  await runCommand({
    command: `git init`,
    cwd: props.cwd,
    onErrorMessage: props.onErrorMessage,
    onMessage: props.onMessage
  })
}

export const fetchOrganization = async (githubToken: string) => {
  const collectedOrganizations: IOrganization[] = []

  let page = 1
  while (true) {
    const { data } = await axios.get<IOrganization[]>(
      `https://api.github.com/user/orgs?per_page=100&page=${page++}`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!data) throw new Error('No response data')
    collectedOrganizations.push(...data)
    if (data.length === 0) break
  }

  return collectedOrganizations
}

export const fetchOrganizationRepos = async ({
  githubToken,
  organizationName
}: {
  githubToken: string
  organizationName: string
}) => {
  const collectedRepos: IRepo[] = []

  let page = 1
  while (true) {
    const { data } = await axios.get<IRepo[]>(
      `https://api.github.com/orgs/${organizationName}/repos?per_page=100&page=${page++}`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.inertia-preview+json',
          'Content-Type': 'application/json'
        }
      }
    )

    if (!data) throw new Error('No response data')
    collectedRepos.push(...data)
    if (data.length === 0) break
  }

  return collectedRepos
}

export const fetchUserRepos = async ({
  githubToken,
  githubUserName
}: {
  githubToken: string
  githubUserName: string
}) => {
  const collectedRepos: IRepo[] = []

  let page = 1
  while (true) {
    const { data } = await axios.get<IRepo[]>(
      `https://api.github.com/users/${githubUserName}/repos?per_page=100&page=${page++}`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.inertia-preview+json',
          'Content-Type': 'application/json'
        }
      }
    )

    if (!data) throw new Error('No response data')
    collectedRepos.push(...data)
    if (data.length === 0) break
  }

  return collectedRepos
}

export const fetchCreateOrganizationRepo = async ({
  githubToken,
  organizationName,
  repoName,
  isPrivateRepo,
  description
}: {
  githubToken: string
  organizationName: string
  repoName: string
  isPrivateRepo: boolean
  description: string
}) => {
  const { data } = await axios.post<IRepo[]>(
    `https://api.github.com/orgs/${organizationName}/repos`,
    {
      name: repoName,
      private: isPrivateRepo,
      description,
      auto_init: true
    },
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    }
  )

  if (!data) throw new Error('No response data')
  return data
}

export const fetchCreateUserRepo = async ({
  githubToken,
  repoName,
  isPrivateRepo,
  description
}: {
  githubToken: string
  repoName: string
  isPrivateRepo: boolean
  description: string
}) => {
  const { data } = await axios.post<IRepo[]>(
    `https://api.github.com/user/repos`,
    {
      name: repoName,
      private: isPrivateRepo,
      description,
      auto_init: true
    },
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    }
  )

  if (!data) throw new Error('No response data')
  return data
}

export const fetchBranchList = async ({
  githubToken,
  ownerName,
  repoName
}: {
  githubToken: string
  ownerName: string
  repoName: string
}) => {
  const collectedBranches: IBranch[] = []

  let page = 1
  while (true) {
    const { data } = await axios.get<IBranch[]>(
      `https://api.github.com/repos/${ownerName}/${repoName}/branches?per_page=100&page=${page++}`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        }
      }
    )

    if (!data) throw new Error('No response data')
    collectedBranches.push(...data)
    if (data.length === 0) break
  }

  return collectedBranches
}
