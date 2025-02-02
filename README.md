# DevnOTES #

- /src/cli = All related to ogen-vue cli
- /src/boilerplate = Boilerplate copied in Vue project
- /src/vue = Files availables in Vue Project

# Publish package #
> npm publish

# Unpublish package #
> npm run unpublish


# How to use in your Vue Project #

### First create the link to the registry ###
```
npm config set @ogen-technologies:registry https://npm.koesio.com
```

### Then install the module ###
```
npm install ogen-vue
npx ogen-vue install
```
or globally 
```
npm install ogen-vue -G 
ogen-vue install
```

### CLI helpers ###
```
npx ogen-vue
```
or globally
```
ogen-vue
```

## package.json ##

```
  "devDependencies": {
    "@rollup/plugin-commonjs": "^26.0.1",
    "@rollup/plugin-json": "^6.1.0",
    "@rollup/plugin-node-resolve": "^15.2.3",
    "@rollup/plugin-typescript": "^11.1.6",
    "@types/fs-extra": "^11.0.4",
    "fs-extra": "^11.3.0",
    "javascript-obfuscator": "^4.1.0",
    "rollup": "^4.18.0",
    "rollup-plugin-dts": "^6.1.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.3"
  },
  "dependencies": {
    "@types/inquirer": "^9.0.7",
    "axios": "^1.7.9",
    "inquirer": "^12.3.3"
  }
  ```