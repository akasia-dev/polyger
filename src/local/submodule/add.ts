import path from 'path'
import type { ICommand } from '../../interface'
import getLocale from '../../../locale/index'
import getConfigData, { getConfigPath } from '../../core/setup'
import { choice } from '../../core/utils'
import { getRepos } from '../../core/polyrepo'
import { inquirer } from '../../core/inquire'
import { getRepoList, selectOrganization } from '../utils'
import { submodule } from '../../core/github'

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
  const { githubToken, githubUserName } = secretData
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
      items: categoryData.packageList,
      message: locale.pleaseSelectProjectToCreateSubmodule()
    })

    const { submodulePath } = await inquirer.prompt({
      type: 'input',
      name: 'submodulePath',
      message: locale.pleaseEnterDetailSubmodulePathToSave(),
      validate: (input: string) => input && input.length > 0
    })

    try {
      const { isOrganization, selectedOrganization } = await selectOrganization(
        {
          githubToken: githubToken!,
          githubUserName: githubUserName!,
          locale,
          itCanBeMe: true
        }
      )

      const repoList = await getRepoList({
        isOrganization,
        githubToken: githubToken!,
        organizationName: selectedOrganization,
        githubUserName,
        locale
      })

      const gitProject = await choice({
        items: repoList,
        message: locale.pleaseSelectGitProjectAsSubmodule()
      })

      const { branch } = await inquirer.prompt({
        type: 'input',
        name: 'branch',
        message: locale.pleaseEnterRepoBranch(),
        validate: (input: string) => input && input.length > 0
      })

      const targetPath = path.resolve(
        configPath.projectPath,
        category,
        'package',
        project
      )

      await submodule({
        path: submodulePath,
        url: `github.com/${
          isOrganization ? selectedOrganization : githubUserName
        }/${gitProject}.git`,
        githubUserName: githubUserName!,
        githubToken: githubToken!,
        cwd: targetPath,
        branch,
        onMessage: (message) => console.log(message),
        onErrorMessage: (message) => console.log(message),
        onError: (message) => console.log(message)
      })
    } catch (e) {}
  } else {
    console.log(locale.polyrepoIsEmptyPleaseAddOne())
  }
}

if (process.argv?.[1] === __filename) localFunction()
