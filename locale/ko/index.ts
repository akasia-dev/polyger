import { Translation } from '../i18n-types.js'

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

  afterFirstInitWelcome: `폴리레포 최초 설정 및 구조 생성이 완료되었습니다.
폴리레포 추가 및 프로젝트 명령어 추가 또는 실행이 가능합니다.
npm start 를 입력해서 폴리레포 매니저를 실행시켜주세요.`,

  selectCommandWantToExecute:
    '사용하실 프로젝트 명령어를 선택해주세요.\n명령어를 선택하시면 해당 명령어가 실행됩니다.\n',
  runningCommand: '"{title}" 실행 중...',

  shallWeClone: '프로젝트 레포를 받아올까요?',
  commandPull: '프로젝트 전체 깃허브 갱신 (pull)',
  downloadingPolyrepos: '"{packageName}" 폴리레포 받아오는 중...',

  detectedNonInteractiveTerminal: `해당 터미널이 상호작용을 지원하지 않는 것으로 보입니다.
원활한 실행을 위해선 상호작용이 가능한 터미널이 필요합니다.

윈도우의 경우 권장되는 설치 방법은 다음과 같습니다.
1. git-bash 설치: https://git.io/JENSe
2. hyper 설치: https://git.io/JEN7V
3. hyper 설정: https://bit.ly/hyper-setup`,

  commandAddScript: '프로젝트 명령어 추가 (add-script)',

  pleaseSelectShellScriptFolderName:
    '프로젝트용 스크립트 파일들이 담길 폴더명을 입력해주세요 (기본: sh)',
  pleaseEnterScriptFileName:
    '생성하려는 스크립트 파일명을 입력해주세요. (예: my-script-file)',
  pleaseEnterScriptTitle:
    '표시될 스크립트 명령어 이름을 입력해주세요. (예:  🍉 빌드 스크립트 작동)',
  isItEntryScript: '이 명령어를 최초 프로젝트 설치 시 자동으로 실행시킬까요?',
  scriptFileCreated: `"{title}" 명령어가 추가되었습니다.
스크립트 파일을 열어서 해당 명령어를 구성해주세요.
스크립트 파일 경로: {scriptPath}`,

  commandAddPolyRepo: `폴리레포 추가하기 (add-polyrepo)`,
  pleaseSelectSubFolder: '폴리레포를 저장할 서브폴더를 선택해주세요.',
  pleaseEnterRepoUrl: `복제해올 폴리레포의 URL을 입력해주세요. (예: github.com/akasia-dev/polyger.git)`,
  pleaseEnterRepoBranch: `복제해올 폴리레포의 브랜치를 입력해주세요. (예: main)`,
  pleaseEnterRepoFolderName: `폴리레포가 저장될 폴더명을 입력해주세요.(예: polyger-main)`
}

export default ko
