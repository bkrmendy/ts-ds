import * as fc from "fast-check";
import * as assert from "assert";
import FIFOs, { FIFO } from "../src/FIFO";

type FIFOSUT = FIFO<number>;
type FIFOModel = number[];
type FIFOCommand = fc.Command<FIFOModel, FIFOSUT>;

class PutCommand implements FIFOCommand {
    constructor(
        readonly value: number
    ) { }
    toString = () => `Put ${this.value}`;
    check = () => true;
    run = (model: FIFOModel, sut: FIFOSUT) => {
        model.push(this.value);
        sut.put(this.value);
    }
}

class GetCommand implements FIFOCommand {
    toString = () => "Get";
    check = () => true;
    run = (model: FIFOModel, sut: FIFOSUT) => {
        const real = sut.get();
        const dummy = model[0];
        model.shift();

        assert.equal(real, dummy);
    }
}

class PeekCommand implements FIFOCommand {
    toString = () => "Peek";
    check = () => true;
    run = (model: FIFOModel, sut: FIFOSUT) => {
        const real = sut.peek();
        const dummy = model[0] ?? null;

        assert.equal(real, dummy);
    }
}

const FIFOCommands = fc.commands([
    fc.nat().map(n => new PutCommand(n)),
    fc.constant(new GetCommand()),
    fc.constant(new PeekCommand()),
])

describe("FIFO", () => {
    it("fastcheck", () => {
        fc.assert(
            fc.property(FIFOCommands, commands => {
                const real: FIFOSUT = FIFOs.fifo<number>();
                const model: FIFOModel = [];
                fc.modelRun(() => ({ model, real }), commands);
            })
        );
    });
})