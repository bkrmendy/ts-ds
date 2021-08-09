import LS, { LinkedSet } from "./LinkedSet";

export interface LRU<K, V> {
    put: (key: K, value: V) => void;
    get: (key: K) => V | null;

    maxSize: Readonly<number>;
    size: Readonly<number>;
    mostRecentlyUsed: Readonly<K> | null;
    leastRecentlyUsed: Readonly<K> | null;
}

class LRUImpl<K, V> implements LRU<K, V> {
    private elems: LinkedSet<K> = LS.linkedSet();
    private cache: Map<K, V> = new Map<K, V>();

    constructor(
        private readonly maxSize_: number
    ) { }

    get maxSize() {
        return this.maxSize_;
    }

    get size() {
        return this.cache.size;
    }

    get mostRecentlyUsed() {
        return this.elems.first;
    }

    get leastRecentlyUsed() {
        return this.elems.last;
    }

    put = (key: K, value: V) => {
        this.cache.set(key, value);
        this.elems.insert(key);

        if (this.elems.size > this.maxSize_) {
            const leastRecentlyUsed = this.elems.last!; // TODO: somehow make the `!` disappear
            this.elems.delete(leastRecentlyUsed);
            this.cache.delete(leastRecentlyUsed);
        }
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