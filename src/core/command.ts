import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'
import isInteractive from 'is-interactive'

import { inquirer } from './inquirer'
import getLocale from '../../locale/index'
import getSetupData from './setup'
import { getLocalCommands } from '../local/index'
import { polygerShellFileTitleRegex } from './utils'
import type { ICommand } from '../interface'
import { runCommand } from './github'

export const getCommand = async () => {
  const { configData } = await getSetupData()
  const commandFolderPath = path.join(
    process.cwd(),
    configData.shellScriptFolderName ?? 'script'
  )
  const shellScriptPaths = glob.sync([`${commandFolderPath}/**/*.sh`])
  const projectCommands: ICommand[] = []

  for (const shellScriptPath of shellScriptPaths) {
    const shellScriptText = String(fs.readFileSync(shellScriptPath))

    polygerShellFileTitleRegex.lastIndex = 0

    const polygerShellFileTitleParse =
      polygerShellFileTitleRegex.exec(shellScriptText)!

    if (
      polygerShellFileTitleParse &&
      typeof polygerShellFileTitleParse[1] !== 'undefined'
    ) {
      const [, polygerShellFileTitle] = polygerShellFileTitleParse

      projectCommands.push({
        title: polygerShellFileTitle,
        command: `sh "${shellScriptPath}"`
      })
    }
  }

  return projectCommands
}

export const selectCommand = () => {
  return new Promise<ICommand>(async (resolve) => {
    const locale = await getLocale()
    const commands = [...(await getCommand()), ...(await getLocalCommands())]

    inquirer
      .prompt([
        {
          type: 'search-list',
          message: locale.selectCommandWantToExecute(),
          name: 'selected',
          choices: commands.map((command) => ({
            name: command.title,
            value: command.title
          })),
          validate: (_answer) => true
        }
      ])
      .then((command) => {
        let index = 0
        commands.some((item, i) => {
          if (item.title === command.selected) {
            index = i
            return true
          }
          return false
        })

        console.log(
          `${locale.runningCommand({
            title: commands[index].title
          })}\n`
        )
        resolve(commands[index])
      })
  })
}

export default async () => {
  const locale = await getLocale()
  if (!isInteractive()) {
    console.log(locale.detectedNonInteractiveTerminal())
    return false
  }

  const commandObject = await selectCommand()
  if (typeof commandObject?.localFunction === 'function')
    commandObject.localFunction()

  if (
    typeof commandObject?.command === 'string' &&
    commandObject.command.length > 0
  ) {
    try {
      await runCommand({
        command: commandObject.command,
        cwd: process.cwd(),
        onErrorMessage: (error) => console.log(error),
        onMessage: (message) => console.log(message)
      })
      return true
    } catch (error) {
      console.log(error)
    }
  }

  return false
}
