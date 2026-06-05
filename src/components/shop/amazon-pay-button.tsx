"use client";

import { useCallback, useRef } from "react";
import Script from "next/script";

export interface AmazonPayButtonConfig {
  merchantId: string;
  publicKeyId: string;
  ledgerCurrency: "USD" | "EUR";
  checkoutLanguage: "en_US" | "es_ES";
  sandbox: boolean;
  scriptSrc: string;
  /** Signed createCheckoutSession payload (public, static) generated server-side. */
  payloadJSON: string;
  signature: string;
}

declare global {
  interface Window {
    // Amazon Pay checkout.js global (untyped).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    amazon?: any;
  }
}

const BTN_ID = "AmazonPayButton";

/**
 * Renders the Amazon Pay button via checkout.js. Only PUBLIC values reach the
 * client (merchant/public key id + the static signed payload). The private key
 * stays server-side. Clicking the button sends the buyer to Amazon to sign in;
 * Amazon then redirects back to our checkoutReviewReturnUrl.
 */
export function AmazonPayButton({ config }: { config: AmazonPayButtonConfig }) {
  const rendered = useRef(false);

  const render = useCallback(() => {
    if (rendered.current) return;
    if (typeof window === "undefined" || !window.amazon?.Pay) return;
    rendered.current = true;
    window.amazon.Pay.renderButton(`#${BTN_ID}`, {
      merchantId: config.merchantId,
      publicKeyId: config.publicKeyId,
      ledgerCurrency: config.ledgerCurrency,
      checkoutLanguage: config.checkoutLanguage,
      productType: "PayAndShip",
      placement: "Checkout",
      buttonColor: "Gold",
      sandbox: config.sandbox,
      createCheckoutSessionConfig: {
        payloadJSON: config.payloadJSON,
        signature: config.signature,
        publicKeyId: config.publicKeyId,
      },
    });
  }, [config]);

  return (
    <div>
      <div id={BTN_ID} />
      <Script src={config.scriptSrc} strategy="afterInteractive" onReady={render} onLoad={render} />
    </div>
  );
}
