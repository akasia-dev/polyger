/* eslint-disable no-console */
import { exec } from 'child_process'
import path from 'path'
import { promisify } from 'util'
import patternGrab from 'pattern-grab'

import { axios } from '../axios'
import { IOrganization, IRepo } from './interface'
import { gitModulesPathAndUrlRegex } from '../utils'
import { existsSync, readFileSync } from 'fs'

export interface ICloneProps {
  name: string
  url: string
  githubUserName: string
  githubToken: string
  cwd: string
  branch: string
  onMessage: (message: string) => void | Promise<void>
  onErrorMessage: (errorMessage: string) => void | Promise<void>
  onError: (error: Error) => void | Promise<void>
}

export interface IRunCommandProps {
  command: string
  cwd: string
  onMessage: (message: string) => void | Promise<void>
  onErrorMessage: (errorMessage: string) => void | Promise<void>
  onError: (error: Error) => void | Promise<void>
}

export interface ISubmoduleProps {
  path: string
  url: string
  githubUserName: string
  githubToken: string
  cwd: string
  branch: string
  onMessage: (message: string) => void | Promise<void>
  onErrorMessage: (errorMessage: string) => void | Promise<void>
  onError: (error: Error) => void | Promise<void>
}

export interface ISubmoduleDeleteProps {
  path: string
  cwd: string
  onMessage: (message: string) => void | Promise<void>
  onErrorMessage: (errorMessage: string) => void | Promise<void>
  onError: (error: Error) => void | Promise<void>
}

export const runCommand = async (props: IRunCommandProps) => {
  try {
    const { stdout, stderr } = await promisify(exec)(props.command, {
      cwd: props.cwd
    })
    await props.onMessage(stdout)
    await props.onErrorMessage(stderr)
  } catch (error) {
    await props.onError(error)
  }
}

export const clone = async (props: ICloneProps) => {
  const command = `git clone -b ${props.branch} https://${props.githubUserName}:${props.githubToken}@${props.url} ${props.name}`
  try {
    const { stdout, stderr } = await promisify(exec)(command, {
      cwd: props.cwd
    })
    await props.onMessage(stdout)
    await props.onErrorMessage(stderr)
  } catch (error) {
    await props.onError(error)
  }

  await submodulePull({
    cwd: props.cwd,
    githubUserName: props.githubUserName,
    githubToken: props.githubToken,
    onMessage: props.onMessage,
    onErrorMessage: props.onErrorMessage,
    onError: props.onError
  })
}

export const submodulePull = async (props: {
  cwd: string
  githubUserName: string
  githubToken: string
  onMessage: (message: string) => void | Promise<void>
  onErrorMessage: (errorMessage: string) => void | Promise<void>
  onError: (error: Error) => void | Promise<void>
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
      const submoduleUrl = fullUrl.split('://')[1]
      try {
        const { stdout, stderr } = await promisify(exec)(
          `git config submodule.${submodulePath}.url https://${props.githubUserName}:${props.githubToken}@${submoduleUrl}`,
          {
            cwd: props.cwd
          }
        )
        await props.onMessage(stdout)
        await props.onErrorMessage(stderr)
      } catch (error) {
        await props.onError(error)
      }
    }

    try {
      const { stdout, stderr } = await promisify(exec)(
        `git submodule update --init --recursive`,
        {
          cwd: props.cwd
        }
      )
      await props.onMessage(stdout)
      await props.onErrorMessage(stderr)
    } catch (error) {
      await props.onError(error)
    }
  }
}

export const submodule = async (props: ISubmoduleProps) => {
  for (const command of [
    `git submodule add -b ${props.branch} https://${props.url} ${props.path}`,
    `git config submodule.${props.path}.url https://${props.githubUserName}:${props.githubToken}@${props.url}`,
    `git submodule update --init --recursive`
  ]) {
    try {
      const { stdout, stderr } = await promisify(exec)(command, {
        cwd: props.cwd
      })
      await props.onMessage(stdout)
      await props.onErrorMessage(stderr)
    } catch (error) {
      await props.onError(error)
    }
  }
}

export const submoduleDelete = async (props: ISubmoduleDeleteProps) => {
  for (const command of [
    `git submodule deinit -f ${props.path}`,
    `rm -rf .git/modules/${props.path}`,
    `git rm -f ${props.path}`
  ]) {
    try {
      const { stdout, stderr } = await promisify(exec)(command, {
        cwd: props.cwd
      })
      await props.onMessage(stdout)
      await props.onErrorMessage(stderr)
    } catch (error) {
      await props.onError(error)
    }
  }
}

export const pull = async (props: {
  name: string
  cwd: string
  githubUserName: string
  githubToken: string
  onMessage: (message: string) => void | Promise<void>
  onErrorMessage: (errorMessage: string) => void | Promise<void>
  onError: (error: Error) => void | Promise<void>
}) => {
  try {
    const { stdout, stderr } = await promisify(exec)(`git pull --ff-only`, {
      cwd: props.cwd
    })
    await props.onMessage(stdout)
    await props.onErrorMessage(stderr)
  } catch (error) {
    await props.onError(error)
  }

  await submodulePull({
    cwd: props.cwd,
    githubUserName: props.githubUserName,
    githubToken: props.githubToken,
    onMessage: props.onMessage,
    onErrorMessage: props.onErrorMessage,
    onError: props.onError
  })
}

export const fetchOrganization = async (githubToken: string) => {
  const { data } = await axios.get<IOrganization[]>(
    'https://api.github.com/user/orgs',
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!data) throw new Error('No response data')
  return data
}

export const fetchOrganizationRepos = async ({
  githubToken,
  organizationName
}: {
  githubToken: string
  organizationName: string
}) => {
  const { data } = await axios.get<IRepo[]>(
    `https://api.github.com/orgs/${organizationName}/repos`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.inertia-preview+json',
        'Content-Type': 'application/json'
      }
    }
  )

  if (!data) throw new Error('No response data')
  return data
}

export const fetchUserRepos = async ({
  githubToken,
  githubUserName
}: {
  githubToken: string
  githubUserName: string
}) => {
  const { data } = await axios.get<IRepo[]>(
    `https://api.github.com/users/${githubUserName}/repos`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.inertia-preview+json',
        'Content-Type': 'application/json'
      }
    }
  )

  if (!data) throw new Error('No response data')
  return data
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
