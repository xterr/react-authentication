import { InMemoryProvider } from '../../src';

describe('InMemoryProviderTest', () => {
  it('should perform login', async () => {
    const oProvider = new InMemoryProvider();
    await oProvider.initialize();

    await oProvider.login();
    expect(oProvider.isAuthenticated()).toBe(true);
  });

  it('should perform logout', async () => {
    const oProvider = new InMemoryProvider();
    await oProvider.initialize();

    await oProvider.login();
    expect(oProvider.isAuthenticated()).toBe(true);

    await oProvider.logout();
    expect(oProvider.isAuthenticated()).toBe(false);
  });
});
