import { JwtAccessToken } from '../../src';

describe('JwtAccessTokenTest', () => {
  it('should return validity state', () => {
    const oToken = new JwtAccessToken('token');
    expect(oToken.isValid()).toBe(false);
  });

  it('should return expiry state', () => {
    const oToken = new JwtAccessToken('token');
    expect(oToken.isExpired()).toBe(true);
  });
});
