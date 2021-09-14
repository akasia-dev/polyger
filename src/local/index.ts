import type { ICommand } from '../interface'
import polyrepoAdd from './polyrepo/add'
import polyrepoPull from './polyrepo/pull'
import polyrepoCreate from './polyrepo/create'
import scriptAdd from './script/add'
import submoduleAdd from './submodule/add'
import submoduleDelete from './submodule/delete'

export const getLocalCommands = async () => {
  const localCommands: ICommand[] = []

  await polyrepoCreate(localCommands)
  await polyrepoAdd(localCommands)
  await polyrepoPull(localCommands)

  await scriptAdd(localCommands)

  await submoduleAdd(localCommands)
  await submoduleDelete(localCommands)

  return localCommands
}
