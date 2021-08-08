export interface LinkedSet<T> {
    contains: (_: T) => boolean;
    delete: (_: T) => void;
    insert: (_: T) => void;

    size: number;
    first: T | null;
    last: T | null;
}

interface DoublyLinkedList<T> {
    value: T;
    next: DoublyLinkedList<T> | null;
    prev: DoublyLinkedList<T> | null;
}

type Linked<T>
    = { type: "empty" }
    | { type: "singleton", value: T }
    | { type: "linked", first: DoublyLinkedList<T>, last: DoublyLinkedList<T>, mapping: Map<T, DoublyLinkedList<T>>  }
    ;

function insertLinked<T>(elem: T, list: Linked<T>): Linked<T> {

    const next = deleteLinked(elem, list); // this guarantees that `elem` is not in the list

    if (next.type === "empty") {
        return { type: "singleton", value: elem };
    }

    if (next.type === "singleton") {
        const first: DoublyLinkedList<T> = { value: elem, next: null, prev: null };
        const last: DoublyLinkedList<T> = { value: next.value, next: first, prev: null };
        first.prev = last;

        const mapping: Map<T, DoublyLinkedList<T>> = new Map();
        mapping.set(elem, first);
        mapping.set(next.value, last);

        return { type: "linked", first, last, mapping };
    }

    if (next.type === "linked") {
        const { mapping, first, last } = next;
        const nextFirst: DoublyLinkedList<T> = { value: elem, next: null, prev: first };
        first.next = nextFirst;

        mapping.set(elem, nextFirst);

        return { type: "linked", first: nextFirst, last, mapping };
    }

    /* istanbul ignore next */
    assertNever(next);
}

function deleteLinked<T>(elem: T, list: Linked<T>): Linked<T> {
    if (list.type === "empty") {
        return list;
    }

    if (list.type === "singleton") {
        if (list.value === elem) {
            return { type: "empty" };
        }
        return list;
    }

    if (list.type === "linked") {
        const { first, last, mapping } = list;
        if (!mapping.has(elem)) {
            return list;
        }

        if (mapping.size == 2) {
            if (elem === first.value) {
                return { type: "singleton", value: last.value };
            }

            if (elem === last.value) {
                return { type: "singleton", value: first.value };
            }
        }

        if (elem === first.value) {
            mapping.delete(elem);
            return {
                type: "linked",
                first: first.prev!,
                last,
                mapping
            };
        }

        if (elem === last.value) {
            mapping.delete(elem);
            return {
                type: "linked",
                first,
                last: last.next!,
                mapping
            }
        }

        const entry = mapping.get(elem);
        mapping.delete(elem);
        entry!.next!.prev = entry!.prev;
        entry!.prev!.next = entry!.next;
        return { type: "linked", mapping, first, last };
    }

    /* istanbul ignore next */
    assertNever(list);
}

class LinkedSetImpl<T> implements LinkedSet<T> {
    private linked: Linked<T> = { type: "empty" };

    get size() {
        switch (this.linked.type) {
        case "empty": return 0;
        case "singleton": return 1;
            case "linked": return this.linked.mapping.size;
            /* istanbul ignore next */
        default: assertNever(this.linked);
    }
     };

    get first() {
        switch (this.linked.type) {
            case "empty": return null;
            case "singleton": return this.linked.value;
            case "linked": return this.linked.first.value;
            /* istanbul ignore next */
            default: assertNever(this.linked);
        }
    }

    get last() {
        switch (this.linked.type) {
            case "empty": return null;
            case "singleton": return this.linked.value;
            case "linked": return this.linked.last.value;
            /* istanbul ignore next */
            default: assertNever(this.linked);
        }
    }

    contains = (t: T) => {
        switch (this.linked.type) {
            case "empty": return false;
            case "singleton": return this.linked.value === t;
            case "linked": return this.linked.mapping.has(t);
            /* istanbul ignore next */
            default: assertNever(this.linked);
        }
    };

    delete = (t: T) => {
        this.linked = deleteLinked(t, this.linked);
    }

    insert = (t: T) => {
        this.linked = insertLinked(t, this.linked);
    }
}

const linkedSet = <T>(): LinkedSet<T> => new LinkedSetImpl();

export default {
    linkedSet
}
