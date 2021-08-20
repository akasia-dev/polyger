import path from 'path'
import { inquirer } from './inquire'
import fs from 'fs/promises'

import { animateText, loadJSONFile } from './utils'
import type { IEnv } from '../interface'
import getLocale from '../../locale'

export const getSetupData = async () => {
  const projectPath = path.resolve(__dirname, '../../../../../../../')
  const projectDotEnvPath = path.resolve(projectPath, '.env.json')

  let setupData: IEnv = {
    ...(await loadJSONFile(projectDotEnvPath))
  }

  const locale = await getLocale()
  if (!setupData.githubToken || setupData.githubToken.length === 0) {
    await animateText(locale.messageOfNeedToken())

    const { githubToken } = await inquirer.prompt({
      type: 'password',
      mask: '*',
      name: 'githubToken',
      message: locale.pleaseEnterGithubCLIToken()
    })
    setupData.githubToken = githubToken
  }

  if (!setupData.githubUserName || setupData.githubUserName.length === 0) {
    const { username } = await inquirer.prompt({
      type: 'input',
      name: 'username',
      message: locale.pleaseEnterUsername()
    })
    setupData.githubUserName = username
  }

  await fs.writeFile(projectDotEnvPath, JSON.stringify(setupData, null, 2))
  return setupData
}

export default getSetupData
