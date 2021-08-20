import type { ICommand } from '../interface'
import pull from './pull'

export const getLocalCommands = async () => {
  const localCommands: ICommand[] = []
  await pull(localCommands)

  return localCommands
}
