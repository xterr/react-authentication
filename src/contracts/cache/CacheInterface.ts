export default interface CacheInterface {
  get<T> (key: string, defaultValue?: any): Promise<T | null>;

  set (key: string, value: any): Promise<void>;

  remove (key: string): Promise<void>;

  reset (): Promise<void>;

  allKeys (): Promise<string[]>;
}
