import { inquirer } from './inquire'
import { getLocalCommands } from '../local'
import type { ICommand } from '../interface'
import { exec } from 'child_process'
import { promisify } from 'util'
import getLocale from '../../locale'

export const getCommand = () => {
  //
}

export const selectCommand = () => {
  return new Promise<ICommand>(async (resolve) => {
    const locale = await getLocale()
    const commands = await getLocalCommands()
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
    } catch (error) {
      console.log(error)
    }
  }
}
