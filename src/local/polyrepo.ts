import path from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'

import getLocale from '../../locale'
import getSetupData from '../core/setup'
import * as github from '../core/github'

import { choice } from '../core/utils'
import { inquirer } from '../core/inquire'
import { getConfigPath, getConfigData } from '../core/setup'

import type { ICommand } from '../interface'

export default async (commands: ICommand[]) => {
  const locale = await getLocale()
  commands.push({
    title: locale.commandAddPolyRepo(),
    localFunction
  })
}

const localFunction = async () => {
  const locale = await getLocale()
  const configData = await getConfigData()
  const { githubToken, githubUserName } = await getSetupData()

  const configPath = getConfigPath()

  const selectedSubFolder = await choice({
    items: configData.subFolders!,
    message: locale.pleaseSelectSubFolder()
  })

  const { repoUrl } = await inquirer.prompt({
    type: 'input',
    name: 'repoUrl',
    message: locale.pleaseEnterRepoUrl(),
    validate: (inputText: string) => {
      return inputText.includes('github.com')
    }
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
}

if (process.argv?.[1] === __filename) localFunction()
