import { Translation } from '../i18n-types'

const ko: Translation = {
  messageOfNeedToken: `GitHub 레포 클론을 위한 엑세스 토큰이 필요합니다.
GitHub 엑세스 토큰 발급 방법: (URL)
https://git.io/JsPkj`,

  messageOfClone: `
프로젝트 동작을 위해 GitHub 에 있는 폴리레포들을 받아와야합니다.
총 클론해야하는 폴리레포 수는 {count} 개 입니다.

새로 받아오는 폴리레포 목록: {list}`,

  messageOfSubFolders: `폴리레포 카테고리를 한 개 이상 입력해주세요.
입력 예시: frontend, backend, release

각 카테고리 폴더가 최상단에 생성되며, 하위에 폴리레포가 추가할 수 있습니다.
입력 시엔 , 로 구분지으면 여러 폴더를 입력할 수 있습니다.

폴리레포 분류:
`,

  pleaseEnterGithubCLIToken: 'GitHub CLI 토큰을 입력해주세요.',
  pleaseEnterUsername: 'GitHub 유저명을 입력해주세요. (이메일이 아닌 아이디)',
  selectCommandWantToExecute:
    '사용하실 프로젝트 명령어를 선택해주세요.\n명령어를 선택하시면 해당 명령어가 실행됩니다.\n',
  runningCommand: '"{title}" 실행 중...',

  shallWeClone: '프로젝트 레포를 받아올까요?',
  commandPull: '프로젝트 전체 깃허브 갱신 (pull)',
  downloadingPolyrepos: '"{packageName}" 폴리레포 받아오는 중...'
}

export default ko
