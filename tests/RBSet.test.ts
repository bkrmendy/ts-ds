import * as fc from "fast-check";
import * as assert from "assert";
import { RBSet } from "../src/RBSet";

type RBSetModel = number[];
type RBSetSUT = RBSet<number>;

type RBSetCommand = fc.Command<RBSetModel, RBSetSUT>;

class ContainsCommand implements RBSetCommand {
  constructor(readonly n: number) {}

  toString = () => `Contains ${this.n}`;
  check = () => true;
  run = (model: RBSetModel, sut: RBSetSUT) => {
    const modelContainsN = model.includes(this.n);
    const sutContainsN = sut.contains(this.n);
    assert.deepStrictEqual(
      sut.entries().sort((a, b) => a - b),
      model.sort((a, b) => a - b)
    );
    assert.equal(modelContainsN, sutContainsN);
  };
}

class InsertCommand implements RBSetCommand {
  constructor(readonly n: number) {}

  toString = () => `Insert ${this.n}`;
  check = () => true;
  run = (model: RBSetModel, sut: RBSetSUT) => {
    const idx = model.indexOf(this.n);
    if (idx > -1) {
      model.splice(idx, 1);
    }
    model.push(this.n);
    sut.insert(this.n);
  };
}

const RBSetCommands = fc.commands(
  [
    fc.nat(100).map((n) => new InsertCommand(n)),
    fc.nat(100).map((n) => new ContainsCommand(n)),
  ],
  { maxCommands: 1000 }
);

describe("RBSet", () => {
  it("constructor with items", () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3];
    const rbSet = new RBSet(numbers);

    for (const number of numbers) {
      assert.ok(rbSet.contains(number));
    }
  });

  it("fastcheck", () => {
    fc.assert(
      fc.property(RBSetCommands, (commands) => {
        const real = new RBSet<number>();
        const model: RBSetModel = [];
        fc.modelRun(() => ({ model, real }), commands);
      }),
      { seed: 280929447 }
    );
  });
});
