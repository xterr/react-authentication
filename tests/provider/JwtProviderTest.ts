import { InMemoryCache, JwtAccessToken, JwtProvider, MissingRequiredOptionException, RefreshToken } from '../../src';

const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI3MTYyMzkwMjJ9.4OuEevcyvvb7vjx3lkkbdLrTYihFvSfVbzQls8_ff98';

describe('JwtProviderTest', () => {
  it('should perform login', async () => {
    const oProvider = new JwtProvider({
      cache: new InMemoryCache(),
    });

    await oProvider.login({
      accessToken: testToken,
      refreshToken: 'refreshToken',
    });

    expect(oProvider.isAuthenticated()).toBe(true);
    expect(oProvider.supportsRefresh()).toBe(true);
    expect(oProvider.getAccessToken()).toBeInstanceOf(JwtAccessToken);
    expect(oProvider.getAccessToken()?.getToken()).toBe(testToken);
    expect(oProvider.getRefreshToken()).toBeInstanceOf(RefreshToken);
    expect(oProvider.getRefreshToken()?.getToken()).toBe('refreshToken');
  });

  it('should perform logout', async () => {
    const oProvider = new JwtProvider({
      cache: new InMemoryCache(),
    });

    await oProvider.login({
      accessToken: testToken,
    });
    expect(oProvider.isAuthenticated()).toBe(true);

    await oProvider.logout();
    expect(oProvider.isAuthenticated()).toBe(false);
  });

  it('should throw exception if accessToken is missing on login', async () => {
    const oProvider = new JwtProvider({
      cache: new InMemoryCache(),
    });

    await expect(oProvider.login({} as any)).rejects.toThrow(new MissingRequiredOptionException('accessToken'));
  });

  it('should throw exception when cache is missing', async () => {
    await expect(new JwtProvider().initialize()).rejects.toThrow(new MissingRequiredOptionException('cache'));
  });
});
