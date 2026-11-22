declare global {
  interface Window {
    Cashfree: any;
  }
}

interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  environment?: string; // "SANDBOX" or "PRODUCTION"
  redirectTarget?: '_modal' | '_self' | '_blank';
}

export const loadCashfreeSDK = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve(window.Cashfree);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => {
      if (window.Cashfree) {
        resolve(window.Cashfree);
      } else {
        reject(new Error('Cashfree SDK failed to initialize'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Cashfree checkout SDK. Please check your network connection.'));
    document.body.appendChild(script);
  });
};

/**
 * Triggers Cashfree checkout modal or seamless redirect
 */
export const openCashfreeCheckout = async ({
  paymentSessionId,
  environment = 'SANDBOX',
  redirectTarget = '_modal'
}: CashfreeCheckoutOptions): Promise<void> => {
  const Cashfree = await loadCashfreeSDK();
  const mode = environment.toUpperCase() === 'PRODUCTION' ? 'production' : 'sandbox';
  
  const cashfree = Cashfree({
    mode
  });

  return cashfree.checkout({
    paymentSessionId,
    redirectTarget
  });
};
