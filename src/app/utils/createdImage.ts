import { imageUpload } from "../services/imageStorage.actions";

export async function createImage(folder: string, image?: File, name?: string) {
  const url =
    image && image.size > 0
      ? (
          await imageUpload({
            file: image,
            title: name ? name : "DEFAULT",
            folder: folder,
          })
        )?.data ?? ""
      : "";
  return url;
}
