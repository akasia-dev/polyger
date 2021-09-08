import type { ICommand } from '../interface.js'
import * as github from '../core/github.js'
import { getPackages } from '../core/polyrepo.js'
import getLocale from '../../locale/index.js'

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);


export default async (commands: ICommand[]) => {
  const locale = await getLocale()
  commands.push({
    title: locale.commandPull(),
    localFunction
  })
}

const localFunction = async () => {
  const packages = await getPackages()
  const locale = await getLocale()
  for (const packageItem of packages) {
    console.log(
      locale.downloadingPolyrepos({ packageName: packageItem.packageName })
    )
    await github.pull({
      cwd: packageItem.packagePath,
      onError: (error) => console.error(error),
      onErrorMessage: (error) => console.error(error),
      onMessage: (message) => console.log(message)
    })
  }
}

if (process.argv?.[1] === __filename) localFunction()
