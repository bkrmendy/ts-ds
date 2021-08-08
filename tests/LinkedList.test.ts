import * as fc from "fast-check";
import * as assert from "assert";
import LinkedLists, { LinkedList } from "../src/LinkedList";

type LinkedStackModel = number[];

type LinkedStack = { stack: LinkedList<number> };
type LinkedStackCommand = fc.Command<LinkedStackModel, LinkedStack>;

class PopCommand implements LinkedStackCommand {
    toString = () => "Pop";
    check = (model: LinkedStackModel) => model.length > 0;
    run = (model: LinkedStackModel, sut: LinkedStack) => {
        assert.notEqual(sut.stack.tail, null);

        const top = sut.stack.head;
        const topM = model.pop();
        assert.equal(top, topM);

        sut.stack = sut.stack.tail!;
    }
}

class PushCommand implements LinkedStackCommand {
    constructor(
        readonly n: number
    ) { }

    toString = () => `Push ${this.n}`;
    check = () => true;
    run = (model: LinkedStackModel, sut: LinkedStack) => {
        sut.stack = LinkedLists.append(this.n, sut.stack);
        model.push(this.n);

        assert.equal(LinkedLists.length(sut.stack), model.length);
        assert.equal(sut.stack.head, this.n);
    }
}

class LengthCommand implements LinkedStackCommand {
    toString = () => "Length";
    check = () => true;
    run = (model: LinkedStackModel, sut: LinkedStack) => {
        assert.equal(LinkedLists.length(sut.stack), model.length);
    }
}

const LinkedListCommands = fc.commands([
    fc.constant(new PopCommand()),
    fc.constant(new LengthCommand()),
    fc.record({ n: fc.nat(10) }).map(({ n }) => new PushCommand(n)),
], { maxCommands: 100 });

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

    it("stm", () => {
        fc.assert(
            fc.property(LinkedListCommands, (commands) => {
                const real = { stack: LinkedLists.empty() };
                const model: LinkedStackModel = [];
                fc.modelRun(() => ({ model, real }), commands);
            })
        );
    })
});