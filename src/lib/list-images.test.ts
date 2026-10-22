import { describe, expect, test } from "bun:test";
import { getListImage, thumbnailDimensions } from "./list-images";

describe("List image rules", () => {
  test("landscape thumbnail has a 640 px longest edge without cropping", () => {
    expect(thumbnailDimensions(1440, 1080)).toEqual({ width: 640, height: 480 });
  });
  test("portrait thumbnail has a 640 px longest edge without cropping", () => {
    expect(thumbnailDimensions(960, 1280)).toEqual({ width: 480, height: 640 });
  });
  test("small originals are not enlarged", () => {
    expect(thumbnailDimensions(320, 240)).toEqual({ width: 320, height: 240 });
  });
  test("new list images use the WebP sibling without altering original URL", () => {
    const original = "/api/public/media/products/example.list-ready.png";
    expect(getListImage(original)).toBe("/api/public/media/products/example.thumb.webp");
    expect(original).toBe("/api/public/media/products/example.list-ready.png");
  });
  test("existing uploaded photos resolve to generated thumbnails", () => {
    expect(getListImage("/api/public/media/products/506fdc57-97f8-42fe-a521-fb444a8c4688.png")).toMatch(/^\/__l5e\/assets-v1\/.+\.webp$/);
  });
  test("unmapped URLs retain their original source", () => {
    expect(getListImage("https://example.com/photo.jpg")).toBe("https://example.com/photo.jpg");
  });
});