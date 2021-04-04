// Get promises resolved type
type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

// Get the inner type
type GetInnerType<S> = S extends SomeInterface<infer T> ? T : never;
