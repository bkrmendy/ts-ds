interface Empty<T> {
    head: null;
    tail: null;
    type: "empty";
}

interface Cons<T> {
    head: T;
    tail: LinkedList<T>;
    type: "cons";
}

export type LinkedList<T> = Empty<T> | Cons<T>;

const empty = <T>(): LinkedList<T> => ({
    type: "empty",
    head: null,
    tail: null,
});

const singleton = <T>(elem: T): LinkedList<T> => append(elem, empty());

const append = <T>(head: T, rest: LinkedList<T>): LinkedList<T> => ({
    type: "cons",
    head: head,
    tail: rest
});

const fromArray = <T>(elems: T[]): LinkedList<T> => {
    if (elems.length === 0) {
        return empty();
    }
    const [head, ...rest] = elems;
    return append(head, fromArray(rest));
}

const toArray = <T>(list: LinkedList<T>): T[] => {
    switch (list.type) {
        case "empty": return [];
        case "cons": return [list.head, ...toArray(list.tail)];
        /* istanbul ignore next */
        default: assertNever(list);
    }
}

const length = <T>(list: LinkedList<T>): number => {
    switch (list.type) {
        case "empty": return 0;
        case "cons": return 1 + length(list.tail);
        /* istanbul ignore next */
        default: assertNever(list);
    }
}

const LinkedLists = {
    empty,
    singleton,
    append,
    fromArray,
    toArray,
    length
}

export default LinkedLists;

