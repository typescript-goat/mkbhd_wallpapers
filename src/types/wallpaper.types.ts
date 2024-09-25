export type Wallpaper = { dhd: string };

export function isWallpaper(arg: unknown): arg is Wallpaper {
  return Object.hasOwn(arg as any, "dhd");
}
