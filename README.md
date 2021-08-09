# Model-based property checking with Typescript

## Property testing: the basics
For an introduction to property-based testing, see [the fast-check docs](https://github.com/dubzzz/fast-check/blob/main/documentation/HandsOnPropertyBased.md).
Fast-check is the state-of-the-art Typescript property testing library.

## Model-based property testing
Model-based property testing builds on general property testing techniques to generate pretty much exhaustive test suites for imperative code.
For a basic example, see `tests/FIFO.test.ts`, which is model-based test suite for a FIFO queue.
The basic idea is to define a set of **commands**, which are run on the real system to be tested, and on a **model** of the system (in this repo all the data structures are modelled by array, but this really depends on what is tested). When a command is run, the model and the

## Experiences
- Commands are naturally driven by the interface of the system to be tested (see the FIFO queue).
- Commands give a natural place to put invariant checks
- Care has to be taken with model implementations, since if an error in a model implementation invalidates the whole test suite

## DS Wish List:
- [x] Linked list
- [x] LRU
- [x] FIFO
- [ ] Ring buffer

## Resources:

[A Simple State-Machine Framework for Property-Based Testing in OCaml by Jan Midtgaard](https://janmidtgaard.dk/papers/Midtgaard%3AOCaml20.pdf): Concise, to the point, great for someone who already knows what's the deal with property testing, but wants to apply it to imperative code.

[John Hughes - Testing the Hard Stuff and Staying Sane](https://www.youtube.com/watch?v=zi0rHwfiX1Q&t=594s): Great examples by John Hughes, the "inventor" of property testing.

[Choosing properties for property-based testing](https://fsharpforfunandprofit.com/posts/property-based-testing-2/): A great cookbook-style article series about property-based testing (not yet applied to this repo, yet).