import { calculateXlmReserve, STELLAR_BASE_RESERVE } from '../lib/stellar/horizon';
import { getFiatEstimate, calculateTotalPortfolioUsd } from '../lib/stellar/prices';

describe('Multi-Asset Balances & Account Overview Specification', () => {
  describe('Stellar XLM Minimum Base Reserve Calculation', () => {
    test('calculates base reserve correctly for fresh account with 0 subentries', () => {
      const totalXlm = 100.0;
      const reserve = calculateXlmReserve(totalXlm, 0);

      // (2 base + 0 subentries) * 0.5 = 1.0 XLM reserve
      expect(reserve.baseReserve).toBe(0.5);
      expect(reserve.minReserve).toBe(1.0);
      expect(reserve.available).toBe(99.0);
    });

    test('calculates reserve correctly with active subentries (trustlines and signers)', () => {
      const totalXlm = 50.0;
      const subentries = 4; // e.g. 2 trustlines, 1 data entry, 1 additional signer
      const reserve = calculateXlmReserve(totalXlm, subentries);

      // (2 base + 4 subentries) * 0.5 = 3.0 XLM reserve
      expect(reserve.minReserve).toBe(3.0);
      expect(reserve.available).toBe(47.0);
      expect(reserve.formulaExplanation).toContain('4 subentries');
    });

    test('incorporates selling liabilities into minimum reserve', () => {
      const totalXlm = 100.0;
      const subentries = 2; // (2+2)*0.5 = 2.0
      const sellingLiabilities = 15.0; // active DEX sell offers
      const reserve = calculateXlmReserve(totalXlm, subentries, sellingLiabilities);

      expect(reserve.minReserve).toBe(17.0);
      expect(reserve.available).toBe(83.0);
    });

    test('prevents negative available balance if total is below minimum reserve', () => {
      const totalXlm = 0.8; // less than 1.0 base reserve
      const reserve = calculateXlmReserve(totalXlm, 0);

      expect(reserve.minReserve).toBe(1.0);
      expect(reserve.available).toBe(0);
    });
  });

  describe('Fiat Price Conversion & Graceful Fallback', () => {
    test('calculates accurate fiat estimates for supported assets', () => {
      const usdcEst = getFiatEstimate('USDC', 1250);
      expect(usdcEst.isUnavailable).toBe(false);
      expect(usdcEst.totalFiat).toBe(1250.0);
      expect(usdcEst.formatted).toContain('$1,250.00 USD');

      const xlmEst = getFiatEstimate('XLM', 10000);
      expect(xlmEst.isUnavailable).toBe(false);
      expect(xlmEst.totalFiat).toBeCloseTo(1285.0);
    });

    test('gracefully returns "Price unavailable" for unlisted/custom tokens', () => {
      const unknownEst = getFiatEstimate('UNKNOWN_COIN', 500);
      expect(unknownEst.isUnavailable).toBe(true);
      expect(unknownEst.unitPrice).toBeNull();
      expect(unknownEst.totalFiat).toBeNull();
      expect(unknownEst.formatted).toBe('Price unavailable');
    });

    test('computes total portfolio USD value across all assets with price available', () => {
      const holdings = [
        { assetCode: 'USDC', totalBalance: 1000 },
        { assetCode: 'EURC', totalBalance: 500 },
        { assetCode: 'MY_TOKEN', totalBalance: 9999 }, // unavailable price
      ];

      const portfolio = calculateTotalPortfolioUsd(holdings);
      expect(portfolio.totalUsd).toBeGreaterThan(1000);
      expect(portfolio.hasUnavailablePrices).toBe(true);
      expect(portfolio.formatted).toContain('$');
    });
  });
});
