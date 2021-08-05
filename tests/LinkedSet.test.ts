import * as fc from "fast-check";
import * as assert from "assert";
import LinkedSets, { LinkedSet } from "../src/LinkedSet";

type LinkedSetModel = number[];
type LinkedSetSUT = LinkedSet<number>;

type LinkedSetCommand = fc.Command<LinkedSetModel, LinkedSetSUT>;

class ContainsCommand implements LinkedSetCommand {
    constructor(
        readonly n: number
    ) { }

    toString = () => `Contains ${this.n}`;
    check = (model: LinkedSetModel) => model.includes(this.n);
    run = (model: LinkedSetModel, sut: LinkedSetSUT) => {
        const modelContainsN = model.includes(this.n);
        const sutContainsN = sut.contains(this.n);
        assert.equal(modelContainsN, sutContainsN);
    }
}

class DeleteCommand implements LinkedSetCommand {
    constructor(
        readonly n: number
    ) { }

    toString = () => `Delete ${this.n}`;
    check = (model: LinkedSetModel) => model.includes(this.n);
    run = (model: LinkedSetModel, sut: LinkedSetSUT) => {
        sut.delete(this.n);
        const idx = model.findIndex(n => n === this.n);
        if (idx >= 0) {
            model.splice(idx, 1);
        }
    }
}

class InsertCommand implements LinkedSetCommand {
    constructor(
        readonly n: number
    ) { }

    toString = () => `Insert ${this.n}`;
    check = () => true;
    run = (model: LinkedSetModel, sut: LinkedSetSUT) => {
        model.push(this.n);
        sut.insert(this.n);
    }
}

class AtCommand implements LinkedSetCommand {
    constructor(
        readonly idx: number
    ) { }

    toString = () => `At: ${this.idx}`;
    check = (model: LinkedSetModel) => this.idx < model.length;
    run = (model: LinkedSetModel, sut: LinkedSetSUT) => {
        let elem: number | null = null;
        if (this.idx < model.length) {
            elem = model[this.idx];
        }

        const elemFromSUT = sut.at(this.idx);
        assert.equal(elemFromSUT, elem);
    }
}

class SizeCommand implements LinkedSetCommand {
    toString = () => "Size";
    check = () => true;
    run = (model: LinkedSetModel, sut: LinkedSetSUT) => {
        assert.equal(model.length, sut.size());
    }
}

const LinkedSetCommands = fc.commands([
    fc.constant(new SizeCommand()),
    fc.nat().map(n => new AtCommand(n)),
    fc.nat().map(n => new InsertCommand(n)),
    fc.nat().map(n => new DeleteCommand(n)),
    fc.nat().map(n => new ContainsCommand(n)),
], { maxCommands: 100 });

describe("LinkedSet", () => {
    it("fc-stm test", () => {
        fc.assert(
            fc.property(LinkedSetCommands, (commands) => {
                const real = LinkedSets.linkedSet<number>();
                const model: LinkedSetModel = [];
                fc.modelRun(() => ({ model, real }), commands);
            })
        );
    })
})