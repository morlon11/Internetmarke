/**
 * @file dhl.types.ts
 * @description Contains the necessary types for the DHL API services.
 */

export type Address = {
  additionalName?: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  country: string;
};

export type ShoppingCartPosition = {
  productCode: number;
  address: {
    sender: Address;
    receiver: Address;
  };
  voucherLayout: string;
  position: {
    labelX: number;
    labelY: number;
    page: number;
  };
  positionType: string;
};

export type AppShoppingCartPDFRequest = {
  type: string;
  shopOrderId: string;
  pageFormatId: number;
  positions: ShoppingCartPosition[];
  total: number;
  createManifest: boolean;
  createShippingList: string;
  dpi: string;
};

export type CheckoutShoppingCartAppResponse = {
  type: string;
  link: string;
  manifestLink: string | null;
  shoppingCart: {
    shopOrderId: string;
    voucherList: {
      voucherId: string;
      trackId: string | null;
    }[];
  };
  walletBallance: number;
};
