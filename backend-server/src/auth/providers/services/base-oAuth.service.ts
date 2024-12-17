import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { BaseProviderType } from "./types/base-provider.type";
import { UserInstanceType } from "./types/user.instance.type";
@Injectable()
export class baseOauthService {
  private BASE_URL: string
  constructor(private readonly options: BaseProviderType) {
  }

  protected extractUserInfo(data: any) {
    return {
      ...data,
      provider: this.options.name
    }
  }

  public getAuthURL() {
    const query = new URLSearchParams({
      response_type: 'code',
      client_id: this.options.client_id,
      redirect_uri: this.getRedirectURL(),
      scope: this.scopes?.join(' ') || '[]',
      access_type: 'offline',
      prompt: 'consent'
    })
    return `${this.options.auth_url}?${query.toString()}`
  }

  public async findUserByCode(): Promise<UserInstanceType> {
    const client_id = this.options.client_id
    const client_secret = this.options.client_secret

    const tokenQuery = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: this.getRedirectURL()
    })
    const tokenRequest = await fetch(this.options.access_url, {
      method: 'POST',
      body: tokenQuery.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    })
    const tokenResponse = await tokenRequest.json()
    if (!tokenResponse.ok) throw new HttpException('Failed to get access token', HttpStatus.BAD_REQUEST);
    if (!tokenResponse.access_token) throw new HttpException('Failed to get access token', HttpStatus.BAD_REQUEST);
    const userReq = await fetch(this.options.profile_url, {
      headers: {
        'Authorization': `Bearer ${tokenResponse.access_token}`
      }
    })
    if (!userReq.ok) throw new HttpException('Проверьте правильность токена', HttpStatus.UNAUTHORIZED);
    const user = await userReq.json()
    const userData = this.extractUserInfo(user) // added provider name
    return {
      ...userData,
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      expires_in: tokenResponse.expires_in || tokenResponse.expires_at,
    } as UserInstanceType
  }
  public getRedirectURL() {
  return `${this.baseURL}/auth/oauth/callback/${this.options.name}`
}

  private get baseURL() { return this.options.auth_url }
  private set baseURL(url: string) { this.options.auth_url = url }
  private get accessURL() { return this.options.access_url }
  private get profileURL() { return this.options.profile_url }
  private get scopes() { return this.options.scopes }
}