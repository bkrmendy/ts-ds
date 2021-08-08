import LS, { LinkedSet } from "./LinkedSet";

export interface LRU<K, V> {
    put: (key: K, value: V) => void;
    get: (key: K) => V | null;
}

class LRUImpl<K, V> implements LRU<K, V> {
    private elems: LinkedSet<K> = LS.linkedSet();
    private cache: Map<K, V> = new Map<K, V>();

    constructor(
        private maxSize: number
    ) { }


    put = (key: K, value: V) => {
        if (this.elems.size >= this.maxSize) {
            const leastRecentlyUsed = this.elems.last!; // TODO: somehow make the `!` disappear
            this.elems.delete(leastRecentlyUsed);
            this.cache.delete(leastRecentlyUsed);
        }
        this.cache.set(key, value);
        this.elems.insert(key);
    }

    get = (key: K) => {
        if (this.elems.size < 1) {
            return null;
        }

        const elem = this.cache.get(key) ?? null;
        if (elem != null) {
            this.elems.delete(key);
            this.elems.insert(key);
        }
        return elem;
    }
}

export default {
    lru: <K, V>(size: number): LRU<K, V> => new LRUImpl(size)
}