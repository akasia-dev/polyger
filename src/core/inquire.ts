import inquirer from 'inquirer'
import searchList from 'inquirer-search-list'

inquirer.registerPrompt('search-list', searchList)
export { inquirer }
