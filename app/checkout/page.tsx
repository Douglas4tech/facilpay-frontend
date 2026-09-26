import Link from "next/link";
import { Sep7PaymentQR } from "@/components/stellar/sep7-payment-qr";

const merchantAddress = "GBT5PBINLNRI5RJPJBOPSMODBGIHALJQJ2ISTANRF54BGM2WVIBECCNB";

export const metadata = {
  title: "Checkout | FacilPay",
};

export default function HostedCheckoutPage() {
  return (
    <main className="stellar-page">
      <header className="stellar-header">
        <Link className="stellar-brand" href="/" aria-label="FacilPay home"><span>f</span> facilpay<span className="stellar-period">.</span></Link>
        <span className="stellar-secure"><i /> SECURE CHECKOUT</span>
      </header>
      <div className="checkout-layout">
        <section className="checkout-order">
          <span className="stellar-kicker">NORTHSTAR GOODS</span>
          <h1>Complete your payment</h1>
          <p className="stellar-subtitle">Scan with a Stellar wallet to pay securely.</p>
          <div className="checkout-total"><span>Order total</span><strong>25.00 <small>XLM</small></strong></div>
          <div className="checkout-reference"><span>Order</span><b>INV-1042</b></div>
          <div className="checkout-reference"><span>Pay to</span><b>Northstar Goods</b></div>
          <div className="checkout-divider" />
          <p className="checkout-footnote">Your wallet will show the recipient and amount before you confirm.</p>
        </section>
        <section className="checkout-scan">
          <div className="scan-heading"><span>PAY WITH WALLET</span><h2>Scan to pay</h2><p>Open a Stellar wallet on your phone and scan this code.</p></div>
          <Sep7PaymentQR destination={merchantAddress} amount="25.00" asset="native" memo="INV-1042" memoType="text" message="Order 1042" size={252} />
          <div className="network-label"><i /> Stellar network</div>
        </section>
      </div>
      <footer className="stellar-footer">Payments powered by <b>facilpay.</b></footer>
    </main>
  );
}