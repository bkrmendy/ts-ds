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

type DoublyLinkedListT<T>
    = Empty
    | Singleton<T>
    | Multi<T>
    ;

const empty = (): Empty => ({ type: "empty" });

const singleton = <T>(elem: T): Singleton<T> => ({
    type: "singleton",
    value: elem,
});

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

export type DoublyLinkedList<T> = Omit<DoublyLinkedListT<T>, "type">;

export default {
    empty,
    singleton,
    fromArray,
    toArray,
    length
}
