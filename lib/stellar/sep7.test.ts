import { describe, expect, it } from "vitest";
import { buildSep7PayUri } from "./sep7";

const destination = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

describe("buildSep7PayUri", () => {
  it("builds a native XLM payment URI without asset parameters", () => {
    expect(buildSep7PayUri({ destination, amount: "25.00" })).toBe(
      `web+stellar:pay?destination=${destination}&amount=25.00`,
    );
  });

  it("includes the code and issuer for an issued asset", () => {
    expect(buildSep7PayUri({
      destination,
      amount: 25,
      asset: { code: "USDC", issuer: "GISSUER" },
    })).toBe(
      `web+stellar:pay?destination=${destination}&amount=25&asset_code=USDC&asset_issuer=GISSUER`,
    );
  });

  it("expands small numeric amounts to decimal notation", () => {
    expect(buildSep7PayUri({ destination, amount: 0.0000001 })).toBe(
      `web+stellar:pay?destination=${destination}&amount=0.0000001`,
    );
  });

  it.each([
    ["text", "MEMO_TEXT"],
    ["id", "MEMO_ID"],
    ["hash", "MEMO_HASH"],
  ] as const)("encodes %s memo type as %s", (memoType, expectedType) => {
    expect(buildSep7PayUri({ destination, amount: "1", memo: "INV-1042", memoType })).toBe(
      `web+stellar:pay?destination=${destination}&amount=1&memo=INV-1042&memo_type=${expectedType}`,
    );
  });

  it("percent-encodes reserved characters in memo and message values", () => {
    expect(buildSep7PayUri({
      destination,
      amount: "25.00",
      asset: { code: "USD & EUR", issuer: "G/issuer?x=1" },
      memo: "INV #1042 + 1",
      message: "Order 1042 & ship/now!",
    })).toBe(
      `web+stellar:pay?destination=${destination}&amount=25.00&asset_code=USD%20%26%20EUR&asset_issuer=G%2Fissuer%3Fx%3D1&memo=INV%20%231042%20%2B%201&memo_type=MEMO_TEXT&msg=Order%201042%20%26%20ship%2Fnow%21`,
    );
  });

  it("rejects invalid amounts and missing issued asset details", () => {
    expect(() => buildSep7PayUri({ destination, amount: "0" })).toThrow("positive decimal");
    expect(() => buildSep7PayUri({ destination, amount: "1e3" })).toThrow("positive decimal");
    expect(() => buildSep7PayUri({ destination, amount: "1", asset: { code: "USDC", issuer: " " } })).toThrow("asset code and issuer");
  });
});