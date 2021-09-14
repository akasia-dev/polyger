import path from 'path'
import { existsSync, readFileSync } from 'fs'
import patternGrab from 'pattern-grab'

import type { ICommand } from '../../interface'
import * as github from '../../core/github'
import { getPackages, getRepos } from '../../core/polyrepo'
import getLocale from '../../../locale/index'
import { choice } from '../../core/utils'
import getConfigData, { getConfigPath } from '../../core/setup'

export default async (commands: ICommand[]) => {
  const locale = await getLocale()
  commands.push({
    title: locale.commandDeleteSubmodule(),
    localFunction
  })
}

const localFunction = async () => {
  const locale = await getLocale()
  const { configData, secretData } = await getConfigData()
  const { githubToken, githubUserName } = secretData
  const configPath = getConfigPath()

  const category = await choice({
    items: configData.subFolders!,
    message: locale.pleaseSelectCategoryToDeleteSubmodule()
  })

  const categoryData = await getRepos(
    path.resolve(configPath.projectPath, category)
  )
  if (categoryData?.packageList.length && categoryData.packageList.length > 0) {
    const project = await choice({
      items: categoryData.packageList,
      message: locale.pleaseSelectProjectToDeleteSubmodule()
    })

    const gitModulesFilePath = path.resolve(
      configPath.projectPath,
      category,
      'package',
      project,
      '.gitmodules'
    )

    if (!existsSync(gitModulesFilePath)) {
      console.log(locale.submoduleDoesntExist())
      return
    }

    const gitModulesContent = String(readFileSync(gitModulesFilePath))
    const { data, positions } = patternGrab({
      regex: /path.*=.*(\S+)/gm,
      string: gitModulesContent
    })
    const submodulePaths = data
      .filter((_, index) => positions.includes(index))
      .map((item: string) => item.split('=')[1].trim())

    const submodulePath = await choice({
      items: submodulePaths,
      message: locale.pleaseEnterDetailSubmodulePathToDelete()
    })

    await github.submoduleDelete({
      cwd: path.resolve(configPath.projectPath, category, 'package', project),
      path: submodulePath,
      onMessage: (message) => console.log(message),
      onError: (message) => console.log(message),
      onErrorMessage: (message) => console.log(message)
    })
  } else {
    console.log(locale.polyrepoIsEmptyPleaseAddOne())
  }
}

if (process.argv?.[1] === __filename) localFunction()
