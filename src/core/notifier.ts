import fs from 'fs'
import path from 'path'
import updateNotifier from 'update-notifier'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async () => {
  const moduleJsonPath = path.resolve(__dirname, '../../../package.json')
  const packageJson = JSON.parse(String(fs.readFileSync(moduleJsonPath)))

  const notifier = updateNotifier({
    updateCheckInterval: 1,
    packageName: packageJson.name,
    packageVersion: packageJson.version,
    shouldNotifyInNpmScript: true
  })

  notifier.notify({
    message: `Update available {currentVersion} → {latestVersion}\nYou can update by entering the command.\n\nnpm i {packageName}${
      notifier.update ? `@${notifier.update.latest}` : ''
    }`
  })
}
