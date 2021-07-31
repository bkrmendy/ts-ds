interface Empty<T> {
    head: null;
    tail: null;
    type: "empty";
}

interface Cons<T> {
    head: T;
    tail: LinkedListT<T>;
    type: "cons";
}

type LinkedListT<T> = Empty<T> | Cons<T>;

/**
 * Complexity: O(1)
 */
const empty = <T>(): LinkedListT<T> => ({
    type: "empty",
    head: null,
    tail: null,
});

/**
 * Complexity: O(1)
 */
const singleton = <T>(elem: T): LinkedListT<T> => append(elem, empty());

/**
 * Complexity: O(1)
 */
const append = <T>(head: T, rest: LinkedListT<T>): LinkedListT<T> => ({
    type: "cons",
    head: head,
    tail: rest
});

/**
 * Complexity: O(n)
 */
const fromArray = <T>(elems: T[]): LinkedListT<T> => {
    if (elems.length === 0) {
        return empty();
    }
    const [head, ...rest] = elems;
    return append(head, fromArray(rest));
}

/**
 * Complexity: O(n)
 */
const toArray = <T>(list: LinkedListT<T>): T[] => {
    switch (list.type) {
        case "empty": return [];
        case "cons": return [list.head, ...toArray(list.tail)];
        /* istanbul ignore next */
        default: assertNever(list);
    }
}

/**
 * Complexity: O(n) with respect to `elems.length`
 */
const length = <T>(list: LinkedListT<T>): number => {
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

export type LinkedList<T> = Omit<LinkedListT<T>, "type">;
export default LinkedLists;

