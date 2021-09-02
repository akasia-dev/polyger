import fs from 'fs'
import path from 'path'
import updateNotifier from 'update-notifier'

export const getUpdateNotifier = () => {
  const moduleJsonPath = path.resolve(__dirname, '../../../package.json')
  const packageJson = JSON.parse(String(fs.readFileSync(moduleJsonPath)))

  const notifier = updateNotifier({
    updateCheckInterval: 1,
    packageName: packageJson.name,
    packageVersion: packageJson.version,
    shouldNotifyInNpmScript: true
  })

  notifier.notify()
  return notifier
}
//

export default async () => {
  getUpdateNotifier()
}
