import type { ICommand } from '../interface'
import { getConfigPath, getConfigData } from '../core/setup'
import { inquirer } from '../core/inquire'
import getLocale from '../../locale'
import { choice } from '../core/utils'
import path from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'

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

  const { repoBranch } = await inquirer.prompt({
    type: 'input',
    name: 'repoBranch',
    message: locale.pleaseEnterRepoBranch(),
    validate: (inputText: string) => {
      return inputText && inputText.length > 0
    }
  })

  console.log({
    selectedSubFolder,
    repoUrl,
    repoBranch
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

  // targetPolygerList.p
  // TODO
}

if (process.argv?.[1] === __filename) localFunction()
