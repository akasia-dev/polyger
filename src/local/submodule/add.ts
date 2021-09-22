import path from 'path'
import type { ICommand } from '../../interface'
import getLocale from '../../../locale/index'
import getConfigData, { getConfigPath } from '../../core/setup'
import { choice } from '../../core/utils'
import { getRepos } from '../../core/polyrepo'
import { inquirer } from '../../core/inquirer'
import { getRepoList, selectOrganization } from '../utils'
import { fetchBranchList, submodule } from '../../core/github'

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

      const branches = (
        await fetchBranchList({
          githubToken: githubToken!,
          ownerName: isOrganization ? selectedOrganization! : githubUserName!,
          repoName: gitProject
        })
      ).map((branch) => branch.name)

      const branch = await choice({
        items: branches,
        message: locale.pleaseEnterRepoBranch()
      })
      const targetPath = path.resolve(configPath.projectPath, category, project)

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
        onErrorMessage: (message) => console.log(message)
      })
    } catch (error) {
      console.log(error)
      console.log(locale.failedGithubApiFetch())
    }
  } else {
    console.log(locale.polyrepoIsEmptyPleaseAddOne())
  }
}

if (process.argv?.[1] === __filename) localFunction()
