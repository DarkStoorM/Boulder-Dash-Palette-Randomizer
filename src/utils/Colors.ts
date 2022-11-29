import { Numbers } from "./Numbers";

export class Colors {
  /**
   * Converts hex color string (no-hash) into color chunks
   *
   * @param     {string}    hex Hex representation of a color without # symbol
   */
  public static colorFromHex(hex: string): Uint8ClampedArray {
    const bigint = parseInt(hex, 16);

    return new Uint8ClampedArray([(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255]);
  }

  /**
   * Returns a random color chunk.
   *
   * Optionally, it accepts separate color channels to allow introducing variety into generated
   * colors. If any of the optional channels is omitted, Red channel will be used instead.
   *
   * Red is also used as a **main** color range, meaning that only this argument can be specified
   * to generate a random color from the same values across all color channels.
   *
   * @param   {number}  rMin  Red channel, min range color value (0-256)
   * @param   {number}  rMax  Red channel, max range color value (0-256)
   * @param   {number}  gMin  Green channel, min range color value (0-256)
   * @param   {number}  gMax  Green channel, max range color value (0-256)
   * @param   {number}  bMin  Blue channel, min range color value (0-256)
   * @param   {number}  bMax  Blue channel, max range color value (0-256)
   */
  public static randomColor(
    rMin: number,
    rMax: number,
    gMin?: number,
    gMax?: number,
    bMin?: number,
    bMax?: number
  ): Uint8ClampedArray {
    const hexColor = Colors.rgbToHex(
      Numbers.int(rMin, rMax),
      Numbers.int(gMin ?? rMin, gMax ?? rMax),
      Numbers.int(bMin ?? rMin, bMax ?? rMax)
    );

    return Colors.colorFromHex(hexColor);
  }

  /**
   * Converts an RGB color combination into Hex representation
   *
   * @param   {number}  r  Red channel (0-256)
   * @param   {number}  g  Green channel (0-256)
   * @param   {number}  b  Blue channel (0.256)
   */
  public static rgbToHex(r: number, g: number, b: number) {
    return [r, g, b]
      .map((x: number): string => {
        const hex = x.toString(16);

        // 0 has to be prepended in case we rolled a single-digit number
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("");
  }
}
