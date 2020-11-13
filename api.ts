import { AuthConfiguration, authorize } from "react-native-app-auth";

const CLIENT_ID = 'f15e2ce763dcdc9';
const CLIENT_SECRET = '60348b972b7e1da72badef0f34e9369effe042fe';
const AUTHORIZATION_HEADER = `Authorization: ${CLIENT_ID} ${CLIENT_SECRET}`;

const URL_USER_AUTHORIZATION = `https://api.imgur.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token`;

// Will be received from authentication to Imgur
let accessToken;
let refreshToken;

export let hasTokensBeenRetrieved = false;


export const config: AuthConfiguration = {
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUrl: 'com.plumky.imurbrowser://callback',
  scopes: [],
  serviceConfiguration: {
    authorizationEndpoint: URL_USER_AUTHORIZATION,
    tokenEndpoint: 'https://api.imgur.com/oauth2/token',
  }
};

export const getTokens = (errorCallback: () => void) => {
    authorize(config).then((tokens: {accessToken: String, refreshToken: string}) => {
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
      hasTokensBeenRetrieved = true;
      // retrieve data from profile
    })
    .catch(error => errorCallback());
  }