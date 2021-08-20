import setup from './core/setup'
import polyrepo from './core/polyrepo'
import commannd from './core/command'

const main = async () => {
  await setup() // Check the setup file and create a setup file if it does not exist.
  await polyrepo() // Check the project folder and download the project folder.
  await commannd() // After the command is selected by the user, execute the command.
}

main()
