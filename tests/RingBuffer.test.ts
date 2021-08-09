import * as fc from "fast-check";
import * as assert from "assert";
import RB, { RingBuffer } from "../src/RingBuffer";

type RingBufferModel = number[];
type RingBufferSUT = RingBuffer<number>;
type RingBufferCommand = fc.Command<RingBufferModel, RingBufferSUT>;

class AddCommand implements RingBufferCommand {
    constructor(
        private readonly value: number
    ) { }

    toString = () => `Add ${this.value}`;
    check = () => true;
    run = (model: RingBufferModel, sut: RingBufferSUT) => {
        model.push(this.value);
        if (model.length > sut.maxSize) {
            model.shift();
        }
        sut.add(this.value);
    }
}

class EntriesCommand implements RingBufferCommand {
    toString = () => "Entries";
    check = () => true;
    run = (model: RingBufferModel, sut: RingBufferSUT) => {
        const es = sut.entries();
        assert.deepEqual(model, es);
        assert.ok(es.length <= sut.maxSize);
    }
}

class MaxSizeCommand implements RingBufferCommand {
    toString = () => "MaxSize";
    check = () => true;
    run = (model: RingBufferModel, sut: RingBufferSUT) => {
        assert.ok(sut.size <= sut.maxSize);
        assert.ok(model.length <= sut.maxSize);
    }
}

class SizeCommand implements RingBufferCommand {
    toString = () => "Size";
    check = () => true;
    run = (model: RingBufferModel, sut: RingBufferSUT) => {
        assert.equal(model.length, sut.size);
    }
}

const RingBufferCommands = fc.commands([
    fc.nat().map(n => new AddCommand(n)),
    fc.constant(new EntriesCommand()),
    fc.constant(new MaxSizeCommand()),
    fc.constant(new SizeCommand())
], { maxCommands: 100 });

describe("RingBuffer", () => {
    it("fastcheck", () => {
        fc.assert(
            fc.property(RingBufferCommands, commands => {
                const model: RingBufferModel = [];
                const real: RingBufferSUT = RB.ringBuffer(10);
                fc.modelRun(() => ({ model, real }), commands);
            })
        )
    });
});