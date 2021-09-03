import path from 'path'
import { existsSync, writeFileSync } from 'fs'

import type { ICommand } from '../interface'
import { getConfigPath, getConfigData } from '../core/setup'
import { inquirer } from '../core/inquire'
import getLocale from '../../locale'

export default async (commands: ICommand[]) => {
  const locale = await getLocale()
  commands.push({
    title: locale.commandAddScript(),
    localFunction
  })
}

const localFunction = async () => {
  const locale = await getLocale()

  const { scriptFileName } = await inquirer.prompt({
    type: 'input',
    name: 'scriptFileName',
    message: locale.pleaseEnterScriptFileName(),
    validate: (input) => {
      return input && input.length > 0 ? true : false
    }
  })

  const { title } = await inquirer.prompt({
    type: 'input',
    name: 'title',
    message: locale.pleaseEnterScriptTitle(),
    validate: (input) => {
      return input && input.length > 0 ? true : false
    }
  })

  const { isEntrypoint } = await inquirer.prompt({
    type: 'confirm',
    name: 'isEntrypoint',
    message: locale.isItEntryScript()
  })

  const { projectPath } = await getConfigPath()
  const configData = await getConfigData()
  const scriptFolderPath = path.resolve(
    projectPath,
    configData.shellScriptFolderName || 'sh'
  )
  const scriptPath = path.resolve(scriptFolderPath, `${scriptFileName}.sh`)

  if (!existsSync(scriptPath)) {
    let scriptFileCode = `# polyger title: ${title}\n`
    if (isEntrypoint === true) scriptFileCode += `# polyger entrypoint: v1\n`
    scriptFileCode += `# Please fill out the command you want below.\n\n`

    writeFileSync(scriptPath, scriptFileCode)
  }

  console.log(
    `\n` +
      locale.scriptFileCreated({
        scriptPath,
        title
      })
  )
}

if (process.argv?.[1] === __filename) localFunction()
