import { Numbers } from "./Numbers";

export class Colors {
  /**
   * Converts hex color string (no-hash) into string chunks
   *
   * @param     {string}    hex Hex representation of a color without # symbol
   */
  public static colorFromHex(hex: string): Uint8ClampedArray {
    const bigint = parseInt(hex, 16);

    return new Uint8ClampedArray([(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255]);
  }

  /**
   * Returns a random Hex color from the given RGB color value range
   *
   * TODO: add range per color channel
   *
   * @param   {number}             rangeMin  Color value range Minimum
   * @param   {number}             rangeMax  Color value range Maximum (exclusive)
   */
  public static randomColor(rangeMin: number, rangeMax: number): Uint8ClampedArray {
    const hexColor = Colors.rgbToHex(
      Numbers.int(rangeMin, rangeMax),
      Numbers.int(rangeMin, rangeMax),
      Numbers.int(rangeMin, rangeMax)
    );

    return Colors.colorFromHex(hexColor);
  }

  /**
   * Converts an RGB color combination into Hex representation
   *
   * @param   {number}  r  Red channel (0-255)
   * @param   {number}  g  Green channel (0-255)
   * @param   {number}  b  Blue channel (0.255)
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
