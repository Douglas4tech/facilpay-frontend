/**
 * Fiat Price Feed and Conversion Service.
 * Provides fiat price estimates (USD / EUR) with graceful fallback when price is unavailable.
 */

export interface PriceEstimate {
  unitPrice: number | null;
  totalFiat: number | null;
  currency: 'USD' | 'EUR';
  formatted: string;
  isUnavailable: boolean;
}

// Configurable benchmark prices (updated with live fetch fallback)
export const DEFAULT_PRICE_FEEDS: Record<string, number> = {
  USDC: 1.0,
  XLM: 0.1285,
  EURC: 1.085,
  AQUA: 0.0052,
};

/**
 * Calculates the fiat estimate for an asset balance.
 * Returns formatted estimate or "Price unavailable" gracefully.
 */
export function getFiatEstimate(
  assetCode: string,
  amount: number,
  currency: 'USD' | 'EUR' = 'USD',
  customPriceFeeds = DEFAULT_PRICE_FEEDS
): PriceEstimate {
  const code = assetCode ? assetCode.toUpperCase() : '';
  const unitPrice = customPriceFeeds[code];

  if (unitPrice === undefined || isNaN(amount)) {
    return {
      unitPrice: null,
      totalFiat: null,
      currency,
      formatted: 'Price unavailable',
      isUnavailable: true,
    };
  }

  const totalFiat = amount * unitPrice;
  const symbol = currency === 'EUR' ? '€' : '$';

  return {
    unitPrice,
    totalFiat,
    currency,
    formatted: `${symbol}${totalFiat.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currency}`,
    isUnavailable: false,
  };
}

/**
 * Calculates total portfolio value in USD across all balances with available prices.
 */
export function calculateTotalPortfolioUsd(
  balances: { assetCode: string; totalBalance: number }[],
  priceFeeds = DEFAULT_PRICE_FEEDS
): { totalUsd: number; formatted: string; hasUnavailablePrices: boolean } {
  let totalUsd = 0;
  let hasUnavailablePrices = false;

  for (const b of balances) {
    const est = getFiatEstimate(b.assetCode, b.totalBalance, 'USD', priceFeeds);
    if (est.totalFiat !== null) {
      totalUsd += est.totalFiat;
    } else {
      hasUnavailablePrices = true;
    }
  }

  return {
    totalUsd,
    formatted: `$${totalUsd.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} USD`,
    hasUnavailablePrices,
  };
}
