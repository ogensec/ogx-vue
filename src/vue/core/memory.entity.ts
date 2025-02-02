export default class MemoryEntity<T extends { [key: string]: any }> {
    name: string = 'anonymous';
    __indexer = null;
    __countCalled = 0;
    __countUpdated = 0;
    __timeLastCalled = null;
    __timeLastUpdated = null;
    __timeCreated = null;
    constructor(data: any) {
        this.hydrate(data, true);
        this.__timeCreated = Date.now();
    }

    hydrate(data: T, construct = false): this {
        for (let key in data) {
            if (typeof (this.constructor as any).fields[key] === 'undefined' && !['__indexer'].includes(key)) {
                // console.warn(`Memory[${this.constructor.name}Entity] : Invalid entity key '${key}' in datas constructor. [removed]`)
            } else {
                if (Array.isArray(data[key])) {
                    if (!this[key as string]) this[key as string] = [];
                    this[key as string] = data[key];
                }
                else if (typeof data[key] === 'object')
                    this[key as string] = data[key];
                else
                    this[key as string] = data[key]
            }
        }
        if (construct) {
            const fields = Object.entries((this.constructor as any).fields);
            for (let [key, value] of fields) {
                if (this[key] === undefined) {
                    if (value === null) this[key] = null;
                    else if (Array.isArray(value))
                        this[key] = [...value]
                    else if (typeof value === 'object')
                        this[key] = {...value }
                    else
                        this[key] = value
                }
            }
        }
        return this;
    }

    update(nextStates: Partial<T>): void {
        for (let key in nextStates) {
            if (typeof (this.constructor as any).fields[key] === 'undefined') {
                // console.warn(`Memory[${this.constructor.name}Entity] : Invalid entity key '${key}' in update method. [ignored]`)
            } else {
                // if (Array.isArray(nextStates[key])) {
                //     if (!this[key]) this[key] = [];
                //     this[key] = nextStates[key];
                // }
                // else if (typeof nextStates[key] === 'object')
                //     this[key] = nextStates[key]
                // else
                this[key as string] = nextStates[key]
            }
        }
        this.onUpdate(this).finally()
    }

    async beforeDelete(): Promise<void> {}

    async onUpdate(entity: this): Promise<this> {
        this.__countUpdated++;
        this.__timeLastUpdated = new Date();
        return entity;
    }

    onRetrieve(): void {
        this.__countCalled++;
        this.__timeLastCalled = new Date();
    }
}
