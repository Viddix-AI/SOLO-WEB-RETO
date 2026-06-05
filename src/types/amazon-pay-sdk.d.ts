/** Minimal ambient types for the untyped @amazonpay/amazon-pay-api-sdk-nodejs. */
declare module "@amazonpay/amazon-pay-api-sdk-nodejs" {
  interface AmazonPayConfig {
    publicKeyId: string;
    privateKey: string | Buffer;
    region: string;
    sandbox?: boolean;
    algorithm?: string;
  }

  interface ApiResponse {
    status: number;
    // The SDK is plain JS; response bodies are dynamic Amazon Pay objects.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    headers?: Record<string, string>;
  }

  export class AmazonPayClient {
    constructor(config: AmazonPayConfig);
    generateButtonSignature(payload: object | string): string;
  }

  export class WebStoreClient extends AmazonPayClient {
    createCheckoutSession(payload: object, headers?: object): Promise<ApiResponse>;
    getCheckoutSession(checkoutSessionId: string, headers?: object | null): Promise<ApiResponse>;
    updateCheckoutSession(checkoutSessionId: string, payload: object, headers?: object | null): Promise<ApiResponse>;
    completeCheckoutSession(checkoutSessionId: string, payload: object, headers?: object | null): Promise<ApiResponse>;
    getCharge(chargeId: string, headers?: object | null): Promise<ApiResponse>;
    captureCharge(chargeId: string, payload: object, headers?: object | null): Promise<ApiResponse>;
  }

  export class InStoreClient extends AmazonPayClient {}
}
