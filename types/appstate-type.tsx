import { ImgurImage } from "../models/image";
import { Filters, GalleryFiltersType } from "./gallery-filters-type";
import { SnackbarParams } from "./snackbar-params";

export type AppStateType = {
  username?: string;
  isTokenRetrieved?: boolean;
  posts?: Array<ImgurImage>;
  favorites?: Array<ImgurImage>;
  snackbar?: SnackbarParams;
  filters?: Filters;
  galleryFilters?: GalleryFiltersType;
}