import { inquirer } from './inquire'
// import { commands as plainCommands } from '../../../command'
import { localCommands } from '../local'
import type { ICommand } from '../interface'
import { exec } from 'child_process'
import { promisify } from 'util'
import getLocale from 'locale'

const commands = [...localCommands] // , ...plainCommands

export const getCommand = () => {
  return new Promise<ICommand>(async (resolve) => {
    const locale = await getLocale()
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
          `"${locale.runningCommand({
            title: commands[command.selected].title
          })}\n`
        )
        resolve(commands[command.selected])
      })
  })
}

export default async () => {
  const commandObject = await getCommand()
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
