import { AppState } from './app-state';
import { AuthConfiguration, authorize } from 'react-native-app-auth';
import { ImgurImage } from './models/image';

/**
 * Singleton source: https://refactoring.guru/fr/design-patterns/singleton/typescript/example
 */
export class Api {
  private appState = AppState.getInstance();

  private static _instance: Api;

  private _accessToken: string;
  private _refreshToken: string;

  set accessToken(value: string) {
    this._accessToken = value;
  }

  set refreshToken(value: string) {
    this._refreshToken = value;
  }

  public username: string;
  private CLIENT_ID = 'f15e2ce763dcdc9';
  private CLIENT_SECRET = '60348b972b7e1da72badef0f34e9369effe042fe';
  private URL_USER_AUTHORIZATION = `https://api.imgur.com/oauth2/authorize?client_id=${this.CLIENT_ID}&response_type=token`;

  private config: AuthConfiguration = {
    clientId: this.CLIENT_ID,
    clientSecret: this.CLIENT_SECRET,
    redirectUrl: 'com.plumky.imurbrowser://callback',
    scopes: [],

    serviceConfiguration: {
      authorizationEndpoint: this.URL_USER_AUTHORIZATION,
      tokenEndpoint: 'https://api.imgur.com/oauth2/token',
    },
  };

  private readonly mockUrl = 'http://localhost:8081/mocks/';

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {}

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): Api {
    if (!Api._instance) {
      Api._instance = new Api();
    }

    return Api._instance;
  }

  private getHeader = (method: string) => {
    const requestInit: RequestInit = {
      headers: {
        mode: 'cors',
        method,
        authorization: `Bearer ${this._accessToken}`,
      },
    };

    return requestInit;
  };

  public getTokens = () => {
    return authorize(this.config);
  };

  // If true, retrieve mock, else retrieve real data from ImgurAPI
  public getPosts = () => {
    const url = true
      ? `${this.mockUrl}posts.json`
      : `https://api.imgur.com/3/account/${this.username}/images`;

    fetch(url, this.getHeader('GET'))
      .then((res: Response) => res.json())
      .then((json: { data: Array<ImgurImage> }) => {
        this.appState.setAppState({
          posts: json.data,
        });
      })
      .catch((error) => console.log('Error while retrieving posts'));
  };

  public getFavorites = () => {
    const url = true
      ? `${this.mockUrl}favorites.json`
      : `https://api.imgur.com/3/account/${this.username}/gallery_favorites`;

    return fetch(url, this.getHeader('GET'))
    .then((res: Response) => res.json())
      .then((json: { data: Array<ImgurImage> }) => {
        this.appState.setAppState({
          posts: json.data,
        });
      })
      .catch((error) => console.log('Error while retrieving favs'));
  };

  public toggleFavorite = (id: string) => {
    return fetch(
      `https://api.imgur.com/3/image/${id}/favorite`,
      this.getHeader('POST')
    );
  };
}
