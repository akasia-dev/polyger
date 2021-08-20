import setup from './core/setup'
import polyrepo from './core/polyrepo'
import commannd from './core/command'

const main = async () => {
  await setup() // 설정 파일을 확인하고 설정 파일이 없으면 설정 파일을 만듭니다.
  // await polyrepo() // 프로젝트 폴더를 확인 후 프로젝트 폴더를 깃허브에서 받아옵니다.
  // await commannd() // 명령어를 선택받은 후 명령어를 실행합니다.
}

main()
