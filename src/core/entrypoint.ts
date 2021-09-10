import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'
import { promisify } from 'util'
import { exec } from 'child_process'

import { polygerShellFileEntryRegex, polygerShellFileTitleRegex } from './utils'
import type { ICommand } from '../interface'
import getSetupData, { getConfigPath } from './setup'
import getLocale from '../../locale/index'

export const getEntrypoint = async () => {
  const { configData } = await getSetupData()

  const commandFolderPath = path.join(
    process.cwd(),
    configData.shellScriptFolderName ?? 'sh'
  )
  const shellScriptPaths = glob.sync([`${commandFolderPath}/**/*.sh`])
  const projectCommands: ICommand[] = []

  const entryPatchedLogs = configData.entryPatchedLogs ?? {}

  for (const shellScriptPath of shellScriptPaths) {
    const shellScriptText = String(fs.readFileSync(shellScriptPath))

    polygerShellFileTitleRegex.lastIndex = 0
    const polygerShellFileTitleParse =
      polygerShellFileTitleRegex.exec(shellScriptText)

    if (
      polygerShellFileTitleParse &&
      typeof polygerShellFileTitleParse[1] !== 'undefined'
    ) {
      const [, polygerShellFileTitle] = polygerShellFileTitleParse

      polygerShellFileEntryRegex.lastIndex = 0
      const polygerShellFileEntryParse =
        polygerShellFileEntryRegex.exec(shellScriptText)!

      if (
        polygerShellFileEntryParse &&
        typeof polygerShellFileEntryParse[1] !== 'undefined'
      ) {
        const [, polygerShellEntryVersion] = polygerShellFileEntryParse
        if (polygerShellEntryVersion && polygerShellEntryVersion.length > 0) {
          const beforePatchedVersion = entryPatchedLogs[polygerShellFileTitle]
          if (beforePatchedVersion !== polygerShellEntryVersion) {
            projectCommands.push({
              title: polygerShellFileTitle,
              command: `sh "${shellScriptPath}"`
            })

            entryPatchedLogs[polygerShellFileTitle] = polygerShellEntryVersion
          }
        }
      }
    }
  }

  if (projectCommands.length > 0) {
    configData.entryPatchedLogs = entryPatchedLogs
    const { polygerConfigJsonPath } = getConfigPath()
    fs.writeFileSync(polygerConfigJsonPath, JSON.stringify(configData, null, 2))
  }

  return projectCommands
}

export default async () => {
  const locale = await getLocale()
  const commands = await getEntrypoint()
  if (commands.length === 0) return false

  for (const commandObject of commands) {
    if (!commandObject.command) continue

    console.log(
      `${locale.runningCommand({
        title: commandObject.title
      })}\n`
    )

    try {
      const { stdout, stderr } = await promisify(exec)(commandObject.command)
      console.log(stdout)
      console.log(stderr)
    } catch (error) {
      console.log(error)
    }
  }

  return true
}
