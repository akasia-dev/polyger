import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'
import { promisify } from 'util'
import { exec } from 'child_process'

import { polygerShellFileEntryRegex, polygerShellFileTitleRegex } from './utils'
import type { ICommand } from '../interface'
import getSetupData, { getConfigPath } from './setup'
import getLocale from '../../locale'

export const getEntrypoint = async () => {
  const setupData = await getSetupData()

  const commandFolderPath = path.join(
    process.cwd(),
    setupData.shellScriptFolderName ?? 'sh'
  )
  const shellScriptPaths = glob.sync([`${commandFolderPath}/**/*.sh`])
  const projectCommands: ICommand[] = []

  const entryPatchedLogs = setupData.entryPatchedLogs ?? {}

  for (const shellScriptPath of shellScriptPaths) {
    const shellScriptText = String(fs.readFileSync(shellScriptPath))

    polygerShellFileTitleRegex.lastIndex = 0
    const [, polygerShellFileTitle] =
      polygerShellFileTitleRegex.exec(shellScriptText)!

    polygerShellFileEntryRegex.lastIndex = 0
    const [, polygerShellEntryVersion] =
      polygerShellFileEntryRegex.exec(shellScriptText)!
    if (polygerShellEntryVersion && polygerShellEntryVersion.length > 0) {
      const beforePatchedVersion = entryPatchedLogs[polygerShellFileTitle]
      if (beforePatchedVersion !== polygerShellEntryVersion) {
        projectCommands.push({
          title: polygerShellFileTitle,
          command: `sh ${shellScriptPath}`
        })

        entryPatchedLogs[polygerShellFileTitle] = polygerShellEntryVersion
      }
    }
  }

  if (projectCommands.length > 0) {
    setupData.entryPatchedLogs = entryPatchedLogs
    const { polygerConfigJsonPath } = getConfigPath()
    fs.writeFileSync(polygerConfigJsonPath, JSON.stringify(setupData, null, 2))
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
