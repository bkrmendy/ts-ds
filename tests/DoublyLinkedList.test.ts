import DL from "../src/DoublyLinkedList";
import * as fc from "fast-check"

describe("doubly linked list", () => {
    it("length", () => {
        fc.assert(
            fc.property(
                fc.array(fc.integer()), is => expect(DL.length(DL.fromArray(is))).toEqual(is.length)
            )
        )
    });

    it("fromArray . toArray = id", () => {
        fc.assert(
            fc.property(
                fc.array(fc.integer()), is => expect(DL.toArray(DL.fromArray(is))).toEqual(is)
            )
        )
    })
});