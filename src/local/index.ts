import type { ICommand } from '../interface'
import polyrepoAdd from './polyrepo/add'
import polyrepoPull from './polyrepo/pull'
import polyrepoDelete from './polyrepo/delete'
import polyrepoCreate from './polyrepo/create'
import scriptAdd from './script/add'
import submoduleAdd from './submodule/add'
import submoduleDelete from './submodule/delete'
import submoduleUpdate from './submodule/update'

export const getLocalCommands = async () => {
  const localCommands: ICommand[] = []

  await polyrepoCreate(localCommands)
  await polyrepoAdd(localCommands)
  await polyrepoPull(localCommands)
  await polyrepoDelete(localCommands)

  await scriptAdd(localCommands)

  await submoduleAdd(localCommands)
  await submoduleDelete(localCommands)
  await submoduleUpdate(localCommands)

  return localCommands
}
