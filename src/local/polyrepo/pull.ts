import type { ICommand } from '../../interface'
import * as github from '../../core/github'
import { getPackages } from '../../core/polyrepo'
import getLocale from '../../../locale/index'
import getConfigData from '../../core/setup'

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
  const { secretData } = await getConfigData()

  try {
    for (const packageItem of packages) {
      console.log(
        locale.downloadingPolyrepos({ packageName: packageItem.packageName })
      )
      await github.pull({
        name: packageItem.packageName,
        cwd: packageItem.packagePath,
        githubToken: secretData.githubToken!,
        githubUserName: secretData.githubUserName!,
        onErrorMessage: (error) => console.error(error),
        onMessage: (message) => console.log(message)
      })
    }
  } catch (error) {
    console.log(error)
    console.log(locale.failedGithubApiFetch())
  }
}

if (process.argv?.[1] === __filename) localFunction()
