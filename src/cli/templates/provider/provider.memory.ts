
import { reactive, computed, toRef, toRefs } from 'vue'
import Package from '../../../../package.json'
import { MemoryCore } from "@ogen-core";
import {{EntityName}}Entity from './memory/{{EntityNameLowercase}}.entity';

export const ram = {
  version: Package.version,
}

type T{{EntityName}}Reactives = {
  myState: string,
  entitiesList: {{EntityName}}Entity[],
}

export const reactives = reactive<T{{EntityName}}Reactives>({
  myState: 'test',
  entitiesList: [],
})

export const controller = new (class {{EntityName}}Memory extends MemoryCore<{
  {{EntityNameUppercase}}_ENTITY: typeof {{EntityName}}Entity,
}> {

  constructor() {
    super({
      {{EntityNameUppercase}}_ENTITY: {
        entity: {{EntityName}}Entity,
        allocation: reactives.entitiesList,
      },
    });
  }
})();

export default {
  ram,
  reactives: toRefs(reactives),
}