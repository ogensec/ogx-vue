import inquirer from 'inquirer'
import fs from 'fs'
import * as path from "path";
import { Command } from "commander";
import fsExtra from "fs-extra";
import { spawnSync } from "child_process";

/**
 * Checks if the OGEN framework has already been installed by looking for a marker file (.ogen_installed).
 * @returns {boolean} Returns true if the framework is already installed, false otherwise.
 */
export function isInstalled(): boolean {
    const markerPath = path.resolve(process.cwd(), '.ogen_installed')
    return fs.existsSync(markerPath)
}

/**
 * Installs the default files for the OGEN framework and updates the package.json (optionally) to run generate-alias.sh.
 * If the framework is already installed, the function will skip the process.
 *
 * @returns {Promise<void>}
 */
export async function install(): Promise<void> {
    console.log('');
    console.log(`\x1b[33m[ogen-vue]\x1b[0m Installing...`)

    try {
        if (isInstalled()) {
            console.error(`\x1b[31m\x1b[5mERROR\x1b[0m : \x1b[1m ogen-vue is already installed.\x1b[0m`)
            return
        }

        copyVueFiles();
        copyAliasGenerator()
        updateViteConfig();
        await updatePackageJsonScripts()

        const markerPath = path.resolve(process.cwd(), '.ogen_installed')
        fs.writeFileSync(markerPath, 'Installed by OGEN CLI on ' + new Date().toISOString())

        console.log("");
        console.log(`\x1b[33m[ogen-vue] ✔✔✔\x1b[0m successfully installed ! Use \x1b[4m"npx ogen-vue" \x1b[0mto launch the CLI.`)
        console.log("")
    } catch (e) {
        console.error(e)
    }
}

const installCommand = new Command('install')
    .description('Install default OGEN framework files in your Vue3 project.')
    .action(async () => {
        await install()
    })

export default installCommand


/**
 * Copies the generate-alias.sh script to the current working directory.
 * The script is set to be executable (chmod 755) on Unix-like systems.
 * @private
 */
function copyVueFiles(): void {
    let filesSource = path.resolve(__dirname, '..', 'boilerplate', 'src');
    let destination = path.resolve(process.cwd(), 'src/');

    if (!fs.existsSync(filesSource)) {
        console.error(`\x1b[31m\x1b[5mERROR\x1b[0m : Source directory "${ filesSource }" does not exist.`);
        return;
    }

    fsExtra.ensureDirSync(destination);

    let items = fs.readdirSync(filesSource);

    items.forEach(item => {
        const sourcePath = path.join(filesSource, item);
        const destPath = path.join(destination, item);

        fsExtra.copySync(sourcePath, destPath);
        console.log(`\x1b[32m✔\x1b[0m Copy of ${ item }... OK.`);
    });

    console.log(`\x1b[32m✔\x1b[0m Vue files successfully imported into "src/".`);


}


/**
 * Retrieve all .vue components in specific directory
 */
function getVueComponents(dir: string, basePath = '') {
    let components: any[] = [];

    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(basePath, entry.name);

        if (entry.isDirectory()) {
            components = components.concat(getVueComponents(fullPath, relativePath));
        } else if (entry.isFile() && entry.name.endsWith('.vue')) {
            components.push(relativePath.replace(/\\/g, '/').replace('.vue', ''));
        }
    });

    return components;
}
/**
 * Generate vite.config resolver for components
 */
function generateComponentResolvers() {
    const componentsDir = path.resolve(__dirname, '..', 'vue', 'components');

    if (!fs.existsSync(componentsDir)) {
        console.error(`\x1b[31m[ERROR]\x1b[0m The directory "${componentsDir}" does not exist.`);
        return "";
    }

    const componentNames = getVueComponents(componentsDir);

    return `
        (name): any => {
            if (["${componentNames.join('", "')}"].includes(name)) {
                return { importName: 'default', path: "@ogen-components/" + name + ".vue" };
            }
            return null;
        },
    `;
}

/**
 * Update vite config with components resolver
 */
