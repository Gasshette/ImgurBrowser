import { SnackbarParams } from './types/snackbar-params';
import { AppStateType } from './types/appstate-type';
import { AppState } from './app-state';
import { AuthConfiguration, authorize } from 'react-native-app-auth';
import { ImgurImage } from './models/image';
import { colors } from './App';
import * as _ from 'lodash';

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

  private getHeader = (
    method: string,
    body?: any
  ) => {
    const authorization = true
      ? `Bearer ${this._accessToken}`
      : `Client_ID ${this.CLIENT_ID}`;

    const requestInit: RequestInit = {
      body,
      method,
      headers: {
        mode: 'cors',
        authorization,
      },
    };

    return requestInit;
  };

  public getTokens = () => {
    return authorize(this.config);
  };

  private async addImagesInAlbums(
    data: Array<ImgurImage>
  ): Promise<Array<ImgurImage>> {
    let newState: Array<ImgurImage> = _.cloneDeep(data);
    data.forEach(async (post: ImgurImage, i: number) => {
      try {
        if (post.is_album) {
          const dataImages = await this.getAlbumImages(post.id);
          newState[i].images = dataImages;
        } else {
          newState[i].images = [post];
        }
      } catch (error) {
        console.error('Error while settings images to album: ', post.images);
      }
    });

    return newState;
  }

  private getAlbumImages = async (albumHash: string) => {
    try {
      let data = await fetch(
        `https://api.imgur.com/3/album/${albumHash}/images`,
        this.getHeader('GET')
      );

      let json = await data.json();

      return json.data;
    } catch (error) {
      console.error('Error getting images from album: ', error);
    }
  };

  public reloadData(route: string) {
    switch (route.toLowerCase()) {
      case 'favorites':
        this.getFavorites(true);
        break;
      case 'mycontent':
        this.getMyContent(true);
        break;
      case 'gallery':
        this.getGallery(true);
        break;
    }
  }

  public getGallery = (isSync: boolean = false) => {
    // Images from anyone, filtered to only get images
    const queryParams = new URLSearchParams();
    if (this.appState.state.value.galleryFilters !== undefined) {
      let all = this.appState.state.value.galleryFilters.all;
      let tags = this.appState.state.value.galleryFilters.tags;
      let type = this.appState.state.value.galleryFilters.type;

      all && queryParams.append('q_all', all);
      tags && queryParams.append('q_tags', tags);
      type && queryParams.append('q_type', type);

    }
      const url = `https://api.imgur.com/3/gallery/search?${queryParams.toString()}`;
      this.getPosts(isSync, url);
  };

  public getMyContent = (isSync: boolean = false) => {
    // Image from logged user account
    const url = `https://api.imgur.com/3/account/${this.username}/images`;
    this.getPosts(isSync, url);
  };

  public getFavorites = (isSync: boolean = false) => {
    const url = `https://api.imgur.com/3/account/${this.username}/gallery_favorites`;
    this.getPosts(isSync, url);
  };

  private getPosts = (
    isSync: boolean = false,
    url: string
  ) => {
    if (false) {
      const newState = require('./mocks/posts.json');
      this.appState.setAppState(newState);
    } else {
      fetch(url, this.getHeader('GET'))
        .then((res: Response) => res.json())
        .then(async (json: { data: Array<ImgurImage> }) => {
          let newState: AppStateType = { posts: json.data };
          newState.posts = await this.addImagesInAlbums(json.data);

          if (isSync) {
            newState.snackbar = {
              color: colors.lemonGreen,
              message: 'Data successfuly synchronized ! :D',
            } as SnackbarParams;
          }

          this.appState.setAppState(newState);
        })
        .catch((error) => {
          console.error(
            'Something went wrong while loading the new data :( - ',
            error.message
          );
          this.appState.setAppState({
            snackbar: {
              color: colors.warn,
              message: 'Something went wrong while loading the new data :(',
            } as SnackbarParams,
          });
        });
    }
  };

  public postImage = (body: FormData) => {
    let header = this.getHeader('POST', body);

    return fetch('https://api.imgur.com/3/image', header)
      .then((response) => response.json())
      .then((json: { data: ImgurImage }) => {
        if (json.data.error) {
          this.appState.setAppState({
            snackbar: {
              color: colors.warn,
              message: `Error: ${json.data.error.message}`,
            } as SnackbarParams,
          });
        } else {
          // Add the image in our state so it appear in the home page without having to reload the content
          const storedPosts = _.cloneDeep(this.appState.state.value.posts);
          storedPosts?.push(json.data);

          this.appState.setAppState({
            posts: storedPosts,
            snackbar: {
              color: colors.lemonGreen,
              message: 'Image successfully sent :D',
            } as SnackbarParams,
          });
        }
      })
      .catch((error) => {
        console.error(
          'Something went wrong while sending your image :( - ',
          error.message
        );
        this.appState.setAppState({
          snackbar: {
            color: colors.warn,
            message: 'Something went wrong while sending your image :(',
          } as SnackbarParams,
        });
      });
  };

  public toggleFavorite = (id: string) => {
    return fetch(
      `https://api.imgur.com/3/album/${id}/favorite`,
      this.getHeader('POST')
    );
  };

  public deleteOwnContent = (imageHash: string) => {
    return fetch(
      `https://api.imgur.com/3/image/${imageHash}`,
      this.getHeader('DELETE')
    );
  };
}
