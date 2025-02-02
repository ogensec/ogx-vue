export const arrays = (arrA: any[] | undefined, arrB: any[] | undefined): boolean => {
    if (!arrA && !arrB) return true;
    if (!Array.isArray(arrA) || !Array.isArray(arrB)) return false;
    if (!arrA.length && !arrB.length) return true;
    if (arrA.length !== arrB.length) return false;
    for (let i in arrA) {
        if (arrA[i] !== arrB[i]) {
            if (['number', 'string', 'boolean'].includes(typeof arrA[i])) return false;
            if (Array.isArray(arrA[i])) {
                if (!arrays(arrA[i], arrB[i])) return false;
            } else if (typeof arrA[i] === 'object') {
                if (!objects(Object.values(arrA[i]), Object.values(arrB[i]))) return false;
            }
        }
    }
    return true;
};

export const objects = (objA: any | undefined, objB: any | undefined): boolean => {
    if (!objA && !objB) return true;
    if (typeof objA !== typeof objB) return false;
    for (let i in objA) {
        if (['number', 'string', 'boolean'].includes(typeof objA[i])) return false;
        if (Array.isArray(objA[i])) {
            if (!arrays(objA[i], objB[i])) return false;
        } else if (typeof objA[i] === 'object') {
            if (!objects(Object.values(objA[i]), Object.values(objB[i]))) return false;
        }
    }
    return true;
};

export default {
    arrays,
    objects
};
