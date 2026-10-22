import { describe, test } from "node:test";
import { deepStrictEqual, strictEqual, match } from "node:assert";
import { getListImage, thumbnailDimensions } from "./list-images";

describe("List image rules", () => {
  test("landscape thumbnail has a 640 px longest edge without cropping", () => {
    deepStrictEqual(thumbnailDimensions(1440, 1080), { width: 640, height: 480 });
  });
  test("portrait thumbnail has a 640 px longest edge without cropping", () => {
    deepStrictEqual(thumbnailDimensions(960, 1280), { width: 480, height: 640 });
  });
  test("small originals are not enlarged", () => {
    deepStrictEqual(thumbnailDimensions(320, 240), { width: 320, height: 240 });
  });
  test("new list images use the WebP sibling without altering original URL", () => {
    const original = "/api/public/media/products/example.list-ready.png";
    strictEqual(getListImage(original), "/api/public/media/products/example.thumb.webp");
    strictEqual(original, "/api/public/media/products/example.list-ready.png");
  });
  test("existing uploaded photos resolve to generated thumbnails", () => {
    match(getListImage("/api/public/media/products/506fdc57-97f8-42fe-a521-fb444a8c4688.png"), /^\/__l5e\/assets-v1\/.+\.webp$/);
  });
  test("unmapped URLs retain their original source", () => {
    strictEqual(getListImage("https://example.com/photo.jpg"), "https://example.com/photo.jpg");
  });
});