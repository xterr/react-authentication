import { InMemoryCache } from '../../src';

describe('InMemoryCacheTest', () => {
  it('should set key into cache', async () => {
    const oCache = new InMemoryCache();
    await oCache.set('key', 'value');

    expect(oCache[ '_entries' ]).toEqual({ '@@auth_key': 'value' });
  });

  it('should get key from cache', async () => {
    const oCache = new InMemoryCache();
    await oCache.set('key', 'value');

    expect(await oCache.get('key')).toEqual('value');
  });

  it('should return null in case key is not found', async () => {
    const oCache = new InMemoryCache();

    expect(await oCache.get('key')).toBeNull();
  });

  it('should return specified default value in case key is not found', async () => {
    const oCache = new InMemoryCache();

    expect(await oCache.get('key', 'defaultValue')).toBe('defaultValue');
  });

  it('should return all known keys', async () => {
    const oCache = new InMemoryCache();

    await oCache.set('key', 'value');
    expect(await oCache.allKeys()).toEqual([ 'key' ]);
  });

  it('should remove a key from cache', async () => {
    const oCache = new InMemoryCache();
    await oCache.set('key', 'value');

    expect(await oCache.get('key')).toEqual('value');

    await oCache.remove('key');
    expect(await oCache.get('key')).toBeNull();
  });

  it('should reset the cache', async () => {
    const oCache = new InMemoryCache();
    await oCache.set('key', 'value');
    await oCache.set('key2', 'value');

    expect(await oCache.get('key')).toEqual('value');
    expect(await oCache.get('key2')).toEqual('value');

    await oCache.reset();
    expect(await oCache.get('key')).toBeNull();
    expect(await oCache.get('key2')).toBeNull();
  });

  it('should respect the prefix option', async () => {
    const oCache = new InMemoryCache({ prefix: '__prefix__' });
    await oCache.set('key', 'value');

    expect(oCache[ '_entries' ]).toEqual({ '__prefix__key': 'value' });
  });
});
