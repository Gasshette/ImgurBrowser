export class AuthenticationResponse {
  accessToken: string;
  refreshToken: string;
  tokenAdditionalParameters: {
    account_id: string,
    account_username: string,
  }
}