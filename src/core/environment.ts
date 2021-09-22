import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { inquirer } from './inquirer'
import { ISecretData } from '../interface'
import { animateText, loadJSONFile } from './utils'
import getLocale from '../../locale'
import { choice } from './utils'
import { clone, fetchBranchList, init } from './github'
import {
  createOrganizationRepo,
  createUserRepo,
  getRepoList,
  selectOrganization
} from '../local/utils'

const initializeEnvironment = async () => {
  const locale = await getLocale()
  const projectPath = path.resolve(process.cwd())
  const polygerSecretJsonPath = path.resolve(
    projectPath,
    '.polyger.secret.json'
  )
  const secretData: ISecretData = {
    ...(await loadJSONFile(polygerSecretJsonPath))
  }

  let isNewestUpdateExist = false
  if (!secretData.githubToken || secretData.githubToken.length === 0) {
    console.log(chalk.magentaBright(locale.polygerIntro()) + '\n\n')
    console.log(
      locale.currentPathIsNotDetectedAnyPolygerProject({
        currentPath: chalk.gray(process.cwd())
      }) + '\n'
    )

    const { isProceed } = await inquirer.prompt({
      type: 'confirm',
      name: 'isProceed',
      message: locale.shoudWeCreateNewPolygerProject()
    })

    if (!isProceed) process.exit(0)

    await animateText('\n' + locale.messageOfNeedToken())
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

  if (!fs.existsSync(path.resolve(process.cwd(), '.git', 'HEAD'))) {
    console.log('\n' + locale.polygerRequiredGitProjectRepo() + '\n')

    const initializeSolutions = [
      locale.gitRepoInitializeGithub(),
      locale.gitRepoInitializeOnLocal()
    ]

    const isLocal =
      (await choice({
        message: locale.pleaseSelectGitRepoInitializeSolution() + '\n',
        items: initializeSolutions
      })) == locale.gitRepoInitializeOnLocal()

    if (isLocal) {
      await init({
        cwd: process.cwd(),
        onMessage: (message) => console.log(message),
        onErrorMessage: (message) => console.log(message)
      })
    } else {
      const { githubToken, githubUserName } = secretData
      try {
        const { isOrganization, selectedOrganization } =
          await selectOrganization({
            githubToken: githubToken!,
            githubUserName: githubUserName!,
            locale,
            itCanBeMe: true
          })

        const { repoName } = await inquirer.prompt({
          type: 'input',
          name: 'repoName',
          message: locale.pleaseInputRepoName(),
          validate: (inputText: string) => inputText && inputText.length > 0
        })

        const repoList = await getRepoList({
          isOrganization,
          githubToken: githubToken!,
          organizationName: selectedOrganization,
          githubUserName,
          locale
        })

        const { isPrivateRepo } = await inquirer.prompt({
          type: 'confirm',
          name: 'isPrivateRepo',
          message: locale.isItPrivateRepo(),
          validate: (inputText: string) => inputText && inputText.length > 0
        })

        const repoUrl = `github.com/${
          isOrganization ? selectedOrganization : githubUserName
        }/${repoName}.git`

        if (repoList.includes(repoName)) {
          const { shouldClontIt } = await inquirer.prompt({
            type: 'confirm',
            name: 'shouldClontIt',
            message: locale.itAlreadyExistRepositoryCouldYouCloneIt(),
            validate: (inputText: string) => inputText && inputText.length > 0
          })
          if (!shouldClontIt) return
        } else {
          const { description } = await inquirer.prompt({
            type: 'input',
            name: 'description',
            message: locale.pleaseTypeRepoDescription(),
            validate: (inputText: string) => inputText && inputText.length > 0
          })

          if (isOrganization) {
            await createOrganizationRepo({
              githubToken: githubToken!,
              organizationName: selectedOrganization,
              repoName,
              isPrivateRepo,
              description,
              locale
            })
          } else {
            await createUserRepo({
              githubToken: githubToken!,
              repoName,
              isPrivateRepo,
              description,
              locale
            })
          }

          console.log(
            '\n' +
              locale.successfullyCreatedRepository() +
              `\nURL: ${repoUrl}\n`
          )
        }

        const branches = (
          await fetchBranchList({
            githubToken: githubToken!,
            ownerName: isOrganization ? selectedOrganization! : githubUserName!,
            repoName
          })
        ).map((branch) => branch.name)

        const repoBranch = await choice({
          items: branches,
          message: locale.pleaseEnterRepoBranch()
        })

        await clone({
          githubToken: githubToken!,
          githubUserName: githubUserName!,
          name: '.',
          url: repoUrl,
          branch: repoBranch,
          cwd: process.cwd(),
          onMessage: (message) => console.log(message),
          onErrorMessage: (message) => console.log(message)
        })
      } catch (error) {
        console.log(error)
        console.log(locale.failedGithubApiFetch())
      }
    }
  }

  if (isNewestUpdateExist)
    fs.writeFileSync(polygerSecretJsonPath, JSON.stringify(secretData, null, 2))
}

export default initializeEnvironment
