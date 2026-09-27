"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import facilpayIcon from "@/app/branding/logo/icon/facilpay-icon-black-128.png";
import { buildSep7PayUri, type Sep7Asset, type Sep7MemoType } from "@/lib/stellar/sep7";

export type Sep7PaymentQRProps = {
  destination: string;
  amount: string | number;
  asset?: Sep7Asset;
  memo?: string;
  memoType?: Sep7MemoType;
  message?: string;
  size?: number;
};

export function Sep7PaymentQR({
  destination,
  amount,
  asset = "native",
  memo,
  memoType,
  message,
  size = 240,
}: Sep7PaymentQRProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [notice, setNotice] = useState("");
  const uri = buildSep7PayUri({ destination, amount, asset, memo, memoType, message });

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "facilpay-payment-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    setNotice("QR code downloaded as PNG.");
  }

  async function copyUri() {
    try {
      await navigator.clipboard.writeText(uri);
      setNotice("SEP-7 payment URI copied.");
    } catch {
      setNotice("Clipboard access is unavailable in this browser.");
    }
  }

  return (
    <section className="sep7-qr" aria-label="Stellar payment QR code">
      <div className="sep7-qr-canvas">
        <QRCodeCanvas
          ref={canvasRef}
          value={uri}
          size={size}
          level="H"
          marginSize={4}
          bgColor="#ffffff"
          fgColor="#17231e"
          title="Scan to pay with a Stellar wallet"
          imageSettings={{
            src: facilpayIcon.src,
            width: Math.round(size * 0.18),
            height: Math.round(size * 0.18),
            excavate: true,
          }}
        />
      </div>
      <div className="sep7-qr-actions">
        <button type="button" onClick={downloadPng}><span aria-hidden="true">↓</span> Download PNG</button>
        <button type="button" onClick={copyUri}><span aria-hidden="true">⧉</span> Copy URI</button>
      </div>
      <details className="sep7-uri-details">
        <summary>View payment URI</summary>
        <code>{uri}</code>
      </details>
      <p className="sep7-qr-notice" role="status" aria-live="polite">{notice}</p>
    </section>
  );
}