interface Empty {
    type: "empty"
}

interface Singleton<T> {
    type: "singleton";
    value: T;
}

interface Multi<T> {
    type: "multi";
    first: T;
    middle: DoublyLinkedListT<T>;
    last: T;
}

export type DoublyLinkedListT<T>
    = Empty
    | Singleton<T>
    | Multi<T>
    ;

export type NonEmptyDoublyLinkedListT<T>
    = Singleton<T>
    | Multi<T>
    ;

/**
 * Complexity: O(1)
 */
const empty = (): Empty => ({ type: "empty" });

/**
 * Complexity: O(1)
 */
const singleton = <T>(elem: T): Singleton<T> => ({
    type: "singleton",
    value: elem,
});

/**
 * Complexity: O(n)
 */
const fromArray = <T>(elems: T[]): DoublyLinkedListT<T> => {
    if (elems.length === 0) {
        return empty();
    }
    if (elems.length === 1) {
        return singleton(elems[0]);
    }
    if (elems.length === 2) {
        return {
            type: "multi",
            first: elems[0],
            middle: empty(),
            last: elems[1]
        };
    }

    const first = elems[0];
    const [last] = elems.slice(-1);
    return {
        type: "multi",
        first,
        last,
        middle: fromArray(elems.slice(1, -1))
    };
}

/**
 * Complexity: O(n)
 */
const toArray = <T>(list: DoublyLinkedListT<T>): T[] => {
    switch (list.type) {
        case "empty": return [];
        case "singleton": return [list.value];
        case "multi": return [list.first, ...toArray(list.middle), list.last];
        /* istanbul ignore next */
        default: assertNever(list);
    }
}

/**
 * Complexity: O(n)
 */
const length = <T>(list: DoublyLinkedListT<T>): number => {
    switch (list.type) {
        case "empty": return 0;
        case "singleton": return 1;
        case "multi": return 2 + length(list.middle);
        /* istanbul ignore next */
        default: assertNever(list);
    }
}

/**
 * TODO
 * Complexity: O(???)
 */
const dropFirst = <T>(list: NonEmptyDoublyLinkedListT<T>): DoublyLinkedListT<T> => {
    if (list.type === "singleton") {
        return empty();
    }

    switch (list.middle.type) {
        case "empty": return singleton(list.last);
        case "singleton": return fromArray([list.middle.value, list.last]);
        case "multi": return {
            type: "multi",
            first: list.middle.first,
            middle: list.middle.middle,
            last: list.last
        };
        /* istanbul ignore next */
        default: assertNever(list.middle);
    }
}

/**
 * TODO
 * Complexity: O(???)
 */
const appendBefore = <T>(elem: T, list: DoublyLinkedListT<T>): NonEmptyDoublyLinkedListT<T> => {
    if (list.type === "empty") {
        return singleton(elem);
    }

    if (list.type === "singleton") {
        return { type: "multi", first: elem, middle: empty(), last: list.value };
    }

    return {
        type: "multi",
        first: elem,
        middle: appendBefore(list.first, list.middle),
        last: list.last
    };
}

export type DoublyLinkedList<T> = Omit<DoublyLinkedListT<T>, "type">;

export default {
    empty,
    singleton,
    fromArray,
    toArray,
    length
}
