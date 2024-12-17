export interface BaseProviderConfig {
  client_id: string;
  client_secret: string;
  scopes: string[];
  redirect_uri?: string;
}

export interface BaseProviderType {
  getAuthUrl(): string;
  getTokenFromCode(code: string): Promise<any>;
  getUserData(token: string): Promise<any>;
}