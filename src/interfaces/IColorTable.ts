export interface IColorTable {
  /**
   * Defines the color of background pixels on the image - this works best with black pixels in
   * most color palettes. This is mostly used to color Space object, so very, very dark shades
   * are preferable
   */
  background: Uint8ClampedArray;
  /**
   * Defines the color of highlight pixels on the image - this works best mostly with white color
   * or brighter variations of most hues, preferably a shade of gray
   */
  highlight: Uint8ClampedArray;
  /**
   * Defines the color of primary pixels, which represent the "base" of the image, having the
   * biggest impact on Boulders, Titanium Wall and Rockford's Head or Brick Wall. Avoid using
   * bright shades when the cave is mostly covered with those objects
   */
  primary: Uint8ClampedArray;
  /**
   * Defines the color of Secondary pixels, which represent the the detail of the image. This
   * Color has the biggest impact on Dirt, so this should be used with caution. Avoid using bright
   * shades when most of the cave is covered by Dirt
   */
  secondary: Uint8ClampedArray;
}
