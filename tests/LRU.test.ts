import * as fc from "fast-check";
import * as assert from "assert";
import LRUs, { LRU } from "../src/LRU";

type LRUModel = Array<{key: number, value: number}>;
type LRUSUT = LRU<number, number>;

type LRUCommand = fc.Command<LRUModel, LRUSUT>;

class LRUPut implements LRUCommand {
    constructor(
        readonly key: number,
        readonly value: number
    ) { }

    toString = () => `Put key: ${this.key}, value: ${this.value}`;
    check = () => true;
    run = (model: LRUModel, sut: LRUSUT) => {
        model.push({ key: this.key, value: this.value });
        sut.put(this.key, this.value);

        assert.ok(sut.size <= sut.maxSize);
        assert.equal(sut.mostRecentlyUsed, this.key);
    }
}

class LRUGet implements LRUCommand {
    constructor(
        readonly key: number
    ) { }

    toString = () => `Get key: ${this.key}`;
    check = () => true;
    run = (model: LRUModel, sut: LRUSUT) => {
        const value = sut.get(this.key);
        const resultFromModel = model.find(({ key }) => key === this.key);

        assert.ok(sut.size <= sut.maxSize);
        assert.equal(value, resultFromModel?.value);
        if (resultFromModel?.value != null) {
            assert.equal(sut.mostRecentlyUsed, this.key);
        }
    }
}

const LRUCommands = fc.commands([
    fc.record({ key: fc.nat(), value: fc.nat() })
        .map(({ key, value }) => new LRUPut(key, value)),
    fc.nat().map(n => new LRUGet(n))
], { maxCommands: 100 });

describe("LRU", () => {
    it("fc-stm test", () => {
        fc.assert(
            fc.property(LRUCommands, (commands) => {
                const real = LRUs.lru<number, number>(5);
                const model: LRUModel = [];
                fc.modelRun(() => ({ model, real }), commands);
            })
        );
    })
});