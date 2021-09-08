import setup from './core/setup.js'
import polyrepo from './core/polyrepo.js'
import command from './core/command.js'
import entrypoint from './core/entrypoint.js'
import notify from './core/notifier.js'

const main = async () => {
  // Notifies if updates are available.
  await notify()

  // Check the setup file and create a setup file if it does not exist.
  const { isFirstRunning } = await setup()

  // Check the project folder and download the project folder.
  await polyrepo()

  // Runs the script that must be executed early in the program.
  await entrypoint()

  // After the command is selected by the user, execute the command.
  if (!isFirstRunning) await command()
}

main()
