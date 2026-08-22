const { hashPassword, verifyPassword, signToken, verifyToken } = require('../src/services/authService');

describe('authService', () => {
  test('hashPassword produces a hash different from the original password', async () => {
    const hash = await hashPassword('mySecretPassword123');
    expect(hash).not.toBe('mySecretPassword123');
    expect(hash.length).toBeGreaterThan(20);
  });

  test('verifyPassword returns true for the correct password', async () => {
    const hash = await hashPassword('correct-password');
    const isValid = await verifyPassword('correct-password', hash);
    expect(isValid).toBe(true);
  });

  test('verifyPassword returns false for the wrong password', async () => {
    const hash = await hashPassword('correct-password');
    const isValid = await verifyPassword('wrong-password', hash);
    expect(isValid).toBe(false);
  });

  test('signToken produces a token that verifyToken can decode back', () => {
    const user = { id: 1, email: 'jane@example.com' };
    const token = signToken(user);
    const decoded = verifyToken(token);
    expect(decoded.id).toBe(1);
    expect(decoded.email).toBe('jane@example.com');
  });

  test('verifyToken throws on a malformed token', () => {
    expect(() => verifyToken('not-a-real-token')).toThrow();
  });
});
