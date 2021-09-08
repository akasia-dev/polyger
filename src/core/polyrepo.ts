import path from 'path'
import fs from 'fs/promises'
import { animateText } from './utils.js'
import { inquirer } from './inquire.js'
import getSetupData from './setup.js'
import * as github from './github.js'
import getLocale from '../../locale/index.js'

const projectPath = path.resolve(process.cwd())

export const getRepos = async (projectPath: string) => {
  try {
    const listJSON: {
      package: Record<string, any>
    } = JSON.parse(
      String(await fs.readFile(path.join(projectPath, '.polyger.list.json')))
    )
    const packageList = Object.keys(listJSON.package)

    const packagePath = path.join(projectPath, 'package')
    const packageFolders = (
      await fs.readdir(packagePath, {
        withFileTypes: true
      })
    )
      .filter((e) => e.isDirectory())
      .map((e) => e.name)

    return {
      package: listJSON.package,
      packageList,
      packageFolders,
      packagePath
    }
  } catch (e) {}

  return null
}

export const getTargetProjectPaths = async () => {
  const { subFolders } = await getSetupData()
  if (!subFolders) return [] as string[]
  return subFolders.map((name) => path.resolve(projectPath, name))
}

export const getPackages = async () => {
  const packages: {
    packageName: string
    packagePath: string
    url: string
  }[] = []

  const targetProjectPaths = await getTargetProjectPaths()
  for (const targetProjectPath of targetProjectPaths) {
    const repos = await getRepos(targetProjectPath)
    if (!repos) continue

    for (const packageName of repos.packageList) {
      if (repos.packageFolders.includes(packageName)) {
        packages.push({
          packageName,
          packagePath: repos.packagePath,
          url: repos.package[packageName].url
        })
      }
    }
  }

  return packages
}

export const init = async () => {
  const locale = await getLocale()

  const needToInitProjects: {
    packageName: string
    packagePath: string
    url: string
    branch: string
  }[] = []

  const targetProjectPaths = await getTargetProjectPaths()
  for (const targetProjectPath of targetProjectPaths) {
    const repos = await getRepos(targetProjectPath)
    if (!repos) continue

    for (const packageName of repos.packageList) {
      if (!repos.packageFolders.includes(packageName)) {
        needToInitProjects.push({
          packageName,
          packagePath: repos.packagePath,
          url: repos.package[packageName].url,
          branch: repos.package[packageName].branch
        })
      }
    }
  }

  if (needToInitProjects.length === 0) return
  await animateText(
    `${locale.messageOfClone({
      count: needToInitProjects.length,
      list: needToInitProjects.map((e) => `"${e.packageName}"`).join(', ')
    })}\n`
  )

  const { isProceed } = await inquirer.prompt({
    type: 'confirm',
    name: 'isProceed',
    message: locale.shallWeClone()
  })

  if (!isProceed) return

  const { githubToken, githubUserName } = await getSetupData()
  for (const { packageName, packagePath, url, branch } of needToInitProjects) {
    await github.clone({
      cwd: packagePath,
      githubToken: githubToken!,
      githubUserName: githubUserName!,
      name: packageName,
      branch,
      url,
      onMessage: (message) => console.log(message),
      onError: (message) => console.log(message),
      onErrorMessage: (message) => console.log(message)
    })
  }
}

export default init
