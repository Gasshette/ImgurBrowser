import { ImgurImage } from "./models/image";
import {BehaviorSubject} from 'rxjs';


export type SnackbarParams = {
    color: string;
    message: string;
    isVisible: boolean;
}

export type Filters = {
  title?: string;
  tag?: string;
}

export type AppStateType = {
  username?: string;
  isTokenRetrieved?: boolean;
  posts?: Array<ImgurImage>;
  favorites?: Array<ImgurImage>;
  snackbar?: SnackbarParams;
  filters?: Filters;
}

export class AppState {
  private static _instance: AppState;
  public state = new BehaviorSubject<AppStateType>({});

  /**
   * Set app state without erasing the previous values (values not available in the newState param)
   * */
  public setAppState = (newState: AppStateType) => {
    this.state.next({...this.state, ...newState});
  }

  private constructor() {}

  public static getInstance(): AppState {
    if (!AppState._instance) {
      AppState._instance = new AppState();
    }

    return AppState._instance;
  }
}
