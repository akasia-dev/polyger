import path from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'

import getLocale from '../../locale/index'
import getSetupData from '../core/setup'
import * as github from '../core/github'

import { choice } from '../core/utils'
import { inquirer } from '../core/inquire'
import { getConfigPath, getConfigData } from '../core/setup'

import type { ICommand } from '../interface'

export default async (commands: ICommand[]) => {
  const locale = await getLocale()
  commands.push({
    title: locale.commandCreatePolyRepo(),
    localFunction
  })
}

const localFunction = async () => {
  const locale = await getLocale()
  const configData = await getConfigData()
  const { githubToken, githubUserName } = await getSetupData()

  const configPath = getConfigPath()

  console.log(locale.pleaseSelectOrganization())

  // const selectedSubFolder = await choice({
  //   items: configData.subFolders!,
  //   message: locale.pleaseSelectSubFolder()
  // })

  // const { repoUrl } = await inquirer.prompt({
  //   type: 'input',
  //   name: 'repoUrl',
  //   message: locale.pleaseEnterRepoUrl(),
  //   validate: (inputText: string) => {
  //     return inputText.includes('github.com')
  //   }
  // })
}

if (process.argv?.[1] === __filename) localFunction()
