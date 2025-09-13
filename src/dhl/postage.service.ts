import axios, { AxiosResponse, AxiosError } from 'axios'; // AxiosError importieren
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
 * Create shipping label with Deutsche Post Internetmarke API
 *
 * @param {AppShoppingCartPDFRequest} requestData - data for shipping label
 * @returns {Promise<string | null>} - download link for the created label
 */
export async function createShippingLabel(
  receiverAddress: Address,
  orderid: string,
): Promise<{ success: true; data: string } | { success: false; data: any }> {
  const token = await getAuthToken();
  if (!token) {
    const errorMsg = 'Authentication token could not be retrieved:';
    console.error(errorMsg);
    return { success: false, data: errorMsg };
  }

  const requestData: AppShoppingCartPDFRequest = {
    type: 'AppShoppingCartPDFRequest',
    shopOrderId: orderid,
    pageFormatId: 13,
    positions: [
      {
        productCode: 290, // product code for warensendung
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
    return response.data.link
      ? { success: true, data: response.data.link }
      : { success: false, data: response };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      // Check if the error is that for THIS order id a label was already created
      if (
        axiosError.response &&
        axiosError.response.status === 400 &&
        axiosError.response.data &&
        (axiosError.response.data as any).message ===
          'Request failed with status code 400'
      ) {
        console.error(
          `Fehler: Die Shop-Bestellnummer "${orderid}" wurde bereits verwendet. Bitte eine neue Nummer angeben.`,
          axiosError.response.data,
        );
        return {
          success: false,
          data: `Fehler: Die Shop-Bestellnummer "${orderid}" wurde bereits verwendet. Bitte eine neue Nummer angeben.`,
        };
      } else {
        // other axios errors
        console.error(
          'API error while creating shipping label:',
          axiosError.response?.data || axiosError.message,
        );
        return {
          success: false,
          data: axiosError.response?.data || axiosError.message,
        };
      }
    } else {
      // other errors
      console.error('An unexpected error occurred:', error);
      return {
        success: false,
        data: 'An unexpected error occurred: ' + JSON.stringify(error),
      };
    }
  }
}
