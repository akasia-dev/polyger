import type { ICommand } from '../interface'
import pull from './pull'
import script from './script'
import polyrepo from './polyrepo'

export const getLocalCommands = async () => {
  const localCommands: ICommand[] = []
  await pull(localCommands)
  await script(localCommands)
  await polyrepo(localCommands)

  return localCommands
}
