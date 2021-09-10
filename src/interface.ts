export interface ICommand {
  title: string
  command?: string
  localFunction?: () => unknown
}

/**
 * .env.json Interface
 */
export interface IConfigData {
  [key: string]: unknown
  subFolders?: string[]
  shellScriptFolderName?: string
}

export interface ISecretData {
  githubToken?: string
  githubUserName?: string
  entryPatchedLogs: Record<string, string>
}
