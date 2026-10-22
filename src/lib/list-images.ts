import { imageThumbnails } from "./image-thumbnails";

export function thumbnailDimensions(width: number, height: number) {
  const scale = Math.min(1, 640 / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

export function getListImage(src: string): string {
  if (imageThumbnails[src]) return imageThumbnails[src];
  if (src.startsWith("/api/public/media/") && /\.list-ready\.[a-z0-9]+$/i.test(src)) {
    return src.replace(/\.list-ready\.[a-z0-9]+$/i, ".thumb.webp");
  }
  return src;
}

/** Browser-only invocation; retain the uploaded original separately. */
export async function createListThumbnail(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const dimensions = thumbnailDimensions(bitmap.width, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Impossible de préparer la miniature");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob?.type === "image/webp") resolve(blob);
        else reject(new Error("Impossible de créer la miniature WebP"));
      }, "image/webp", 0.8);
    });
  } finally {
    bitmap.close();
  }
}