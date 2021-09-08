import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'
import { promisify } from 'util'
import { exec } from 'child_process'
import isInteractive from 'is-interactive'

import { inquirer } from './inquire'
import getLocale from '../../locale/index'
import getSetupData from './setup'
import { getLocalCommands } from '../local/index'
import { polygerShellFileTitleRegex } from './utils'
import type { ICommand } from '../interface'

export const getCommand = async () => {
  const setupData = await getSetupData()
  const commandFolderPath = path.join(
    process.cwd(),
    setupData.shellScriptFolderName ?? 'sh'
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
          choices: commands.map((command, index) => ({
            name: command.title,
            value: index
          })),
          validate: (_answer) => true
        }
      ])
      .then((command) => {
        console.log(
          `${locale.runningCommand({
            title: commands[command.selected].title
          })}\n`
        )
        resolve(commands[command.selected])
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
      const { stdout, stderr } = await promisify(exec)(commandObject.command)
      console.log(stdout)
      console.log(stderr)
      return true
    } catch (error) {
      console.log(error)
    }
  }

  return false
}
