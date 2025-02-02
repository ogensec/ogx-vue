type CacheEntry<T> = {
    value: T;
    expiration: number;
};

const cacheMap = new Map<string, CacheEntry<any>>();

export function useCache<T>(
    fn: () => T,
    options: number | { time: number; forceInvalidate?: boolean }
): T {
    const time = typeof options === "number" ? options : options.time;
    const forceInvalidate = typeof options === "object" && options.forceInvalidate;
    const key = fn.toString();

    const now = Date.now();
    const cachedEntry = cacheMap.get(key);

    if (cachedEntry && cachedEntry.expiration > now && !forceInvalidate) {
        return cachedEntry.value;
    }

    const value = fn();
    cacheMap.set(key, { value, expiration: now + time });

    return value;
}
