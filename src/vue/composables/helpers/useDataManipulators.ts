const BLACKLIST_METHODS = [
    '__defineGetter__',
    '__defineSetter__',
    '__lookupGetter__',
    '__lookupSetter__',
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
];

export function getClassMethods(target: any) {
    const props = [];
    let obj = target;
    do {
        props.push(...Object.getOwnPropertyNames(obj));
    } while ((obj = Object.getPrototypeOf(obj)));

    return props.sort().filter((e, i, arr) => {
        if (e !== arr[i + 1] && typeof target[e] === 'function' && !BLACKLIST_METHODS.includes(e)) return true;
    });
}

export function mergeClass(a: any, b: any): any {
    const result = a;
    const keys = [...Object.keys(b), ...Object.getOwnPropertyNames(Object.getPrototypeOf(b))];
    for (const key of keys) {
        if (Array.isArray(b[key])) {
            result[key] = result[key] ? mergeArrays(result[key], b[key]) : b[key];
        } else if (typeof b[key] === 'object' && !isFunction(b[key])) {
            result[key] = result[key] ? mergeObjects(result[key], b[key]) : b[key];
        } else {
            result[key] = b[key];
        }
    }

    return result;
}

export function mergeObjects(a: any, b: any): any {
    const result = a;
    for (const key in b) {
        if (Array.isArray(b[key])) {
            result[key] = result[key] ? mergeArrays(result[key], b[key]) : b[key];
        } else if (typeof b[key] === 'object' && !isFunction(b[key])) {
            result[key] = result[key] ? mergeObjects(result[key], b[key]) : b[key];
        } else {
            result[key] = b[key];
        }
    }

    return result;
}

export function mergeArrays(a: any[], b: any[]): any[] {
    let typesA = a.map(index => typeof index);
    typesA = typesA.filter((value, index) => {
        return typesA.indexOf(value) === index;
    });
    let typesB = a.map(index => typeof index);
    typesB = typesB.filter((value, index) => {
        return typesB.indexOf(value) === index;
    });

    if (typesA.length === 1 && typesB.length === 1) {
        if ((typesA[0] === 'string' && typesB[0] === 'string') || (typesA[0] === 'number' && typesB[0] === 'number')) {
            return [...a, ...b];
        }
    }

    return [...a, ...b];
}

function isFunction(value: any): boolean {
    return typeof value === 'function';
}
