export const toObject = (map: Map<any, any>) => {
    return Object.entries(map).reduce((obj, [key, value]) => { obj[key] = value; return obj}, {})
}