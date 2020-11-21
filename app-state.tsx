import { BehaviorSubject } from 'rxjs';
import { AppStateType } from './types/appstate-type';

/**
 * A custom made state management because I couldn't make the React context API works properly, and Redux is overkill for an app of this size
 */
export class AppState {
  private static _instance: AppState;


  public state = new BehaviorSubject<AppStateType>({});

  /**
   * Set app state without erasing the previous values (values not available in the newState param)
   * */
  public setAppState = (newState: AppStateType) => {
    this.state.next({ ...this.state, ...newState });
  };

  private constructor() {}

  public static getInstance(): AppState {
    if (!AppState._instance) {
      AppState._instance = new AppState();
    }

    return AppState._instance;
  }
}
