import { Command } from 'commander'
import inquirer from 'inquirer'
import ActivityGenerator from './controllers/activity.generator'
import ModuleGenerator from './controllers/module.generator'
import ProviderGenerator from './controllers/provider-generator'
import { Generator } from './generator'
import * as path from "path";;


// -----------------------------------------------------------------------------
// MAIN MENU
// -----------------------------------------------------------------------------
export async function showMainMenu() {
    const mainAnswers = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What to manage ?',
            choices: [
                { name: 'Activities management', value: 'activity' },
                { name: 'Modules management', value: 'module' },
                { name: 'Providers management', value: 'provider' },
                { name: 'Quit', value: 'quit' }
            ]
        }
    ])

    let module: Generator | null = null

    switch (mainAnswers.choice) {
        case 'activity':
            module = new ActivityGenerator()
            break
        case 'module':
            module = new ModuleGenerator()
            break
        case 'provider':
            module = new ProviderGenerator()
            break
        default:
            break
    }

    if (module) {
        await module.init()
    } else {
        process.exit()
    }
}

// -----------------------------------------------------------------------------
// MAIN OVERVIEW
// -----------------------------------------------------------------------------
function displayStatus() {
    const activities = new ActivityGenerator()
    const modules = new ModuleGenerator()
    const providers = new ProviderGenerator()

    console.log('')
    console.log('##### OGEN Framework CLI #####')
    console.log('#')
    console.log(`# Activities[${ activities.existingEntities.length }] : ${ activities.existingEntities.join(' | ') }`)
    console.log(`# Modules[${ modules.existingEntities.length }] : ${ modules.existingEntities.join(' | ') }`)
    console.log(`# Providers[${ providers.existingEntities.length }] : ${ providers.existingEntities.join(' | ') }`)
    console.log('#')
    console.log('#############################')
    console.log('')
}

// -----------------------------------------------------------------------------
// START
// -----------------------------------------------------------------------------
const interactiveCommand = new Command() // on peut nommer .command('interactive') si on veut
    .name('interactive')
    .description('Launch interactive CLI menu')
    .action(async () => {
        displayStatus()
        await showMainMenu()
    })

export default interactiveCommand
