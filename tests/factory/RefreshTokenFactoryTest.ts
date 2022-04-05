import { RefreshToken, RefreshTokenFactory } from '../../src';

describe('RefreshTokenFactoryTest', () => {
  it('should create a new RefreshToken instance', () => {
    const oFactory = new RefreshTokenFactory();
    const testToken = 'refresh_token';
    expect(oFactory.create(testToken)).toBeInstanceOf(RefreshToken);
  });
});
