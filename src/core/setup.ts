import path from 'path'
import { inquirer } from './inquire'
import fs from 'fs'

import { animateText, loadJSONFile } from './utils'
import type { IEnv } from '../interface'
import getLocale from '../../locale'

export const getSetupData = async () => {
  const projectPath = path.resolve(process.cwd())
  const projectDotEnvPath = path.resolve(projectPath, '.env.json')

  let setupData: IEnv = {
    ...(await loadJSONFile(projectDotEnvPath))
  }

  const locale = await getLocale()

  // * Sub Folders
  if (!setupData.subFolders || setupData.subFolders.length === 0) {
    const { subFolders } = await inquirer.prompt({
      type: 'input',
      name: 'subFolders',
      message: locale.messageOfSubFolders()
    })
    setupData.subFolders = (subFolders as string).split(' ').join('').split(',')
  }

  // * Initiate Sub Folders
  for (const subFolder of setupData.subFolders) {
    const subFolderPath = path.resolve(projectPath, subFolder)
    const subFolderIndexFilePath = path.resolve(subFolderPath, 'list.json')
    const subFolderPackageFolderPath = path.resolve(subFolderPath, 'package')
    if (!fs.existsSync(subFolderIndexFilePath)) {
      fs.mkdirSync(subFolderPath, { recursive: true })
      fs.mkdirSync(subFolderPackageFolderPath, { recursive: true })
      fs.writeFileSync(
        subFolderIndexFilePath,
        JSON.stringify({ package: {} }, null, 2)
      )
    }
  }

  // * githubToken
  if (!setupData.githubToken || setupData.githubToken.length === 0) {
    await animateText(locale.messageOfNeedToken())

    const { githubToken } = await inquirer.prompt({
      type: 'password',
      mask: '*',
      name: 'githubToken',
      message: locale.messageOfSubFolders()
    })
    setupData.githubToken = githubToken
  }

  // * githubUserName
  if (!setupData.githubUserName || setupData.githubUserName.length === 0) {
    const { username } = await inquirer.prompt({
      type: 'input',
      name: 'username',
      message: locale.pleaseEnterUsername()
    })
    setupData.githubUserName = username
  }

  fs.writeFileSync(projectDotEnvPath, JSON.stringify(setupData, null, 2))
  return setupData
}

export default getSetupData
