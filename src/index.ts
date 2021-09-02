import setup from './core/setup'
import polyrepo from './core/polyrepo'
import commannd from './core/command'
import entrypoint from './core/entrypoint'

const main = async () => {
  // Check the setup file and create a setup file if it does not exist.
  const { isFirstRunning } = await setup()

  // Check the project folder and download the project folder.
  await polyrepo()

  // Runs the script that must be executed early in the program.
  await entrypoint()

  // After the command is selected by the user, execute the command.
  if (!isFirstRunning) await commannd()
}

main()
