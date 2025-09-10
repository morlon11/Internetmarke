/**
 * @file dhl.types.ts
 * @description Contains the necessary types for the DHL API services.
 */

export type ShipmentAddress = {
  name1: string;
  name2?: string;
  street: string;
  housenumber: string;
  zip: string;
  city: string;
  country: string;
};

export type WarensendungRequest = {
  sender: ShipmentAddress;
  recipient: ShipmentAddress;
  weight: number; // In grams
};

export type LabelRequest = {
  shipment: {
    product: string; // e.g., "Warensendung"
    sender: ShipmentAddress;
    recipient: ShipmentAddress;
    weight: {
      value: number;
      unit: string;
    };
  };
};

export type LabelResponse = {
  shipment: {
    label: {
      file: string; // Base64-encoded PDF file
    };
  };
};
