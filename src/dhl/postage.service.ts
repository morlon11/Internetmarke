import axios, { AxiosResponse } from 'axios';
import { getAuthToken } from './auth.service.js';
import {
  AppShoppingCartPDFRequest,
  CheckoutShoppingCartAppResponse,
  Address,
} from './types.js';

const SENDER_ADDRESS: Address = {
  name: 'PETEX Autoausstattungs-GmbH',
  addressLine1: 'Mitterhof',
  postalCode: '84307',
  city: 'Eggenfelden',
  country: 'DEU',
};

/**
 * Erstellt ein Versandetikett über die neue Deutsche Post API.
 *
 * @param {AppShoppingCartPDFRequest} requestData - Die Daten für die PDF-Anfrage.
 * @returns {Promise<string | null>} Der Link zum herunterladbaren Etikett auf Erfolg, sonst null.
 */
export async function createShippingLabel(
  receiverAddress: Address,
  orderid: string,
): Promise<string | null> {
  const token = await getAuthToken();
  if (!token) {
    console.error('Authentication token could not be retrieved.');
    return null;
  }

  const requestData: AppShoppingCartPDFRequest = {
    type: 'AppShoppingCartPDFRequest',
    shopOrderId: orderid,
    pageFormatId: 13,
    positions: [
      {
        productCode: 290, // Produktcode für Warensendung
        address: {
          sender: SENDER_ADDRESS,
          receiver: receiverAddress,
        },
        voucherLayout: 'ADDRESS_ZONE',
        position: { labelX: 1, labelY: 1, page: 1 },
        positionType: 'AppShoppingCartPDFPosition',
      },
    ],
    total: 270,
    createManifest: true,
    createShippingList: '2',
    dpi: 'DPI300',
  };

  try {
    console.log('Request Data:', JSON.stringify(requestData, null, 2));
    const response: AxiosResponse<CheckoutShoppingCartAppResponse> =
      await axios.post(
        'https://api-eu.dhl.com/post/de/shipping/im/v1/app/shoppingcart/pdf',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
    return response.data.link;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'API error while creating shipping label:',
        error.response?.data || error.message,
      );
    } else {
      console.error('An unexpected error occurred:', error);
    }
    return null;
  }
}
