/* eslint-disable no-console */
import { exec } from 'child_process'
import { promisify } from 'util'
import { axios } from '../axios'
import { IOrganization, IRepo } from './interface'

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

export const clone = async (props: ICloneProps) => {
  const command = `git clone -b ${props.branch} https://${props.githubUserName}:${props.githubToken}@${props.url} ${props.name}  --recursive`
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

export const submodule = async (props: ISubmoduleProps) => {
  const command = `git submodule add -b ${props.branch} https://${props.githubUserName}:${props.githubToken}@${props.url} ${props.path}`
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

export const pull = async (props: {
  cwd: string
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
