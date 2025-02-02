import type { Reactive } from "vue";
import { ref } from 'vue';
import { nextConsole } from '@ogen-composables/helpers/useDevTools';
import { MemoryEntity } from "@ogen-core"

const console = nextConsole('MemoryCore', { color: '#FFFFFF', background: 'red' });

type ToDo = any;

// interface Context<T> {
//     entity: MemoryEntity<T>
//     allocation: any;
//     observers: Map<string, T>;
// }
//
// type TContext<T> = {
//             entity:  T extends MemoryEntity<any> ? T : never,
//             allocation: Reactive<T>,
//             observers: Map<string, T>;
//        
// }
type TContext<S> = {
    entity: S;
    allocation: any,
    observers?: Map<string, S>
}

type TInternalContext<T> = {
    [S in keyof T]:  TContext<T[S]>
}

type TEntitiesDeclarator<T> = { 
    [S in keyof T]: T[S]
}

export default class MemoryCore<T extends TEntitiesDeclarator<T>> {
    context: TInternalContext<T> 
    
    constructor(build?: TInternalContext<T> ) {
        if (!build) throw Error('No build provided to the MemoryCore class');
        this.context = build;
        for (let type in this.context) {
            this.context[type].observers = new Map();
        }
    }


    /**
     * Insert (or update) entities list in memory
     * @param context
     * @param inputDatas
     */
    async INSERT(context: TContext<any>, inputDatas: T[]): Promise<any[] | false> {
        try {
            const { core, datas } = this._retrieveCore(context, inputDatas);
            console.log(`${core.constructor.name} ► ${context.entity.name} ► INSERT`, datas);
            const toUpdate = [];
            let toReturn = [];

            const allocation = context.allocation;

            const promisesBeforeCreate = [];

            for (let item of datas) {
                for (let key of context.entity.indexer)
                    if (item[key]) {
                        item.__indexer = key;
                        break;
                    }
                if (item.__indexer) {
                    if (allocation[item.__indexer]) toUpdate.push(item);
                    else {
                        if ((context as any).entity['beforeCreate'])
                            promisesBeforeCreate.push((context as any).entity.beforeCreate(item));
                        else promisesBeforeCreate.push(item);
                    }
                } else
                    console.warn(
                        `MemoryCore : ${core.constructor.name} ► No index found for inserted data in ${core.constructor.name}. You are probably trying to insert an unstructured data. (ignored)`,
                    );
            }

            return Promise.all(promisesBeforeCreate).then(items => {
                const promisesAfterCreate = [];

                for (let item of items) {
                    item = new context.entity(item);
                    if (context.entity['afterCreate'])
                        promisesAfterCreate.push(context.entity.afterCreate(item));
                    toReturn.push(item);
                }

                return Promise.all(promisesAfterCreate).then(items => {
                    let promiseUpdate = [];

                    if (toUpdate.length) {
                        promiseUpdate.push(this.UPDATE({ ...context, allocation }, toUpdate));

                        return Promise.all(promiseUpdate).then(updatedItems => {
                            toReturn = toReturn.concat(updatedItems);
                            return toReturn;
                        });
                    } else {
                        if (toReturn.length) {
                            for (let item of toReturn) {
                                // Vue.set(allocation, item[item.__indexer], item);
                                allocation[item[item.__indexer]] = item;
                            }
                            this._triggerObservers(context);
                        }

                        return toReturn;
                    }
                });

                //Vue2
                // Vue.set(allocation, item[index], item);
                //Vue3 :
                // allocation[item[index]] = item;
            });
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * Update entities list in memory core
     * @param context
     * @param inputDatas
     */
    async UPDATE<I>(context: TContext<I>, inputDatas: I[]): Promise<any[] | false> {
        try  {
            const { core, datas } = this._retrieveCore(context, inputDatas);
            console.log(`${core.constructor.name} ► ${context.entity.name} ► UPDATE`, datas);

            const toReturn:any = [];

            const promisesUpdate = [];

            const allocation = context.allocation;
            for (let item of datas) {
                if (!item.__indexer) {
                    for (let key of context.entity.indexer)
                        if (item[key]) {
                            item.__indexer = key;
                            break;
                        }
                }
                let memoryItem = allocation[item[item.__indexer]];
                if (memoryItem) {
                    const updatedItem = memoryItem.hydrate(item);
                    promisesUpdate.push(updatedItem.onUpdate(updatedItem));
                    toReturn.push(updatedItem);
                } else
                    console.warn(
                        `MemoryCore : Something went wrong. Memory is trying to update an inexisting entity in core ${core.constructor.name}. (ignored)`,
                    );
            }

            return Promise.all(promisesUpdate).then(status => {
                if (toReturn.length) this._triggerObservers(context);
                return toReturn;
            });
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * Delete entities list in memory core
     * @param context
     * @param inputDatas
     * @returns {boolean}
     */
    async DELETE<I>(context: TContext<I>, { entities, filter, arrayIds }: ToDo): Promise<boolean> {
        try {
            const { core, datas } = this._retrieveCore(context, entities || arrayIds);
            console.log(`${core.constructor.name} ► ${context.entity.name} ► DELETE`, datas);
            let index = null;

            let allocation = context.allocation;

            if (entities && entities.length) {
                const entitiesIds = entities.map((e: any) => {
                    return e[e.__indexer];
                });

                for (let entityId of entitiesIds) {
                    if (allocation[entityId]) {
                        if (allocation[entityId].beforeDelete)
                            await allocation[entityId].beforeDelete();
                        delete allocation[entityId];
                    }
                }
            }

            if (arrayIds && arrayIds.length) {
                let i = 0;
                for (let entityId of arrayIds) {
                    if (allocation[entityId]) {
                        if (allocation[entityId].beforeDelete)
                            await allocation[entityId].beforeDelete();
                        delete allocation[entityId];
                    }
                }
            }

            if (filter) {
                const toDelete = Object.values(allocation).filter(filter);

                for (let entity of toDelete) {
                    for (let key of context.entity.__indexer)
                        if ((entity as any)[key]) {
                            index = key;
                            break;
                        }
                    if (allocation[(entity as any)[index]]) {
                        if (allocation[(entity as any)[index]].beforeDelete)
                            await allocation[(entity as any)[index]].beforeDelete();
                        delete allocation[(entity as any)[index]];
                    }
                }
            }

            this._triggerObservers(context);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * Get entities list filtered from memory core
     * @param context
     * @param filter
     * @returns {any}
     */
    GET<I>(context: TContext<I>, filter: any = null): any {
        try {
            const { core } = this._retrieveCore(context);
            console.log(`${core.constructor.name} ► ${context.entity.name} ► GET`, filter);

            let observableIndex = JSON.stringify({
                entity: context.entity,
                filter: filter !== null ? filter().toString() : null,
            });
            let observable: any = context.observers.get(observableIndex);
            let isNew = false;

            if (!observable) {
                isNew = true;
                observable = {
                    currentData: ref({}),
                    filter: filter !== null ? filter: null,
                    updatedData({ triggerUpdate = false })  {
                        const allocationValues = Object.values(context.allocation);
                        const allocationFiltered = this.filter
                            ? allocationValues.filter(this.filter())
                            : allocationValues;

                        return allocationFiltered.reduce((acc: any, item: any) => {
                            if (triggerUpdate) {
                                item.onRetrieve();
                            }
                            acc[item[item.__indexer || 'id']] = item;
                            return acc;
                        }, {});
                    },
                };
                context.observers.set(observableIndex, observable);
            }
            if (isNew) observable.currentData.value = observable.updatedData({ triggerUpdate: false });
            else { observable.filter = filter !== null ? filter : null }

            return observable.currentData.value;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * Trigger context observers (public)
     * @param context
     */
    TRIGGER(context: TContext<any>): void {
        this._triggerObservers(context);
    }

    /**
     * Trigger context observers (private)
     * @param context
     * @private
     */
    _triggerObservers(context: TContext<any>): void {
        console.log('triggerObservers', context.entity.name);
        for (let [key, observer] of context.observers)
            observer.currentData.value = observer.updatedData({ triggerUpdate: true });
    }

    /**
     * Retrieve and check children memory core
     * @param inputContext
     * @param inputDatas
     */
    _retrieveCore<I>(inputContext: TContext<any>, inputDatas?: I[]): { core: T, context: TContext<I>, datas: I[] } {
        /**
         * @type {typeof this}
         */
        const core: typeof this = this;

        if (!core) {
            throw new Error(`Memory core can not be found.`);
        }

        let context = null;
        let contextError = null;

        const coreContexts = Object.values(core.context).reduce(
            (acc: any, context: any) => acc.push(context.entity.name) && acc,
            [],
        );

        if (!inputContext || !coreContexts.includes(inputContext.entity.name)) {
            contextError = new Error(
                `Context argument does not exist in core : ${core.constructor.name}`,
            );
        } else context = inputContext;

        if (inputDatas && !Array.isArray(inputDatas)) {
            inputDatas = [inputDatas];
        }

        if (contextError) throw contextError;
        else return { core, context, datas: inputDatas } as any;
    }
}