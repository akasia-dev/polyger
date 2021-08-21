import type { ICommand } from '../interface'
import getLocale from '../../locale'
import { choice } from '../core/utils'

export default async (commands: ICommand[]) => {
  const locale = await getLocale()
  commands.push({
    title: locale.commandPull(),
    localFunction
  })
}

const localFunction = async () => {
  const locale = await getLocale()
  const choiced = await choice({
    message: `업데이트 하려는 버전 유형을 입력해주세요.
현재 패키지 버전: {currentVersion}\n`,
    items: [
      'None',
      'Patch ({patchVersion})',
      'Minor ({minorVersion})',
      'Major ({majorVersion})'
    ]
  })
  console.log({ choiced })
}

if (process.argv?.[1] === __filename) localFunction()