function updateViteConfig() {
    console.log(`• Copying vite/vue config file...`);


    const filesSource = path.resolve(__dirname, '..', 'boilerplate');
    const destination = path.resolve(process.cwd());

    let items = fs.readdirSync(filesSource);

    items.forEach(item => {
        if (![ 'src' ].includes(item)) {
            const sourcePath = path.join(filesSource, item);
            const destPath = path.join(destination, item);

            fsExtra.copySync(sourcePath, destPath);
            console.log(`\x1b[32m✔\x1b[0m Copy of ${ item }... OK.`);
        }
    });

    console.log(`\x1b[32m✔\x1b[0m Template files sucessfully copied.`);

    const viteConfigPath = path.resolve(process.cwd(), 'vite.config.ts');
    if (!fs.existsSync(viteConfigPath)) {
        console.error(`\x1b[31m[ERROR]\x1b[0m vite.config.ts not found.`);
        return;
    }

    console.log(`• Updating vite.config.ts...`);

    let viteConfig = fs.readFileSync(viteConfigPath, "utf-8");

    const newResolvers = generateComponentResolvers();
    if (!newResolvers) return;

    const regex = /resolvers:\s*\[([\s\S]*?)\]/;
    const match = viteConfig.match(regex);

    if (match) {
        viteConfig = viteConfig.replace(match[0], `resolvers: [\n${ newResolvers }\n    ]`);
    } else {
        viteConfig = viteConfig.replace(
            /Components\(\{([\s\S]*?)\}\)/,
            `Components({$1,\n    resolvers: [\n${ newResolvers }\n    ]\n})`
        );
    }

    fs.writeFileSync(viteConfigPath, viteConfig, "utf-8");
    console.log(`\x1b[32m✔\x1b[0m vite.config.ts updated successfully!`);
}

/**
 * Copies the generate-alias.sh script to the current working directory.
 * The script is set to be executable (chmod 755) on Unix-like systems.
 * @private
 */
function copyAliasGenerator(): void {
    const scriptSource = path.resolve(__dirname, '..', 'generate-alias.sh');
    const destination = path.resolve(process.cwd(), 'generate-alias.sh');

    try {
        fs.copyFileSync(scriptSource, destination);

        fs.chmodSync(destination, 0o755);

        console.log(`\x1b[32m✔\x1b[0m Alias generator successfully imported.`);

        const result = spawnSync(destination, [], { stdio: "inherit", shell: true });

        if (result.error) {
            console.error(`\x1b[31m✖\x1b[0m Error executing script:`, result.error.message);
            process.exit(1);
        }

        if (result.status !== 0) {
            console.error(`\x1b[31m✖\x1b[0m Script exited with status code ${ result.status }`);
            process.exit(result.status || 1);
        }

        console.log(`\x1b[32m✔\x1b[0m Alias generator executed successfully.`);
    } catch (error) {
        console.error(`\x1b[31m✖\x1b[0m Failed to copy or execute script:`, error);
        process.exit(1);
    }
}


/**
 * Prompts the user to update the dev and build scripts in package.json to run generate-alias.sh automatically.
 * If confirmed, the existing scripts are prefixed or created.
 *
 * @returns {Promise<void>}
 */
export async function updatePackageJsonScripts(): Promise<void> {
    const pkgPath = path.resolve(process.cwd(), 'package.json')

    if (!fs.existsSync(pkgPath)) {
        console.error(`\x1b[31m\x1b[5mERROR\x1b[0m : \x1b[1m Can not update package.json, reason: file not found in project.\x1b[0m`)
        return
    }

    const pkgRaw = fs.readFileSync(pkgPath, 'utf-8')
    let pkgData: any

    try {
        pkgData = JSON.parse(pkgRaw)
    } catch (e) {
        console.error(`\x1b[31m\x1b[5mERROR\x1b[0m : \x1b[1m package.json in project is not valid JSON.\x1b[0m`)
        return
    }

    const { confirmUpdate } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmUpdate',
            message: 'Do you want to update your package.json to run generate-alias.sh automatically?',
            default: false
        }
    ])

    if (!confirmUpdate) {
        console.error(`\x1b[34m\x1b[WARNING\x1b[0m : \x1b[1m package.json hasn't been updated ! You have to update it manually.\x1b[0m`)
        return
    }

    pkgData.scripts = pkgData.scripts || {}

    if (pkgData.scripts.dev) {
        pkgData.scripts.dev = `sh ./generate-alias.sh && ${ pkgData.scripts.dev }`
    } else {
        pkgData.scripts.dev = 'sh ./generate-alias.sh && vite'
    }

    if (pkgData.scripts.build) {
        pkgData.scripts.build = `sh ./generate-alias.sh && ${ pkgData.scripts.build }`
    } else {
        pkgData.scripts.build = 'sh ./generate-alias.sh && vite build'
    }

    fs.writeFileSync(pkgPath, JSON.stringify(pkgData, null, 2), 'utf-8')

    console.log(`\x1b[32m✔\x1b[0m package.json "build" and "dev" has been updated to use generate-alias.sh.`)
}
