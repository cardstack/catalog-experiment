/// <reference lib="esnext.asynciterable" />

/**
 * A signal object that allows you to communicate with a request and abort it if required
 * via its associated `AbortController` object.
 *
 * @remarks
 *   This interface is compatible with the `AbortSignal` interface defined in TypeScript's DOM types.
 *   It is redefined here, so it can be polyfilled without a DOM, for example with
 *   {@link https://www.npmjs.com/package/abortcontroller-polyfill | abortcontroller-polyfill} in a Node environment.
 */
export declare interface AbortSignal {
    readonly aborted: boolean;
    addEventListener(type: 'abort', listener: () => void): void;
    removeEventListener(type: 'abort', listener: () => void): void;
}

export declare class ByteLengthQueuingStrategy implements QueuingStrategy<ArrayBufferView> {
    readonly highWaterMark: number;
    constructor({ highWaterMark }: {
        highWaterMark: number;
    });
    size(chunk: ArrayBufferView): number;
}

export declare class CountQueuingStrategy implements QueuingStrategy<any> {
    readonly highWaterMark: number;
    constructor({ highWaterMark }: {
        highWaterMark: number;
    });
    size(): 1;
}

export declare interface PipeOptions {
    preventAbort?: boolean;
    preventCancel?: boolean;
    preventClose?: boolean;
    signal?: AbortSignal;
}

export declare interface QueuingStrategy<T = any> {
    highWaterMark?: number;
    size?: QueuingStrategySizeCallback<T>;
}

declare type QueuingStrategySizeCallback<T = any> = (chunk: T) => number;

declare type ReadableByteStream = ReadableStream<Uint8Array>;

export declare type ReadableByteStreamController = ReadableByteStreamController_2;

declare class ReadableByteStreamController_2 {
    readonly byobRequest: ReadableStreamBYOBRequest_2 | undefined;
    readonly desiredSize: number | null;
    close(): void;
    enqueue(chunk: ArrayBufferView): void;
    error(e: any): void;
}

declare type ReadableByteStreamControllerCallback = (controller: ReadableByteStreamController) => void | PromiseLike<void>;

export declare class ReadableStream<R = any> {
    constructor(underlyingSource: UnderlyingByteSource, strategy?: {
        highWaterMark?: number;
        size?: undefined;
    });
    constructor(underlyingSource?: UnderlyingSource<R>, strategy?: QueuingStrategy<R>);
    readonly locked: boolean;
    cancel(reason: any): Promise<void>;
    getReader({ mode }: {
        mode: 'byob';
    }): ReadableStreamBYOBReader_2;
    getReader(): ReadableStreamDefaultReader_2<R>;
    pipeThrough<T>({ writable, readable }: {
        writable: WritableStream<R>;
        readable: ReadableStream<T>;
    }, { preventClose, preventAbort, preventCancel, signal }?: PipeOptions): ReadableStream<T>;
    pipeTo(dest: WritableStream<R>, { preventClose, preventAbort, preventCancel, signal }?: PipeOptions): Promise<void>;
    tee(): [ReadableStream<R>, ReadableStream<R>];
    getIterator({ preventCancel }?: {
        preventCancel?: boolean;
    }): ReadableStreamAsyncIterator<R>;
    [Symbol.asyncIterator]: (options?: {
        preventCancel?: boolean;
    }) => ReadableStreamAsyncIterator<R>;
}

export declare interface ReadableStreamAsyncIterator<R> extends AsyncIterator<R> {
    next(): Promise<IteratorResult<R>>;
    return(value?: any): Promise<IteratorResult<any>>;
}

export declare type ReadableStreamBYOBReader = ReadableStreamBYOBReader_2;

declare class ReadableStreamBYOBReader_2 {
    constructor(stream: ReadableByteStream);
    readonly closed: Promise<void>;
    cancel(reason: any): Promise<void>;
    read<T extends ArrayBufferView>(view: T): Promise<ReadResult<T>>;
    releaseLock(): void;
}

export declare type ReadableStreamBYOBRequest = ReadableStreamBYOBRequest_2;

declare class ReadableStreamBYOBRequest_2 {
    readonly view: ArrayBufferView;
    respond(bytesWritten: number): void;
    respondWithNewView(view: ArrayBufferView): void;
}

export declare type ReadableStreamDefaultController<R> = ReadableStreamDefaultController_2<R>;

