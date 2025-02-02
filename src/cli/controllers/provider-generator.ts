import * as path from "path";
import fs from 'fs'
import fsExtra from 'fs-extra'
import inquirer from 'inquirer'
import { Generator } from '../generator'
import { showMainMenu } from '../interactive'
import { BASE_PROJECT_PATH } from "@/cli";

const PATH_ENTITIES = 'providers'

export default class ProviderGenerator extends Generator {


    constructor() {
        const dir = path.resolve(BASE_PROJECT_PATH, 'src', PATH_ENTITIES)
        super({
            type: 'provider',
            dir,
            entities: fs.existsSync(dir)
                ? fs.readdirSync(dir)
                    .filter((item) => {
                        const fullPath = path.join(dir, item)
                        return fs.statSync(fullPath).isDirectory()
                    })
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
     * Create an entity
     * @param name
     * @param selectedOptions
     * @param options
     */
    async create(name: string, selectedOptions: string[], options: {
        forceLowerCase: boolean
    } = { forceLowerCase: false }) {

        await super.create(name, selectedOptions, Object.assign(options, { forceLowerCase: true }));

        const targetPath = path.resolve(this.entitiesPath, options?.forceLowerCase ? name.toLowerCase() : name)

        try {
            if (name[name.length - 1] === 's') {
                await fsExtra.move(
                    path.join(targetPath, 'memory', `${ name.toLowerCase() }.entity.ts`),
                    path.join(targetPath, 'memory', `${ name.slice(0, name.length - 1).toLowerCase() }.entity.ts`),
                )
            }
        } catch (e) {
        }

        console.log(`\x1b[33m\x1b[5mWARNING\x1b[0m : \x1b[1m Don't forget to update your provider declaration in : ./src/app.providers.ts.\x1b[0m`)
        console.log('')
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

        const existingElements = fs.readdirSync(path.join(this.entitiesPath, name.toLowerCase()))

        let choices = [ 'composables', 'actions', 'api', 'lang', 'memory', 'setup' ]

        if (
            existingElements.find((e) => e == `actions`) &&
            existingElements.find((e) => e == `${ name.toLowerCase() }.actions.ts`)
        )
            choices = choices.filter((e) => e !== 'actions')

        if (existingElements.find((e) => e == 'composables'))
            choices = choices.filter((e) => e !== 'composables')

        if (existingElements.find((e) => e == `${ name.toLowerCase() }.api.ts`))
            choices = choices.filter((e) => e !== 'api')

        if (existingElements.find((e) => e == `${ name.toLowerCase() }.memory.ts`))
            choices = choices.filter((e) => e !== 'memory')

        if (existingElements.find((e) => e == `${ name.toLowerCase() }.lang.ts`))
            choices = choices.filter((e) => e !== 'lang')

        if (existingElements.find((e) => e == `${ name.toLowerCase() }.setup.ts`))
            choices = choices.filter((e) => e !== 'setup')

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
        const targetPath = path.resolve(this.entitiesPath, name.toLowerCase())

        let templateFiles = fs.readdirSync(templatePath)

        if (!fs.existsSync(templatePath)) {
            console.error(`The template folder does not exist: ${ templatePath }`)
            return
        }

        if (!toDo.includes('actions')) {
            templateFiles = templateFiles.filter(
                (item) => item !== 'actions' && item !== 'provider.actions.ts'
            )
        }

        if (!toDo.includes('composables')) {
            templateFiles = templateFiles.filter((item) => item !== 'composables')
        }

        if (!toDo.includes('memory')) {
            templateFiles = templateFiles.filter((item) => item !== 'provider.memory.ts')
        }

        if (!toDo.includes('api')) {
            templateFiles = templateFiles.filter((item) => item !== 'provider.api.ts')
        }

        if (!toDo.includes('lang')) {
            templateFiles = templateFiles.filter((item) => item !== 'provider.lang.ts')
        }

        for (let file of templateFiles) {
            if (!fs.existsSync(path.join(targetPath, file))) {
                fsExtra.copySync(path.join(templatePath, file), path.join(targetPath, file))
                console.log(`\x1b[32m✔\x1b[0m File : ${ file } \x1b[1msuccessfully generated.`)
            }
        }

        this.replacePlaceholdersRecursive(this.entityType, targetPath, {
            EntityNameUppercase: name.toUpperCase(),
            EntityNameLowercase: name.toLowerCase(),
            EntityName: name
        })

        if (name[name.length - 1] === 's' && toDo.includes('memory')) {
            try {
                await fsExtra.move(
                    path.join(targetPath, 'memory', `${ name.toLowerCase() }.entity.ts`),
                    path.join(targetPath, 'memory', `${ name.slice(0, name.length - 1).toLowerCase() }.entity.ts`),
                )
            } catch (e) {
            }
        }

        console.log('')
        console.log(`\x1b[32m✔✔✔ \x1b[0m Entity : ${ name } \x1b[1msuccessfully updated.`)
        console.log(
            `\x1b[33m\x1b[5mWARNING\x1b[0m : \x1b[1m Don't forget to update your provider declaration in : ./src/app.providers.ts.\x1b[0m`
        )
        console.log('')
    }
}
