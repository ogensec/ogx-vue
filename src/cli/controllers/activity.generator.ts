import * as path from "path";
import fs from 'fs'
import fsExtra from 'fs-extra'
import inquirer from 'inquirer'
import { Generator } from '../generator'
import { showMainMenu } from '../interactive'
import { BASE_PROJECT_PATH } from "@/cli";

const PATH_ENTITIES = 'activities'

export default class ActivityGenerator extends Generator {


    constructor() {
        const dir = path.resolve(BASE_PROJECT_PATH, 'src', PATH_ENTITIES)
        super({
            type: 'activity',
            dir,
            entities: fs.existsSync(dir)
                ? fs.readdirSync(dir)
                    .filter((item) => {
                        const fullPath = path.join(dir, item)
                        return fs.statSync(fullPath).isDirectory()
                    })
                    .filter((e) => ![ 'App', 'Dialogs', 'Errors' ].includes(e))
                : []
        })
    }

    async init() {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What do you want to do?',
                choices: [
                    { name: `Create an ${ this.entityType }`, value: 'create' },
                    { name: `Update an ${ this.entityType }`, value: 'update' }
                ]
            }
        ])

        switch (action) {
            case 'create':
                await this.requestCreate()
                break
            case 'update':
                await this.requestUpdate()
                break
        }
    }


    /**
     * Request entity update
     * @param existingName
     */
    async requestUpdate(existingName?: string) {
        let name = existingName

        if (!name) {
            const resp = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'name',
                    message: `Which ${ this.entityType } do you want to update?`,
                    choices: this.existingEntities.map((entity) => ({ name: entity, value: entity }))
                }
            ])
            name = this.capitalizeFirstLetter(resp.name)
        }

        const existingElements = fs.readdirSync(path.join(this.entitiesPath, name))

        let choices = [ 'actions', 'emitter', 'styles', 'composable' ]

        if (
            existingElements.find((e) => e == 'actions') &&
            existingElements.find((e) => e == 'actions.ts')
        )
            choices = choices.filter((e) => e !== 'actions')
        if (
            existingElements.find((e) => e == 'listeners.ts') &&
            existingElements.find((e) => e == 'events.ts')
        )
            choices = choices.filter((e) => e !== 'emitter')
        if (existingElements.find((e) => e == 'composable.ts'))
            choices = choices.filter((e) => e !== 'composable')
        if (existingElements.find((e) => e == 'styles.scss'))
            choices = choices.filter((e) => e !== 'styles')

        let choicesToDo: string[]

        if (choices.length) {
            const { options } = await inquirer.prompt([
                {
                    type: 'checkbox',
                    name: 'options',
                    message: 'Select missing architecture to implement :',
                    choices: choices.map((e) => ({ name: this.capitalizeFirstLetter(e), value: e })),
                    default: choices
                }
            ])
            choicesToDo = options
        } else {
            console.log('')
            console.log(
                `\x1b[31m\x1b[5mERROR\x1b[0m : \x1b[1mthe ${ this.entityType } "${ name }" already implements the whole recommended architecture.\x1b[0m`
            )
            console.log('')
            return showMainMenu()
        }

        if (choicesToDo.length) {
            this.update(name, choicesToDo).finally()
        } else {
            console.log(`Canceled.`)
            return showMainMenu()
        }
    }

    /**
     * Entity update
     * @param name
     * @param toDo
     */
    async update(name: string, toDo: string[]) {
        const templatePath = path.resolve(__dirname, '..', 'templates', this.entityType)
        const targetPath = path.resolve(this.entitiesPath, name)

        let templateFiles = fs.readdirSync(templatePath)

        if (!fs.existsSync(templatePath)) {
            console.error(`The template folder does not exist: ${ templatePath }`)
            return
        }

        if (!toDo.includes('actions')) {
            templateFiles = templateFiles.filter((item) => item !== 'actions' && item !== 'actions.ts')
        }

        if (!toDo.includes('emitter')) {
            templateFiles = templateFiles.filter(
                (item) => item !== 'events.ts' && item !== 'listeners.ts'
            )
        }

        if (!toDo.includes('styles')) {
            templateFiles = templateFiles.filter((item) => item !== 'styles.scss')
        }

        if (!toDo.includes('composable')) {
            templateFiles = templateFiles.filter((item) => item !== 'composable.ts')
        }

        for (let file of templateFiles) {
            if (!fs.existsSync(path.join(targetPath, file))) {
                fsExtra.copySync(path.join(templatePath, file), path.join(targetPath, file))
                console.log(`\x1b[32m✔\x1b[0m File : ${ file } \x1b[1msuccessfully generated.`)
            }
        }

        this.replacePlaceholdersRecursive(this.entityType, targetPath, {
            EntityName: name,
            EntityNameLowercase: name.toLowerCase()
        })

        console.log('')
        console.log(`\x1b[32m✔✔✔ \x1b[0m Entity : ${ name } \x1b[1msuccessfully updated.`)
        console.log('')
        return showMainMenu()
    }
}
