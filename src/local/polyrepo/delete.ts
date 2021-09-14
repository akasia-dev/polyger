import type { ICommand } from '../../interface'
import getLocale from '../../../locale/index'
import getConfigData, { getConfigPath } from '../../core/setup'
import { choice } from '../../core/utils'
import { getRepos } from '../../core/polyrepo'
import { inquirer } from '../../core/inquire'
import path from 'path'
import { existsSync, readFileSync, rmdirSync, writeFileSync } from 'fs'

export default async (commands: ICommand[]) => {
  const locale = await getLocale()
  commands.push({
    title: locale.commandDeletePolyRepo(),
    localFunction
  })
}

const localFunction = async () => {
  const locale = await getLocale()

  const { configData } = await getConfigData()
  const configPath = getConfigPath()

  const category = await choice({
    items: configData.subFolders!,
    message: locale.pleaseSelectCategoryOfDeleteProject()
  })

  const categoryData = await getRepos(
    path.resolve(configPath.projectPath, category)
  )
  if (categoryData?.packageList.length && categoryData.packageList.length > 0) {
    const project = await choice({
      items: categoryData.packageList,
      message: locale.pleaseSelectProjectOfDelete()
    })

    await inquirer.prompt({
      type: 'input',
      name: 'checkAgain',
      message: locale.reallySureToDeleteProject({ name: project }),
      validate: (inputText: string) => project == inputText
    })

    const targetProjectFolderPath = path.resolve(
      configPath.projectPath,
      category,
      'package',
      project
    )
    if (existsSync(targetProjectFolderPath))
      rmdirSync(targetProjectFolderPath, { recursive: true })

    const listJsonPath = path.resolve(
      configPath.projectPath,
      category,
      '.polyger.list.json'
    )
    const listJson = JSON.parse(String(readFileSync(listJsonPath))) ?? {
      package: {}
    }

    if (
      listJson['package'] &&
      typeof listJson['package'][project] !== 'undefined'
    )
      delete listJson['package'][project]
    writeFileSync(listJsonPath, JSON.stringify(listJson, null, 2))

    console.log(
      locale.finishedDeletePolyRepo({
        name: project
      })
    )
  } else {
    console.log(locale.noProjectsInCategory())
  }
}

if (process.argv?.[1] === __filename) localFunction()
