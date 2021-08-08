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
        const idx = model.indexOf(this.n);
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
        const idx = model.indexOf(this.n);
        if (idx > -1) {
            model.splice(idx, 1);
        }
        model.push(this.n);
        sut.insert(this.n);
    }
}

class FirstCommand implements LinkedSetCommand {
    toString = () => "First";
    check = (model: LinkedSetModel) => model.length > 0;
    run = (model: LinkedSetModel, sut: LinkedSetSUT) => {
        const modelFirst = model[model.length - 1];
        const sutFirst = sut.first;
        assert.equal(modelFirst, sutFirst);
    }
}

class LastCommand implements LinkedSetCommand {
    toString = () => "Last";
    check = (model: LinkedSetModel) => model.length > 0;
    run = (model: LinkedSetModel, sut: LinkedSetSUT) => {
        const modelLast = model[0];
        const sutLast = sut.last
        assert.equal(modelLast, sutLast);
    }
}

class SizeCommand implements LinkedSetCommand {
    toString = () => "Size";
    check = () => true;
    run = (model: LinkedSetModel, sut: LinkedSetSUT) => {
        assert.equal(model.length, sut.size);
    }
}

const LinkedSetCommands = fc.commands([
    fc.constant(new SizeCommand()),
    fc.constant(new FirstCommand()),
    fc.constant(new LastCommand()),
    fc.nat(10).map(n => new InsertCommand(n)),
    fc.nat(10).map(n => new DeleteCommand(n)),
    fc.nat(10).map(n => new ContainsCommand(n)),
], { maxCommands: 100 });

describe("LinkedSet", () => {
    it("fc-stm test", () => {
        fc.assert(
            fc.property(LinkedSetCommands, (commands) => {
                const real = LinkedSets.linkedSet<number>();
                const model: LinkedSetModel = [];
                fc.modelRun(() => ({ model, real }), commands);
            }), { seed: 280929447 });
    });
});