import { ImgurImage } from "../models/image";
import { Filters } from "./filters";
import { SnackbarParams } from "./snackbar-params";

export type AppStateType = {
  username?: string;
  isTokenRetrieved?: boolean;
  posts?: Array<ImgurImage>;
  favorites?: Array<ImgurImage>;
  snackbar?: SnackbarParams;
  filters?: Filters;
}