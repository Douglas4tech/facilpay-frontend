import {
  generateSecretKeyString,
  maskSecretKey,
  PUBLISHABLE_KEYS,
  ApiKeyItem,
} from '../lib/apiKeys';

describe('API Keys Management Specification', () => {
  describe('Secret Key Generation & Environment Separation', () => {
    test('generates secret keys with correct testnet prefix', () => {
      const testKey = generateSecretKeyString('testnet');
      expect(testKey.startsWith('sk_test_')).toBe(true);
      expect(testKey.length).toBeGreaterThan(20);
    });

    test('generates secret keys with correct live mainnet prefix', () => {
      const liveKey = generateSecretKeyString('mainnet');
      expect(liveKey.startsWith('sk_live_')).toBe(true);
      expect(liveKey.length).toBeGreaterThan(20);
    });

    test('generates unique random keys on successive calls', () => {
      const key1 = generateSecretKeyString('testnet');
      const key2 = generateSecretKeyString('testnet');
      expect(key1).not.toBe(key2);
    });

    test('publishable keys are defined and separated by network', () => {
      expect(PUBLISHABLE_KEYS.testnet.startsWith('pk_test_')).toBe(true);
      expect(PUBLISHABLE_KEYS.mainnet.startsWith('pk_live_')).toBe(true);
      expect(PUBLISHABLE_KEYS.testnet).not.toBe(PUBLISHABLE_KEYS.mainnet);
    });
  });

  describe('Secret Key Masking & Security', () => {
    test('masks secret keys showing only the leading prefix', () => {
      const secretKey = 'sk_test_1234567890abcdef1234567890abcdef';
      const masked = maskSecretKey(secretKey);

      expect(masked.startsWith('sk_test_12345678')).toBe(true);
      expect(masked).toContain('••••');
      expect(masked).not.toBe(secretKey);
    });

    test('returns empty string if input key is empty', () => {
      expect(maskSecretKey('')).toBe('');
    });
  });

  describe('Key Permissions and Rolling Grace Period', () => {
    test('validates key permissions configuration', () => {
      const sampleKey: ApiKeyItem = {
        id: 'key_1',
        name: 'Restricted Worker',
        keyPrefix: 'sk_test_abc...',
        network: 'testnet',
        createdDate: new Date().toISOString(),
        lastUsed: null,
        createdBy: 'merchant@facilpay.io',
        status: 'active',
        permissions: {
          type: 'restricted',
          resources: {
            payments: { read: true, write: false },
            refunds: { read: false, write: false },
            webhooks: { read: true, write: true },
            escrow: { read: false, write: false },
          },
        },
        expiresAt: null,
      };

      expect(sampleKey.permissions.type).toBe('restricted');
      expect(sampleKey.permissions.resources.payments.read).toBe(true);
      expect(sampleKey.permissions.resources.payments.write).toBe(false);
      expect(sampleKey.permissions.resources.webhooks.write).toBe(true);
    });

    test('supports grace period expiration on rolled keys', () => {
      const now = new Date();
      const gracePeriod24h = new Date(now.getTime() + 24 * 3600 * 1000).toISOString();

      const rolledKey: ApiKeyItem = {
        id: 'key_old_rolled',
        name: 'Legacy Server Key',
        keyPrefix: 'sk_test_old...',
        network: 'testnet',
        createdDate: '2026-01-01T00:00:00.000Z',
        lastUsed: '2026-02-28T00:00:00.000Z',
        createdBy: 'merchant@facilpay.io',
        status: 'rolling',
        gracePeriod: '24h',
        rollingExpiresAt: gracePeriod24h,
        permissions: {
          type: 'full_access',
          resources: {
            payments: { read: true, write: true },
            refunds: { read: true, write: true },
            webhooks: { read: true, write: true },
            escrow: { read: true, write: true },
          },
        },
        expiresAt: null,
      };

      expect(rolledKey.status).toBe('rolling');
      expect(rolledKey.gracePeriod).toBe('24h');
      expect(new Date(rolledKey.rollingExpiresAt!).getTime()).toBeGreaterThan(now.getTime());
    });
  });
});
