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

const empty = (): Empty => ({ type: "empty" });

const singleton = <T>(elem: T): Singleton<T> => ({
    type: "singleton",
    value: elem,
});

const multi = <T>(elems: T[]): Multi<T> => {
    if (elems.length < 2) {
        throw new Error();
    }

    const first = elems[0]
    const [last] = elems.slice(-1);
    const rest = elems.slice(1, -1);

    return {
        type: "multi",
        first,
        last,
        middle: fromArray(rest)
    }
}

const fromArray = <T>(elems: T[]): DoublyLinkedListT<T> => {
    switch (elems.length) {
        case 0: return empty();
        case 1: return singleton(elems[0]);
        default: return multi(elems);
    }
}

const nonEmpty = <T>(elems: T[]): NonEmptyDoublyLinkedListT<T> => {
    switch (elems.length) {
        case 0: throw new Error();
        case 1: return singleton(elems[0]);
        default: return multi(elems);
    }
}

const toArray = <T>(list: DoublyLinkedListT<T>): T[] => {
    switch (list.type) {
        case "empty": return [];
        case "singleton": return [list.value];
        case "multi": return [list.first, ...toArray(list.middle), list.last];
        /* istanbul ignore next */
        default: assertNever(list);
    }
}

const length = <T>(list: DoublyLinkedListT<T>): number => {
    switch (list.type) {
        case "empty": return 0;
        case "singleton": return 1;
        case "multi": return 2 + length(list.middle);
        /* istanbul ignore next */
        default: assertNever(list);
    }
}

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
    length,
    nonEmpty
}
