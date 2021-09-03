import type { ICommand } from '../interface'
import pull from './pull'
import script from './script'

export const getLocalCommands = async () => {
  const localCommands: ICommand[] = []
  await pull(localCommands)
  await script(localCommands)

  return localCommands
}
