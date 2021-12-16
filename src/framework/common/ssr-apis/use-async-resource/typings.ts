
export type FetchCallback<T> = () => T | Promise<T>;

export type StatusObject<T> = {
  loading: boolean,
  value: T | undefined,
  error: any,
};

export type ResourceLoader<T> = {
  load: FetchCallback<T>,
  status?: StatusObject<T>,
};
