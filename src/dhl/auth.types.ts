export interface AuthCredentials {
  grant_type: string;
  client_id: string;
  client_secret: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  walletBalance: number;
  infoMessage: string;
  token_type: string;
  expires_in: number;
  issued_at: string;
  external_customer_id: string;
  authenticated_user: string;
}
