import fs from 'fs/promises'
import chalkAnimation from 'chalkercli'
import { inquirer } from './inquire'

export const loadJSONFile = async (filePath: string) => {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch (e) {
    return null
  }
}

export const choice = (props: { message: string; items: string[] }) => {
  return new Promise<string>(async (resolve) => {
    inquirer
      .prompt([
        {
          type: 'search-list',
          message: props.message,
          name: 'selected',
          choices: props.items.map((command, index) => ({
            name: command,
            value: index
          })),
          validate: (_answer) => true
        }
      ])
      .then((command) => {
        resolve(props.items[command.selected])
      })
  })
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const animateText = async (text: string, delayMs = 1000) => {
  const effect = chalkAnimation.pulse(text)
  await delay(delayMs)
  effect.stop()
}
