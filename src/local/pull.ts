import type { ICommand } from '../interface'
import * as github from '../core/github'
import { getPackages } from '../core/polyrepo'
import getLocale from '../../locale'

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
