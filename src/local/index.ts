import type { ICommand } from '../interface'
import pull from './pull.js'
import script from './script.js'
import polyrepo from './polyrepo.js'

export const getLocalCommands = async () => {
  const localCommands: ICommand[] = []
  await pull(localCommands)
  await script(localCommands)
  await polyrepo(localCommands)

  return localCommands
}
