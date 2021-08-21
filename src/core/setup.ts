import path from 'path'
import fs from 'fs'

import { inquirer } from './inquire'
import { animateText, loadJSONFile } from './utils'
import type { IConfigData, ISecretData } from '../interface'
import getLocale from '../../locale'

export const getconfigData = async () => {
  const projectPath = path.resolve(process.cwd())
  const polygerConfigJsonPath = path.resolve(
    projectPath,
    '.polyger.config.json'
  )
  const polygerSecretJsonPath = path.resolve(
    projectPath,
    '.polyger.secret.json'
  )

  const configData: IConfigData = {
    ...(await loadJSONFile(polygerConfigJsonPath))
  }
  const secretData: ISecretData = {
    ...(await loadJSONFile(polygerSecretJsonPath))
  }

  const locale = await getLocale()
  let isNewestUpdateExist = false

  // * Sub Folders
  if (!configData.subFolders || configData.subFolders.length === 0) {
    const { subFolders } = await inquirer.prompt({
      type: 'input',
      name: 'subFolders',
      message: locale.messageOfSubFolders()
    })
    configData.subFolders = (subFolders as string)
      .split(' ')
      .join('')
      .split(',')

    isNewestUpdateExist = true
  }

  // * Initiate Sub Folders
  for (const subFolder of configData.subFolders) {
    const subFolderPath = path.resolve(projectPath, subFolder)
    const subFolderIndexFilePath = path.resolve(
      subFolderPath,
      '.polyger.list.json'
    )
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
  if (!secretData.githubToken || secretData.githubToken.length === 0) {
    await animateText(locale.messageOfNeedToken())

    const { githubToken } = await inquirer.prompt({
      type: 'password',
      mask: '*',
      name: 'githubToken',
      message: locale.pleaseEnterGithubCLIToken()
    })
    secretData.githubToken = githubToken
    isNewestUpdateExist = true
  }

  // * githubUserName
  if (!secretData.githubUserName || secretData.githubUserName.length === 0) {
    const { username } = await inquirer.prompt({
      type: 'input',
      name: 'username',
      message: locale.pleaseEnterUsername()
    })
    secretData.githubUserName = username
    isNewestUpdateExist = true
  }

  if (isNewestUpdateExist) {
    fs.writeFileSync(polygerConfigJsonPath, JSON.stringify(configData, null, 2))
    fs.writeFileSync(polygerSecretJsonPath, JSON.stringify(secretData, null, 2))
  }

  return {
    ...configData,
    ...secretData
  }
}

export default getconfigData
