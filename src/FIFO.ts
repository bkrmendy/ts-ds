export interface FIFO<T> {
    put: (_: T) => void;
    get: () => T | null;
    peek: () => T | null;
}

class FIFOImpl<T> {
    private elems: T[] = [];

    put = (t: T): void => {
        this.elems.push(t);
    }

    get = (): T | null => {
        if (this.elems.length < 1) {
            return null;
        }

        const [head, ...rest] = this.elems;
        this.elems = rest;

        return head;
    }

    peek = (): T | null => {
        if (this.elems.length < 1) {
            return null;
        }

        const [head, ] = this.elems;

        return head;
    }
}

const fifo = <T>() => new FIFOImpl<T>();

export default {
    fifo
};