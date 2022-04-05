import { CacheFactory, CacheNotSupportedException, InMemoryCache } from '../../src';

describe('CacheFactoryTest', () => {
  it('should create a new Cache instance', () => {
    const oFactory = new CacheFactory();
    expect(oFactory.create(InMemoryCache)).toBeInstanceOf(InMemoryCache);
  });

  it('should throw exception when cache is not supported', () => {
    const oFactory = new CacheFactory();

    class TestClass {
    }

    expect(() => oFactory.create(TestClass as any))
      .toThrow(
        new CacheNotSupportedException(
          `Cache "TestClass" is not supported. Supported cache types are:` +
          `InMemoryCache, LocalStorageCache`,
        ),
      );
  });
});
