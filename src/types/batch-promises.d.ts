declare module 'batch-promises' {
  function batchPromises<T, R>(
    batchSize: number,
    array: T[],
    fn: (item: T) => Promise<R>
  ): Promise<R[]>;
  export default batchPromises;
}
