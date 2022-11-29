import { IColorTable } from "./interfaces/IColorTable";
import { Numbers } from "./Numbers";

class SpriteManager {
  /** DOM element (image) containing the Game Spritesheet */
  private gameSpritesheet = document.getElementById("spritesheet") as HTMLImageElement;
  private initialPalette: IColorTable;
  private initialSpritesheet: string;
  private declare newColors: IColorTable;

  constructor() {
    // Hold a copy of initial spritesheet and palette for quick revert when interrupted
    this.initialSpritesheet = this.gameSpritesheet.src;

    // Base, classic BD colors
    this.initialPalette = {
      background: this.colorFromHex("000000"),
      highlight: this.colorFromHex("FFFFFF"),
      primary: this.colorFromHex("646464"),
      secondary: this.colorFromHex("A36E30"),
    };
  }

  public recolorSpritesheet = (button: HTMLButtonElement): void => {
    // Create a temporary canvas that will be used to manipulate the main Spritesheet
    const context = this.createTemporaryCanvasContext();

    // Prepare a new image and draw the main image on the temporary canvas
    const image = new Image();

    image.src = this.initialSpritesheet;
    context.drawImage(image, 0, 0);

    // Recolor the entire Spritesheet, then read and replace data in this ImageBuffer
    const imageData = context.getImageData(0, 0, 480, 288);
    let currentPixel: string | null;

    this.newColors = this.generateNewColors();

    for (let x = 0; x < imageData.data.length; x = x + 4) {
      // Take the next chunk of the color and compare it to the base colors for replacement
      // NOTICE: Can't use Regex, because of string collisions - resulting in changing the colors twice
      currentPixel = imageData.data.slice(x, x + 4).toString();

      // If any of the currently processed pixels will match the base color, they will be replaced with a new color
      if (currentPixel === this.initialPalette.background.toString()) imageData.data.set(this.newColors.background, x);
      if (currentPixel === this.initialPalette.highlight.toString()) imageData.data.set(this.newColors.highlight, x);
      if (currentPixel === this.initialPalette.primary.toString()) imageData.data.set(this.newColors.primary, x);
      if (currentPixel === this.initialPalette.secondary.toString()) imageData.data.set(this.newColors.secondary, x);
    }

    // Update the temporary canvas and replace the main Spritesheet with recolored image
    context.putImageData(imageData, 0, 0);

    this.gameSpritesheet.src = context.canvas.toDataURL();
  };

  /**
   * Converts hex colors into string chunks
   */
  private colorFromHex = (hex: string): Uint8ClampedArray => {
    const bigint = parseInt(hex, 16);

    return new Uint8ClampedArray([(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255]);
  };

  /** Creates a temporary Canvas element for image manipulation */
  private createTemporaryCanvasContext = (): CanvasRenderingContext2D => {
    const newCanvas = document.createElement("canvas");
    newCanvas.width = 480;
    newCanvas.height = 288;
    const context = newCanvas.getContext("2d");

    // Thanks, TypeScript...
    if (!context) {
      throw new Error("Could not resolve the canvas context.");
    }

    return context;
  };

  private generateNewColors = (): IColorTable => {
    return {
      background: this.colorFromHex(this.rgbToHex(Numbers.int(0, 26), Numbers.int(0, 26), Numbers.int(0, 26))),
      highlight: this.colorFromHex(this.rgbToHex(Numbers.int(178, 256), Numbers.int(178, 256), Numbers.int(178, 256))),
      primary: this.colorFromHex(this.rgbToHex(Numbers.int(76, 155), Numbers.int(76, 155), Numbers.int(76, 155))),
      secondary: this.colorFromHex(this.rgbToHex(Numbers.int(40, 115), Numbers.int(40, 115), Numbers.int(40, 115))),
    };
  };

  private rgbToHex = (r: number, g: number, b: number) =>
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);

        // 0 has to be prepended in case we rolled a single-digit number
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("");
}

export const spriteManager = new SpriteManager();
