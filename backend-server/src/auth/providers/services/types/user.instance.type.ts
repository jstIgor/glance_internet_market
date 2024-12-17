export type UserInstanceType = {
  id: string;
  email: string;
  name: string;
  picture: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  
  provider: string;
}