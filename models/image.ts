export class ImgurImage {
  id: string;
  title: string;
  description: string;
  images: Array<ImgurImage | string>;
  link: string;
  favorite: boolean;
  error: { message: string };
  is_album: boolean;
  cover: string;
  images_count: number;
}
