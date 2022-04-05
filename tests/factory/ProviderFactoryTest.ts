import { JwtProvider, ProviderFactory, ProviderNotSupportedException } from '../../src';

describe('ProviderFactoryTest', () => {
  it('should create a new Provider instance', () => {
    const oFactory = new ProviderFactory();
    expect(oFactory.create(JwtProvider)).toBeInstanceOf(JwtProvider);
  });

  it('should throw exception when provider is not supported', () => {
    const oFactory = new ProviderFactory();

    class TestClass {
    }

    expect(() => oFactory.create(TestClass as any))
      .toThrow(
        new ProviderNotSupportedException(
          `Provider "TestClass" is not supported. Supported providers are: ` +
          `OAuth2Provider, JwtProvider`,
        ),
      );
  });
});
