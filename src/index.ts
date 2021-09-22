import notify from './core/notifier'
import environment from './core/environment'
import setup from './core/setup'
import polyrepo from './core/polyrepo'
import entrypoint from './core/entrypoint'
import command from './core/command'

const main = async () => {
  // Notifies if updates are available.
  await notify()

  // Sets up the environment.
  await environment()

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
