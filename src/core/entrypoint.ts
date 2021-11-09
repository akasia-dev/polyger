import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'
import { promisify } from 'util'
import { exec } from 'child_process'

import {
  polygerShellFileEntryRegex,
  polygerShellFileTitleRegex,
  polygerTypescriptFileEntryRegex,
  polygerTypescriptFileTitleRegex
} from './utils'
import type { ICommand } from '../interface'
import getSetupData, { getConfigPath } from './setup'
import getLocale from '../../locale/index'

export const getEntrypoint = async () => {
  const { configData, secretData } = await getSetupData()

  const commandFolderPath = path.join(
    process.cwd(),
    configData.shellScriptFolderName ?? 'script'
  )
  const shellScriptPaths = glob.sync([
    path.resolve(commandFolderPath, '**', '*.{sh,ts}').replace(/\\/g, '/')
  ])
  const projectCommands: ICommand[] = []

  const entryPatchedLogs = secretData.entryPatchedLogs ?? {}

  for (const shellScriptPath of shellScriptPaths) {
    const shellScriptText = String(fs.readFileSync(shellScriptPath))
    const isShellScript = /.sh$/gm.test(shellScriptPath)
    const titleRegex = isShellScript
      ? polygerShellFileTitleRegex
      : polygerTypescriptFileTitleRegex
    const entryRegex = isShellScript
      ? polygerShellFileEntryRegex
      : polygerTypescriptFileEntryRegex

    titleRegex.lastIndex = 0
    const polygerShellFileTitleParse = titleRegex.exec(shellScriptText)

    if (
      polygerShellFileTitleParse &&
      typeof polygerShellFileTitleParse[1] !== 'undefined'
    ) {
      const [, polygerShellFileTitle] = polygerShellFileTitleParse

      entryRegex.lastIndex = 0
      const polygerShellFileEntryParse = entryRegex.exec(shellScriptText)!

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
              command: `${
                isShellScript ? 'sh' : 'ts-node'
              } "${shellScriptPath}"`
            })

            entryPatchedLogs[polygerShellFileTitle] = polygerShellEntryVersion
          }
        }
      }
    }
  }

  if (projectCommands.length > 0) {
    secretData.entryPatchedLogs = entryPatchedLogs
    const { polygerSecretJsonPath } = getConfigPath()
    fs.writeFileSync(polygerSecretJsonPath, JSON.stringify(secretData, null, 2))
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
