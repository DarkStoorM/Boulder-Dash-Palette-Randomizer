import { IColorTable } from "./interfaces/IColorTable";
import { Colors } from "./utils/Colors";

class SpriteManager {
  private initialPalette: IColorTable;
  private initialSpritesheet: string;
  private declare newColors: IColorTable;
  /** DOM element (image) containing the Game Spritesheet */
  private spritesheet = document.getElementById("spritesheet") as HTMLImageElement;

  constructor() {
    // Hold a copy of initial spritesheet and palette for quick revert when interrupted
    this.initialSpritesheet = this.spritesheet.src;

    // Base, classic BD colors
    this.initialPalette = {
      background: Colors.colorFromHex("000000"),
      highlight: Colors.colorFromHex("FFFFFF"),
      primary: Colors.colorFromHex("646464"),
      secondary: Colors.colorFromHex("A36E30"),
    };
  }

  public recolorSpritesheet = (overrideColors?: IColorTable): void => {
    // Create a temporary canvas that will be used to manipulate the main Spritesheet
    const context = this.createTemporaryCanvasContext();

    // Prepare a new image and draw the main image on the temporary canvas
    const image = new Image();

    image.src = this.initialSpritesheet;
    context.drawImage(image, 0, 0);

    // Recolor the entire Spritesheet, then read and replace data in this ImageBuffer
    const imageData = context.getImageData(0, 0, 160, 96);
    let currentPixel: string | null;

    this.newColors = overrideColors ?? this.generateNewColors();

    for (let x = 0; x < imageData.data.length; x = x + 4) {
      // Take the next chunk of the color and compare it to the base colors for replacement
      // NOTICE: Can't use Regex, because of string collisions - resulting in changing the colors twice
      currentPixel = imageData.data.slice(x, x + 4).toString();

      // If any of the currently processed pixels will match the base color, they will be replaced with a new color
      Object.keys(this.initialPalette).forEach((colorType) => {
        if (currentPixel === this.initialPalette[colorType as keyof IColorTable].toString())
          return imageData.data.set(this.newColors[colorType as keyof IColorTable], x);
      });
    }

    // Update the temporary canvas and replace the main Spritesheet with recolored image
    context.putImageData(imageData, 0, 0);
    this.spritesheet.src = context.canvas.toDataURL();
  };

  /** Creates a temporary Canvas element for image manipulation */
  private createTemporaryCanvasContext = (): CanvasRenderingContext2D => {
    const newCanvas = document.createElement("canvas");

    newCanvas.width = 160;
    newCanvas.height = 96;

    return newCanvas.getContext("2d")!;
  };

  private generateNewColors = (): IColorTable => {
    return {
      background: Colors.randomColor(0, 31),
      highlight: Colors.randomColor(175, 231),
      primary: Colors.randomColor(75, 176),
      secondary: Colors.randomColor(30, 116),
    };
  };
}

export const spriteManager = new SpriteManager();
