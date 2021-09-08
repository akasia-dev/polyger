import path from 'path'
import fs from 'fs'

import { inquirer } from './inquire'
import { animateText, loadJSONFile } from './utils'
import type { IConfigData, ISecretData } from '../interface'
import getLocale from '../../locale/index'
import { promisify } from 'util'
import { exec } from 'child_process'

export const getConfigPath = () => {
  const projectPath = path.resolve(process.cwd())
  const polygerConfigJsonPath = path.resolve(
    projectPath,
    '.polyger.config.json'
  )
  const polygerSecretJsonPath = path.resolve(
    projectPath,
    '.polyger.secret.json'
  )
  const polygerPackageJsonPath = path.resolve(projectPath, 'package.json')
  return {
    projectPath,
    polygerConfigJsonPath,
    polygerSecretJsonPath,
    polygerPackageJsonPath
  }
}

export const getConfigData = async () => {
  const {
    polygerConfigJsonPath,
    polygerPackageJsonPath,
    projectPath,
    polygerSecretJsonPath
  } = getConfigPath()

  const configData: IConfigData = {
    ...(await loadJSONFile(polygerConfigJsonPath))
  }
  const secretData: ISecretData = {
    ...(await loadJSONFile(polygerSecretJsonPath))
  }

  const locale = await getLocale()
  let isNewestUpdateExist = false

  let isFirstRunning = false

  // * package.json
  if (!fs.existsSync(polygerPackageJsonPath)) {
    isFirstRunning = true

    fs.writeFileSync(
      polygerPackageJsonPath,
      JSON.stringify(
        {
          name: 'polyrepo',
          version: '1.0.0',
          scripts: {
            start: 'polyger'
          }
        },
        null,
        2
      )
    )

    if (!process.argv.includes('--dev')) {
      await promisify(exec)('npm i -D polyger', {
        cwd: process.cwd()
      })
    } else {
      await promisify(exec)('npm i -D ../', {
        cwd: process.cwd()
      })
    }
  }

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

  // * shellScriptFolderName
  if (
    !configData.shellScriptFolderName ||
    configData.shellScriptFolderName.length === 0
  ) {
    const { shellScriptFolderName } = await inquirer.prompt({
      type: 'input',
      name: 'shellScriptFolderName',
      message: locale.pleaseSelectShellScriptFolderName()
    })
    if (shellScriptFolderName.length === 0) {
      configData.shellScriptFolderName = 'sh'
    } else {
      configData.shellScriptFolderName = shellScriptFolderName
    }

    isNewestUpdateExist = true
  }

  const shellScriptFolderPath = path.resolve(
    projectPath,
    configData.shellScriptFolderName || 'sh'
  )

  if (!fs.existsSync(shellScriptFolderPath))
    fs.mkdirSync(shellScriptFolderPath, { recursive: true })

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
    const configDataForSave = { ...configData }
    if (typeof configDataForSave.isFirstRunning !== 'undefined')
      delete configDataForSave.isFirstRunning
    fs.writeFileSync(
      polygerConfigJsonPath,
      JSON.stringify(configDataForSave, null, 2)
    )
    fs.writeFileSync(polygerSecretJsonPath, JSON.stringify(secretData, null, 2))
  }

  // * .gitignore
  if (isFirstRunning) {
    const gitIgnoreFilePath = path.resolve(projectPath, '.gitignore')
    let gitIgnoreFullText = `# Polyger Files\n` + '.polyger.secret.json\n'
    for (const subFolder of configData.subFolders) {
      gitIgnoreFullText += `${subFolder}/package/*\n`
      gitIgnoreFullText += `!${subFolder}/package/README.md\n`
    }

    if (fs.existsSync(gitIgnoreFilePath)) {
      const beforeText = String(fs.readFileSync(gitIgnoreFilePath))
      fs.writeFileSync(gitIgnoreFilePath, beforeText + `\n` + gitIgnoreFullText)
    } else {
      fs.writeFileSync(gitIgnoreFilePath, gitIgnoreFullText)
    }
  }

  // * welcome
  if (isFirstRunning) console.log('\n\n' + locale.afterFirstInitWelcome())

  return {
    ...configData,
    ...secretData,
    isFirstRunning
  }
}

export default getConfigData
