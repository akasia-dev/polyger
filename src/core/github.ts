/* eslint-disable no-console */
import { exec } from 'child_process'
import { promisify } from 'util'

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

export const clone = async (props: ICloneProps) => {
  const cloneCommand = `git clone -b ${props.branch} https://${props.githubUserName}:${props.githubToken}@${props.url} ${props.name}`
  try {
    const { stdout, stderr } = await promisify(exec)(cloneCommand, {
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