declare class ReadableStreamDefaultController_2<R> {
    readonly desiredSize: number | null;
    close(): void;
    enqueue(chunk: R): void;
    error(e: any): void;
}

declare type ReadableStreamDefaultControllerCallback<R> = (controller: ReadableStreamDefaultController<R>) => void | PromiseLike<void>;

export declare type ReadableStreamDefaultReader<R> = ReadableStreamDefaultReader_2<R>;

declare class ReadableStreamDefaultReader_2<R> {
    constructor(stream: ReadableStream<R>);
    readonly closed: Promise<void>;
    cancel(reason: any): Promise<void>;
    read(): Promise<ReadResult<R>>;
    releaseLock(): void;
}

declare type ReadableStreamErrorCallback = (reason: any) => void | PromiseLike<void>;

export declare type ReadResult<T> = {
    done: false;
    value: T;
} | {
    done: true;
    value?: T;
};

export declare interface Transformer<I = any, O = any> {
    start?: TransformStreamDefaultControllerCallback<O>;
    transform?: TransformStreamDefaultControllerTransformCallback<I, O>;
    flush?: TransformStreamDefaultControllerCallback<O>;
    readableType?: undefined;
    writableType?: undefined;
}

export declare class TransformStream<I = any, O = any> {
    constructor(transformer?: Transformer<I, O>, writableStrategy?: QueuingStrategy<I>, readableStrategy?: QueuingStrategy<O>);
    readonly readable: ReadableStream<O>;
    readonly writable: WritableStream<I>;
}

export declare type TransformStreamDefaultController<O> = TransformStreamDefaultController_2<O>;

declare class TransformStreamDefaultController_2<O> {
    readonly desiredSize: number | null;
    enqueue(chunk: O): void;
    error(reason: any): void;
    terminate(): void;
}

declare type TransformStreamDefaultControllerCallback<O> = (controller: TransformStreamDefaultController<O>) => void | PromiseLike<void>;

declare type TransformStreamDefaultControllerTransformCallback<I, O> = (chunk: I, controller: TransformStreamDefaultController<O>) => void | PromiseLike<void>;

export declare interface UnderlyingByteSource {
    start?: ReadableByteStreamControllerCallback;
    pull?: ReadableByteStreamControllerCallback;
    cancel?: ReadableStreamErrorCallback;
    type: 'bytes';
    autoAllocateChunkSize?: number;
}

export declare interface UnderlyingSink<W = any> {
    start?: WritableStreamDefaultControllerStartCallback;
    write?: WritableStreamDefaultControllerWriteCallback<W>;
    close?: WritableStreamDefaultControllerCloseCallback;
    abort?: WritableStreamErrorCallback;
    type?: undefined;
}

export declare interface UnderlyingSource<R = any> {
    start?: ReadableStreamDefaultControllerCallback<R>;
    pull?: ReadableStreamDefaultControllerCallback<R>;
    cancel?: ReadableStreamErrorCallback;
    type?: undefined;
}

export declare class WritableStream<W = any> {
    constructor(underlyingSink?: UnderlyingSink<W>, strategy?: QueuingStrategy<W>);
    readonly locked: boolean;
    abort(reason: any): Promise<void>;
    close(): Promise<void>;
    getWriter(): WritableStreamDefaultWriter_2<W>;
}

export declare type WritableStreamDefaultController = WritableStreamDefaultController_2<any>;

declare class WritableStreamDefaultController_2<W = any> {
    error(e: any): void;
}

declare type WritableStreamDefaultControllerCloseCallback = () => void | PromiseLike<void>;

declare type WritableStreamDefaultControllerStartCallback = (controller: WritableStreamDefaultController) => void | PromiseLike<void>;

declare type WritableStreamDefaultControllerWriteCallback<W> = (chunk: W, controller: WritableStreamDefaultController) => void | PromiseLike<void>;

export declare type WritableStreamDefaultWriter<W> = WritableStreamDefaultWriter_2<W>;

declare class WritableStreamDefaultWriter_2<W> {
    constructor(stream: WritableStream<W>);
    readonly closed: Promise<void>;
    readonly desiredSize: number | null;
    readonly ready: Promise<void>;
    abort(reason: any): Promise<void>;
    close(): Promise<void>;
    releaseLock(): void;
    write(chunk: W): Promise<void>;
}

declare type WritableStreamErrorCallback = (reason: any) => void | PromiseLike<void>;

export { }
