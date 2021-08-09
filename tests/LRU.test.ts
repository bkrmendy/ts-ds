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

    toString = () => `Put { key: ${this.key}, value: ${this.value} }`;
    check = () => true;
    run = (model: LRUModel, sut: LRUSUT) => {
        const indexOfKey = model.findIndex(({ key }) => key === this.key);

        if (indexOfKey >= 0) {
            model.splice(indexOfKey, 1);
        }

        model.push({ key: this.key, value: this.value });
        if (model.length > sut.maxSize) {
            model.splice(0, 1);
        }

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
        const indexFromModel = model.findIndex(({ key }) => key === this.key);
        const valueFromModel = model[indexFromModel]?.value ?? null;

        if (indexFromModel >= 0) {
            const entry = model[indexFromModel];
            model.splice(indexFromModel, 1);
            model.push(entry);
        }

        assert.ok(sut.size <= sut.maxSize);
        assert.equal(value, valueFromModel);
    }
}

class LRUMostRecent implements LRUCommand {
    toString = () => "MostRecent";
    check = () => true;
    run = (model: LRUModel, sut: LRUSUT) => {
        const r = sut.mostRecentlyUsed;
        const m = model[model.length - 1]?.key ?? null;

        assert.equal(r, m);
    }
}

class LRULeastRecent implements LRUCommand {
    toString = () => "LeastRecent";
    check = () => true;
    run = (model: LRUModel, sut: LRUSUT) => {
        const r = sut.leastRecentlyUsed;
        const m = model[0]?.key ?? null;

        assert.equal(r, m);
    }
}

const LRUCommands = fc.commands([
    fc.record({ key: fc.nat(10), value: fc.nat(10) })
        .map(({ key, value }) => new LRUPut(key, value)),
    fc.nat(10).map(n => new LRUGet(n)),
    fc.constant(new LRUMostRecent()),
    fc.constant(new LRULeastRecent())
], { maxCommands: 1000 });

describe("LRU", () => {
    it("fastcheck", () => {
        fc.assert(
            fc.property(LRUCommands, (commands) => {
                const real = LRUs.lru<number, number>(10);
                const model: LRUModel = [];
                fc.modelRun(() => ({ model, real }), commands);
            })
        );
    })
});