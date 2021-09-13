import type { ICommand } from '../interface'
import getLocale from '../../locale/index'
import getConfigData, { getConfigPath } from '../core/setup'
import { choice } from '../core/utils'
import { getRepos } from '../core/polyrepo'
import path from 'path'

export default async (commands: ICommand[]) => {
  const locale = await getLocale()
  commands.push({
    title: locale.commandAddSubmodule(),
    localFunction
  })
}

const localFunction = async () => {
  const locale = await getLocale()
  const { configData, secretData } = await getConfigData()
  const configPath = getConfigPath()

  console.log(locale.pleaseSelectCategoryToCreateSubmodule())

  const category = await choice({
    items: configData.subFolders!,
    message: locale.pleaseSelectCategoryToCreateSubmodule()
  })

  const categoryData = await getRepos(
    path.resolve(configPath.projectPath, category)
  )
  if (categoryData?.packageList.length && categoryData.packageList.length > 0) {
    const project = await choice({
      items: configData.subFolders!,
      message: locale.pleaseSelectCategoryToCreateSubmodule()
    })

    console.log({
      category,
      project
    })
  } else {
    //
  }
}

if (process.argv?.[1] === __filename) localFunction()
