export const byBoolean = (array: any[], index: string | null = null, order: "asc" | "desc" = "asc"): any[] => {
    return array.sort((a, b) => {
        const tA = index ? a[index] : a;
        const tB = index ? b[index] : b;
        if (order === "desc") return tA === tB ? 0 : tA ? -1 : 1;
        else return tA === tB ? 0 : tA ? 1 : -1;
    });
};

export const byNumber = (array: any[], index: string | null = null, order: "asc" | "desc" = "asc"): any[] => {
    return array.sort((a, b) => {
        const tA = index ? getDeepIndex(index, a) : a;
        const tB = index ? getDeepIndex(index, b) : b;
        if (order === "asc") return tA - tB;
        else return tB - tA;
    });
};

export const byString = (array: any[], index: string | null = null, order: "asc" | "desc" = "asc"): any[] => {
    return array.sort((a, b) => {
        const tA = index ? a[index] : a;
        const tB = index ? b[index] : b;
        if (order === "asc") {
            if (tA < tB) return -1;
            if (tA > tB) return 1;
            return 0;
        } else {
            if (tA < tB) return 1;
            if (tA > tB) return -1;
            return 0;
        }
    });
};

function getDeepIndex(index: string, object: any): any {
    const indexes = index.split('.');
    let target = null;
    if (indexes.length) {
        for (const i of indexes) {
            if (target) target = target[i];
            else target = object[i];
        }
    } else target = object[index];
    return target;
}

export default {
    byBoolean,
    byString,
    byNumber,
};
