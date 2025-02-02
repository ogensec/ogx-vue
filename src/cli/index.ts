#!/usr/bin/env node
import { program } from 'commander'
import installCommand, { isInstalled } from './installer'
import interactiveCommand from './interactive'
import * as path from "path";
import fs from "fs";

export const BASE_PROJECT_PATH = path.resolve(process.cwd());

const packageJsonPath = path.join(BASE_PROJECT_PATH, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
    console.error(`\x1b[31m\x1b[5mERROR\x1b[0m : \x1b[1m This command must be run from the root of a project (where package.json is located).\x1b[0m`);
    process.exit(1);
}


program
    .addCommand(installCommand)
    .addCommand(interactiveCommand);

(async () => {
    if (process.argv.length <= 2) {
        if (!isInstalled()) {
            console.error(`\x1b[31m\x1b[5mERROR\x1b[0m : \x1b[1m ogen-vue is not installed. First use : npx ogen-vue install OR ogen-vue install (if installed globally).\x1b[0m`)
            process.exit(1)
        }
        process.argv.push('interactive')
    }
    await program.parseAsync(process.argv)
})()
