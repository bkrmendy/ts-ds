import * as fc from "fast-check";
import LinkedLists, { LinkedList } from "../src/LinkedList";

describe("linked lists", () => {
    it("empty", () => {
        expect(LinkedLists.fromArray([])).toEqual(LinkedLists.empty());
    });

    it("fromArray . toArray = id", () => {
        fc.assert(
            fc.property(
                fc.array(fc.integer()), is => expect(LinkedLists.toArray(LinkedLists.fromArray(is))).toEqual(is)
            )
        )
    });

    it("length", () => {
        fc.assert(
            fc.property(
                fc.array(fc.integer()), is => expect(LinkedLists.length(LinkedLists.fromArray(is))).toEqual(is.length)
            )
        )
    });
});