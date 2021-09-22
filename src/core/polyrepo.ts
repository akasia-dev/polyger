import path from 'path'
import fs from 'fs/promises'
import { inquirer } from './inquirer'
import getSetupData from './setup'
import * as github from './github'
import getLocale from '../../locale/index'

const projectPath = path.resolve(process.cwd())

export const getRepos = async (categoryPath: string) => {
  try {
    const listJSON: {
      package: Record<string, any>
    } = JSON.parse(
      String(await fs.readFile(path.join(categoryPath, '.polyger.list.json')))
    )
    const packageList = Object.keys(listJSON.package)
    const packageFolders = (
      await fs.readdir(categoryPath, {
        withFileTypes: true
      })
    )
      .filter((e) => e.isDirectory())
      .map((e) => e.name)

    return {
      package: listJSON.package,
      packageList,
      packageFolders,
      packagePath: categoryPath
    }
  } catch (e) {}

  return null
}

export const getTargetProjectPaths = async () => {
  const { configData } = await getSetupData()
  const { subFolders } = configData
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
          packagePath: path.resolve(targetProjectPath, packageName),
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
  console.log(
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

  const { secretData } = await getSetupData()
  const { githubToken, githubUserName } = secretData

  for (const { packageName, packagePath, url, branch } of needToInitProjects) {
    const selectedSubFolder = packagePath
      .split(process.cwd())[1]
      .replace(/^\//, '')

    console.log(`${selectedSubFolder}/${packageName}`)
    await github.submodule({
      url,
      branch,
      cwd: process.cwd(),
      githubToken: githubToken!,
      githubUserName: githubUserName!,
      onErrorMessage: (message) => console.log(message),
      onMessage: (message) => console.log(message),
      path: `${selectedSubFolder}/${packageName}`
    })
  }
}

export default init
