import axios, { AxiosResponse } from 'axios';
import { AuthCredentials, AuthResponse } from './auth.types.js';

export async function getAuthToken(
  credentials: AuthCredentials,
): Promise<AuthResponse | null> {
  const data = new URLSearchParams();
  data.append('grant_type', credentials.grant_type);
  data.append('client_id', credentials.client_id);
  data.append('client_secret', credentials.client_secret);
  data.append('username', credentials.username);
  data.append('password', credentials.password);

  try {
    const response: AxiosResponse<AuthResponse> = await axios.post(
      'https://api-eu.dhl.com/post/de/shipping/im/v1/user',
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API-Fehler:', error.response?.data || error.message);
    } else {
      console.error('Ein unerwarteter Fehler ist aufgetreten:', error);
    }
    return null;
  }
}
