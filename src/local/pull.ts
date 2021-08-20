import type { ICommand } from '../interface'
import * as github from '../core/github'
import { getPackages } from '../core/polyrepo'

export default (commands: ICommand[]) => {
  commands.push({
    title: '프로젝트 전체 깃허브 갱신(pull)',
    localFunction
  })
}

const localFunction = async () => {
  const packages = await getPackages()
  for (const packageItem of packages) {
    console.log(`${packageItem.packageName} 프로젝트 받아오는 중...`)
    await github.pull({
      cwd: packageItem.packagePath,
      onError: (error) => console.error(error),
      onErrorMessage: (error) => console.error(error),
      onMessage: (message) => console.log(message)
    })
  }
}
