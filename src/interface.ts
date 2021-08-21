export interface ICommand {
  title: string
  command?: string
  localFunction?: () => unknown
}

/**
 * .env.json Interface
 */
export interface IEnv {
  [key: string]: unknown
  githubToken?: string
  githubUserName?: string
  subFolders?: string[]
}
