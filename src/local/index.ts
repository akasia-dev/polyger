import type { ICommand } from '../interface'
import pull from './pull'
import script from './script'
import polyrepo from './polyrepo'
import createRepo from './createRepo'
import submodule from './submodule'

export const getLocalCommands = async () => {
  const localCommands: ICommand[] = []
  await pull(localCommands)
  await script(localCommands)
  await polyrepo(localCommands)
  await createRepo(localCommands)
  await submodule(localCommands)

  return localCommands
}
