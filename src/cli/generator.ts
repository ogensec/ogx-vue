import fs from 'fs'
import * as path from "path";
import fsExtra from 'fs-extra'
import { BASE_PROJECT_PATH } from './index'
import inquirer from 'inquirer'


type TGeneratorConstructorArgs = {
    type: string
    dir: string
    entities: string[];
}

export class Generator {

    public entityType: string;
    public entitiesPath: string;
    public existingEntities: string[];

    constructor({ type, dir, entities }: TGeneratorConstructorArgs) {
        this.entityType = type;
        this.entitiesPath = dir;
        this.existingEntities = entities;
    }

    /**
     * Initialization
     */
    async init() {
    }

    /**
     * Request entity creation
     */

    async requestCreate() {
        const { name } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: `New ${ this.entityType }'s name:`,
                default: `My${ this.capitalizeFirstLetter(this.entityType) }`
            }
        ])

        const finalName = this.capitalizeFirstLetter(name)
        const targetPath = path.resolve(this.entitiesPath as string, finalName)

        if (fs.existsSync(targetPath)) {
            console.log(``)
            console.log(
                `\x1b[31m\x1b[5mERROR\x1b[0m : \x1b[1m ${ this.capitalizeFirstLetter(this.entityType) } "${ finalName }" already exists!.\x1b[0m`
            )
            console.log('')

            const { action } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: `${ this.capitalizeFirstLetter(this.entityType) } "${ finalName }" exists. Do you want to update or cancel?`,
                    choices: [
                        { name: 'Update', value: 'update' },
                        { name: 'Cancel', value: 'cancel' }
                    ]
                }
            ])

            if (action === 'update') {
                if (this.requestUpdate) await this.requestUpdate(finalName)
            } else {
                console.log('Creation canceled.')
            }
            return
        }

        await this.create(finalName, [])
    }

    /**
     * Create an entity
     * @param name
     * @param selectedOptions
     * @param options
     */
    async create(name: string, selectedOptions: string[], options?: { forceLowerCase: boolean }) {
        console.log(`• Generating an ${ this.entityType } named "${ name }"...`)

        const templatePath = path.resolve(__dirname, '../templates', this.entityType)
        const targetPath = path.resolve(this.entitiesPath as string, options?.forceLowerCase ? name.toLowerCase() : name)

        if (!fs.existsSync(templatePath)) {
            console.log(``)
            console.log(
                `\x1b[31m\x1b[5mERROR\x1b[0m : \x1b[1m the template folder does not exist: ${ templatePath }.\x1b[0m`
            )
            console.log(``)
            return
        }

        fsExtra.copySync(templatePath, targetPath)

        this.replacePlaceholdersRecursive(this.entityType, targetPath, {
            EntityNameLowercase: name.toLowerCase(),
            EntityNameUppercase: name.toLowerCase(),
            EntityName: name,
        })
        console.log('')
        console.log(`\x1b[32m✔✔✔ \x1b[0m Entity : ${ name } \x1b[1msuccessfully generated.`)
    }

    /**
     *
     * @param existingName
     */
    async requestUpdate(existingName?: string) {
    }


    /**
     * Transforms the first letter of the name to uppercase.
     * For example: "test" => "Test", "testModuleCamelCase" => "TestModuleCamelCase"
     */
    capitalizeFirstLetter(name: string) {
        if (!name) return ''
        return name.charAt(0).toUpperCase() + name.slice(1)
    }

    /**
     * replacePlaceholdersRecursive
     * @param type
     * @param dir
     * @param placeholders
     */
    replacePlaceholdersRecursive(type: string, dir: string, placeholders: Record<string, string>) {
        const items = fs.readdirSync(dir)

        for (const item of items) {
            const oldPath = path.join(dir, item)
            const stats = fs.statSync(oldPath)

            let newItemName = item

            // Replace the first occurrence of "type" in the filename
            if (newItemName.includes(type)) {
                newItemName = newItemName.replace(type, placeholders.EntityNameLowercase)
            }

            // Replace placeholders, e.g. {{EntityName}}
            Object.entries(placeholders).forEach(([ key, value ]) => {
                newItemName = newItemName.replace(new RegExp(`{{${key}}}`, 'g'), value)
            })

            let newPath = oldPath
            if (newItemName !== item) {
                newPath = path.join(dir, newItemName)
                fsExtra.moveSync(oldPath, newPath)
            }

            // Recursively process if it's a directory
            if (stats.isDirectory()) {
                this.replacePlaceholdersRecursive(type, newPath, placeholders)
            } else {
                const content = fs.readFileSync(newPath, 'utf8')
                let newContent = content
                Object.entries(placeholders).forEach(([ key, value ]) => {
                    newContent = newContent.replace(new RegExp(`{{${key}}}`, 'g'), value)
                })
                fs.writeFileSync(newPath, newContent, 'utf8')
            }
        }
    }
}
