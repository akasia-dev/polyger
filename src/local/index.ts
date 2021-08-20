import type { ICommand } from '../interface'
import pull from './pull'

const localCommands: ICommand[] = []
pull(localCommands)

export { localCommands }
