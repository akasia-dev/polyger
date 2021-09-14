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

  afterFirstInitWelcome: `폴리레포 최초 설정 및 구조 생성이 완료되었습니다.
폴리레포 추가 및 프로젝트 명령어 추가 또는 실행이 가능합니다.
npm start 를 입력해서 폴리레포 매니저를 실행시켜주세요.`,

  selectCommandWantToExecute:
    '사용하실 프로젝트 명령어를 선택해주세요.\n명령어를 선택하시면 해당 명령어가 실행됩니다.\n',
  runningCommand: '"{title}" 실행 중...',

  shallWeClone: '프로젝트 레포를 받아올까요?',
  commandPull: '🔖 폴리레포 전체 갱신 (pull)',
  downloadingPolyrepos: '"{packageName}" 폴리레포 받아오는 중...',

  detectedNonInteractiveTerminal: `해당 터미널이 상호작용을 지원하지 않는 것으로 보입니다.
원활한 실행을 위해선 상호작용이 가능한 터미널이 필요합니다.

윈도우의 경우 권장되는 설치 방법은 다음과 같습니다.
1. git-bash 설치: https://git.io/JENSe
2. hyper 설치: https://git.io/JEN7V
3. hyper 설정: https://bit.ly/hyper-setup`,

  commandAddScript: '🔖 프로젝트 명령어 추가 (add-script)',

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

  commandAddPolyRepo: `🔖 폴리레포 추가하기 (add-polyrepo)`,
  pleaseSelectSubFolder: '폴리레포를 저장할 카테고리를 선택해주세요.',
  pleaseEnterRepoUrl: `폴리레포의 URL을 입력해주세요. (예: github.com/akasia-dev/polyger.git)`,
  pleaseEnterRepoBranch: `폴리레포의 브랜치를 입력해주세요. (예: main)`,
  pleaseEnterRepoFolderName: `폴리레포가 저장될 폴더명을 입력해주세요.(예: polyger-main)`,

  commandCreatePolyRepo: `🔖 폴리레포 깃허브에 생성하기 (create-polyrepo)`,
  pleaseSelectOrganization: `깃허브 내 위치를 선택해주세요.`,
  pleaseInputRepoName: `생성할 레포명을 입력해주세요.`,
  failedGithubApiFetch: `깃허브 API 호출 도중 문제가 발생했습니다. 토큰 권한 및 네트워크 상태를 확인해주세요.`,
  itAlreadyExistRepositoryCouldYouCloneIt: `이미 존재하는 레포입니다. 해당 레포를 그대로 클론해올까요? 아니면 중단할까요?`,
  isItPrivateRepo: `비공개(private) 저장소로 생성하시겠습니까?`,
  pleaseTypeRepoDescription: `레포에 대한 설명을 작성해주세요. (Github 에 업로드 됩니다.)`,
  successfullyCreatedRepository: `레포가 깃허브에 성공적으로 생성되었습니다.`,

  isThisRelatedOfMe: `내 계정에서 접근 권한이 있는 레포인가요? (내 개인레포 및 소속된 그룹 내 레포는 Y)`,
  pleaseEnterRepoAccountName: `레포를 받아올 단체 아이디 또는 깃허브 아이디를 입력해주세요.`,
  isThisOrganization: `단체 아이디이면 (Y) 를, 개인 아이디면 (N) 를 입력해주세요.`,

  commandAddSubmodule: `🔖 서브모듈 추가하기 (add-submodule)`,
  pleaseSelectCategoryToCreateSubmodule: `서브모듈이 생성될 카테고리를 선택해주세요.`,
  pleaseSelectProjectToCreateSubmodule: `서브모듈이 생성될 프로젝트를 선택해주세요.`,
  pleaseEnterDetailSubmodulePathToSave: `서브모듈을 생성할 폴더 내 상세 경로를 입력해주세요. (예: lib/some-module)`,
  pleaseSelectGitProjectAsSubmodule: `서브모듈로 받아오려는 깃 프로젝트를 선택해주세요.`,
  polyrepoIsEmptyPleaseAddOne: `해당 카테고리에 추가된 폴리레포가 존재하지 않습니다.\n먼저 폴리레포를 해당 카테고리에 추가해주세요.`,

  commandDeleteSubmodule: `🔖 서브모듈 삭제하기 (delete-submodule)`,
  pleaseSelectCategoryOfSubmodule: `서브모듈이 담긴 프로젝트의 카테고리를 선택해주세요.`,
  pleaseSelectProjectOfSubmodule: `서브모듈이 담긴 프로젝트를 선택해주세요.`,
  pleaseEnterDetailSubmodulePath: `서브모듈을 선택해주세요.`,
  submoduleDoesntExist: `해당 프로젝트 내 서브모듈이 존재하지 않습니다.`,

  commandUpdateSubmodule: `🔖 서브모듈 갱신하기 (update-submodule)`,
  finishedUpdateSubmodule: `{name} 서브모듈 업데이트가 완료되었습니다.`,

  commandDeletePolyRepo: `🔖 폴리레포 삭제하기 (delete-polyrepo)`,
  pleaseSelectCategoryOfDeleteProject: `삭제할 프로젝트가 담긴 카테고리를 선택해주세요.`,
  pleaseSelectProjectOfDelete: `삭제할 프로젝트를 선택해주세요.`,
  reallySureToDeleteProject: `확인을 위해 삭제하려는 프로젝트 명을 입력해주세요 {name}:`,
  noProjectsInCategory: `해당 카테고리에 프로젝트가 존재하지 않습니다.`,
  finishedDeletePolyRepo: `{name} 폴리레포 삭제가 완료되었습니다.`
}

export default ko
