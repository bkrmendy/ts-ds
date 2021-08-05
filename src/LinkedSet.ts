export interface LinkedSet<T> {
    contains: (_: T) => boolean;
    delete: (_: T) => void;
    insert: (_: T) => void;
    at: (idx: number) => T | null;
    size: () => number;
}

/**
 * this is cheating, but js arrays have near constant time perf for small sizes
 * a real constant time implementation is left to the reader
 */
class LinkedSetImpl<T> implements LinkedSet<T> {
    private mapping: Map<T, number> = new Map();
    private order: T[] = [];

    size = () => this.order.length;

    contains = (t: T) => this.mapping.get(t) != null;

    delete = (t: T) => {
        const index = this.mapping.get(t);
        if (index == null) {
            return;
        }

        this.order.splice(index, 1);
        // this.mapping.delete(t);
    }

    insert = (t: T) => {
        this.delete(t);
        this.order.push(t);
        this.mapping.set(t, this.order.length);
    }

    at = (idx: number) => {
        if (idx < this.order.length) {
            return this.order[idx];
        }
        return null;
    }
}

const linkedSet = <T>(): LinkedSet<T> => new LinkedSetImpl();

export default {
    linkedSet
}
