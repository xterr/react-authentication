import { JwtAccessToken, JwtAccessTokenFactory, JwtDecodeFailureException } from '../../src';

describe('JwtAccessTokenFactoryTest', () => {
  it('should create a new JwtAccessToken instance', () => {
    const oFactory = new JwtAccessTokenFactory();
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI3MTYyMzkwMjJ9.4OuEevcyvvb7vjx3lkkbdLrTYihFvSfVbzQls8_ff98';
    expect(oFactory.create(testToken)).toBeInstanceOf(JwtAccessToken);
  });

  it('should throw exception when token is invalid', () => {
    const oFactory = new JwtAccessTokenFactory();
    expect(() => oFactory.create(''))
      .toThrow(new JwtDecodeFailureException(JwtDecodeFailureException.INVALID_TOKEN, 'Invalid token specified: Unexpected end of JSON input', ''));
  });
});
