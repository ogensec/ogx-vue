import * as AppMemory from "@ogen-providers/app/memory";
import * as AppActions from '@ogen-providers/app/actions';
import * as AppComposables from '@ogen-providers/app/composables'


export interface TAppProvider {
  memory: typeof AppMemory;
  actions: typeof AppActions;
  composables: typeof AppComposables;
}


