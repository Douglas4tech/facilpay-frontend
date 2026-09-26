import Link from "next/link";
import { Sep7PaymentQR } from "@/components/stellar/sep7-payment-qr";

const merchantAddress = "GBT5PBINLNRI5RJPJBOPSMODBGIHALJQJ2ISTANRF54BGM2WVIBECCNB";

export const metadata = {
  title: "Payment link ready | FacilPay",
};

export default function PaymentLinkSuccessPage() {
  return (
    <main className="stellar-page payment-link-success">
      <header className="stellar-header">
        <Link className="stellar-brand" href="/" aria-label="FacilPay home"><span>f</span> facilpay<span className="stellar-period">.</span></Link>
        <Link className="dashboard-link" href="/">Back to dashboard <span aria-hidden="true">↗</span></Link>
      </header>
      <section className="link-success-content">
        <div className="link-success-copy">
          <span className="success-mark" aria-hidden="true">✓</span>
          <span className="stellar-kicker">PAYMENT LINK CREATED</span>
          <h1>Your payment link is ready</h1>
          <p>Share this code with your customer. They can scan it with a Stellar mobile wallet to pay.</p>
          <div className="link-amount"><span>Requesting</span><strong>25.00 XLM</strong><small>Order INV-1042</small></div>
        </div>
        <div className="link-success-qr">
          <Sep7PaymentQR destination={merchantAddress} amount="25.00" asset="native" memo="INV-1042" memoType="text" message="Order 1042" size={268} />
        </div>
      </section>
      <footer className="stellar-footer">Payments powered by <b>facilpay.</b></footer>
    </main>
  );
}