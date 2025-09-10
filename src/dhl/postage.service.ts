/**
 * @file postage.service.ts
 * @description A service for purchasing a "Warensendung" label via the Deutsche Post API.
 */

import axios, { AxiosResponse } from 'axios';
import { getAuthToken } from './auth.service.js';
import { AuthCredentials } from './auth.types.js';
import {
  WarensendungRequest,
  LabelRequest,
  LabelResponse,
  ShipmentAddress,
} from './types.js';

/**
 * Buys a postage label for a goods shipment ("Warensendung").
 *
 * @param {WarensendungRequest} request - The request data for the shipment, including sender, recipient, and weight.
 * @returns {Promise<string | null>} The Base64-encoded PDF file of the label on success, otherwise null.
 */
export async function buyPostageLabel(
  request: WarensendungRequest,
): Promise<string | null> {
  // 1. Validate input data
  if (!validateRequest(request)) {
    return null;
  }

  // 2. Retrieve token using the existing authentication service
  const token = await getAuthToken();
  if (!token) {
    console.error('Authentication token could not be retrieved.');
    return null;
  }

  // 3. Purchase the label
  try {
    const apiRequest: LabelRequest = {
      shipment: {
        product: 'WARENSENDUNG',
        sender: request.sender,
        recipient: request.recipient,
        weight: {
          value: request.weight,
          unit: 'g',
        },
      },
    };

    const response: AxiosResponse<LabelResponse> = await axios.post(
      'https://api-eu.dhl.com/post/de/shipping/im/v1/labels', // Endpoint for purchasing labels
      apiRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    return response.data.shipment.label.file;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'API error while purchasing the label:',
        error.response?.data || error.message,
      );
    } else {
      console.error('An unexpected error occurred:', error);
    }
    return null;
  }
}

function validateRequest(request: WarensendungRequest): boolean {
  if (
    !request.sender ||
    !request.recipient ||
    request.weight === undefined ||
    request.weight > 1000 ||
    request.weight <= 0
  ) {
    console.error('Error: Invalid shipment data or weight exceeds 1000 grams.');
    return false;
  }

  const requiredFields: (keyof ShipmentAddress)[] = [
    'name1',
    'street',
    'housenumber',
    'zip',
    'city',
    'country',
  ];

  if (
    !validateAddress(request.sender, 'Absender', requiredFields) ||
    !validateAddress(request.recipient, 'Empfänger', requiredFields)
  ) {
    return false;
  }

  return true;
}

function validateAddress(
  address: ShipmentAddress,
  type: string,
  fields: (keyof ShipmentAddress)[],
): boolean {
  for (const field of fields) {
    if (!address[field]) {
      console.error(`Error: The '${field}' field of the ${type} is mandatory.`);
      return false;
    }
  }
  return true;
}
