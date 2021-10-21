import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { exec } from 'child_process'
import chalk from 'chalk'

import { inquirer } from './inquirer'
import { animateText, loadJSONFile } from './utils'
import type { IConfigData, ISecretData } from '../interface'
import getLocale from '../../locale/index'

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
      message: locale.messageOfSubFolders({
        example: chalk.magentaBright(`frontend, backend, release`)
      })
    })
    configData.subFolders = (subFolders as string).replace(/,/g, '').split(' ')
    isNewestUpdateExist = true
  }

  // * Initiate Sub Folders
  for (const subFolder of configData.subFolders) {
    const subFolderPath = path.resolve(projectPath, subFolder)
    const subFolderIndexFilePath = path.resolve(
      subFolderPath,
      '.polyger.list.json'
    )
    if (!fs.existsSync(subFolderIndexFilePath)) {
      fs.mkdirSync(subFolderPath, { recursive: true })
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
      message: locale.pleaseSelectShellScriptFolderName(),
      transformer: (inputText: string) => {
        return inputText && inputText.length > 0 ? inputText : 'script'
      }
    })
    if (shellScriptFolderName.length === 0) {
      configData.shellScriptFolderName = 'script'
    } else {
      configData.shellScriptFolderName = shellScriptFolderName
    }

    isNewestUpdateExist = true
  }

  const shellScriptFolderPath = path.resolve(
    projectPath,
    configData.shellScriptFolderName || 'script'
  )

  if (!fs.existsSync(shellScriptFolderPath))
    fs.mkdirSync(shellScriptFolderPath, { recursive: true })

  // * githubToken
  if (!secretData.githubToken || secretData.githubToken.length === 0) {
    console.log('\n')
    await animateText(locale.messageOfNeedToken())
    console.log('\n')

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

  // * .gitignore
  if (isFirstRunning) {
    const gitIgnoreFilePath = path.resolve(projectPath, '.gitignore')
    let gitIgnoreFullText =
      `# Polyger Files\n` + '.polyger.secret.json\nnode_modules\n'

    if (fs.existsSync(gitIgnoreFilePath)) {
      const beforeText = String(fs.readFileSync(gitIgnoreFilePath))
      fs.writeFileSync(gitIgnoreFilePath, beforeText + `\n` + gitIgnoreFullText)
    } else {
      fs.writeFileSync(gitIgnoreFilePath, gitIgnoreFullText)
    }
  }

  // * welcome
  if (isFirstRunning)
    console.log('\n\n' + chalk.magentaBright(locale.afterFirstInitWelcome()))

  return {
    configData,
    secretData,
    isFirstRunning
  }
}

export default getConfigData
