import fs from 'fs/promises'
import chalkAnimation from 'chalkercli'

export const loadJSONFile = async (filePath: string) => {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch (e) {
    return null
  }
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const animateText = async (text: string, delayMs = 1000) => {
  const effect = chalkAnimation.pulse(text)
  await delay(delayMs)
  effect.stop()
}
