export interface RingBuffer<T> {
    add: (_: T) => void;
    entries: () => Readonly<T[]>;

    maxSize: number;
    size: number;
}

class RingBufferImpl<T> implements RingBuffer<T> {
    private readonly maxBufferSize: number;

    constructor(
        maxBufferSize: number,
        private buffer: T[] = [],
        private headIndex: number = 0
    ) {
        this.maxBufferSize = maxBufferSize;
    }

    get maxSize() {
        return this.maxBufferSize;
    }

    get size() {
        return this.buffer.length;
    }

    public add(entry: T) {
        const currentIndex = this.headIndex % this.maxBufferSize;
        this.buffer[currentIndex] = entry;
        this.headIndex = currentIndex + 1;
    }

    public entries = (): Readonly<T[]> => [...this.buffer.slice(this.headIndex), ...this.buffer.slice(0, this.headIndex)];
}

const ringBuffer = <T>(size: number): RingBuffer<T> => new RingBufferImpl<T>(size);

export default {
    ringBuffer
}