export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>;
  recover(key: string): Promise<any | null>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}
