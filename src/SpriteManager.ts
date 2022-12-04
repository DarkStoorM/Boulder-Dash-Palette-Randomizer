import { baseColorRange } from "./app";
import { domManipulator } from "./DOMManipulator";
import { IColorTable } from "./interfaces/IColorTable";
import { Colors } from "./utils/Colors";

class SpriteManager {
  private canvasContext: globalThis.CanvasRenderingContext2D;
  /**
   * Defines a range of values for how bright specific palette colors will be
   *
   * TODO: add form controls to this for overriding purposes
   * TODO: add base copy for resetting purposes
   */
  private colorRanges: Record<keyof IColorTable, [number, number]> = {
    background: baseColorRange.background,
    highlight: baseColorRange.highlight,
    primary: baseColorRange.primary,
    secondary: baseColorRange.secondary,
  };
  /**
   * Defines the base colors the spritesheet will be colored with on refresh / regeneration
   */
  private initialPalette: IColorTable;
  /**
   * Holds a copy of the initial spritesheet, which is automatically assigned on every generation, so we don't have to
   * wait for the current recolor operation to finish, avoiding color collisions during the interruption
   */
  private initialSpritesheet: string;
  /**
   * Holds a palette of previously used colors to provide Color Locking functionality
   */
  private declare lastPickedColors: IColorTable;
  /**
   * Holds a palette of newly generated colors, taking locked colors into account
   */
  private declare newColors: IColorTable;
  /**
   * DOM element (image) containing the Game Spritesheet
   */
  private spritesheet = document.getElementById("spritesheet") as HTMLImageElement;

  constructor() {
    // Initialize the layout color ranges first
    let key: keyof IColorTable;
    for (key in this.colorRanges) {
      const element = document.getElementsByClassName(`range-${key}`).item(0);

      if (!element) {
        throw new Error(`Could not resolve color range element for initialization: ${key}`);
      }

      element.innerHTML = this.colorRanges[key].join(" - ");
    }

    // Hold a copy of initial spritesheet and palette for quick revert when interrupted
    this.initialSpritesheet = this.spritesheet.src;

    // Base, classic BD colors
    this.initialPalette = {
      background: Colors.colorFromHex("000000"),
      highlight: Colors.colorFromHex("FFFFFF"),
      primary: Colors.colorFromHex("646464"),
      secondary: Colors.colorFromHex("A36E30"),
    };

    this.lastPickedColors = this.initialPalette;

    // Initialize the color elements in the DOM
    domManipulator.recolorAllElements(this.initialPalette);

    const newCanvas = document.createElement("canvas") as HTMLCanvasElement;

    newCanvas.width = 160;
    newCanvas.height = 96;

    const context = newCanvas.getContext("2d");

    // Thanks, TypeScript.
    if (!context) {
      throw new Error("Could not resolve Canvas Context");
    }

    this.canvasContext = context;
  }

  /**
   * Recolors the source image, but only the selected color will be overridden
   *
   * @param   {keyof}  colorType    Color type from the Palette. @see IColorTable
   */
  public recolorSpritesheetWithSingle = (colorType: keyof IColorTable): void => {
    // Ignore if this color is locked
    if (domManipulator.colorElements[colorType].isLocked()) {
      return;
    }

    // Break the reference, else the spritesheet will not be recolored due to the overridden colors
    const newPalette = Object.assign({}, this.lastPickedColors);
    newPalette[colorType] = this.getRandomColorFromRange(colorType);

    this.recolorSpritesheet(newPalette);
  };

  /**
   * Recolors all pixels on the source image with a new palette or with the provided palette
   *
   * @param   {IColorTable}  overrideColors  Color Palette to apply to this generation.
   */
  public recolorSpritesheet = (overrideColors?: IColorTable): void => {
    // Prepare a new image and draw the main image on the temporary canvas
    const image = new Image();

    image.src = this.initialSpritesheet;
    this.canvasContext.drawImage(image, 0, 0);

    // Recolor the entire Spritesheet, then read and replace data in this ImageBuffer
    const imageData = this.canvasContext.getImageData(0, 0, 160, 96);
    let currentPixel: string | null;

    // If no override was passed in from the user, generate a color palette
    this.newColors = overrideColors ?? this.generateNewColorPalette();

    for (let x = 0; x < imageData.data.length; x = x + 4) {
      // Take the next chunk of the color and compare it to the base colors for replacement
      // NOTICE: Can't use Regex, because of string collisions - resulting in changing the colors twice
      currentPixel = imageData.data.slice(x, x + 4).toString();

      // If any of the currently processed pixels will match the base color, they will be replaced with a new color
      let colorType: keyof IColorTable;
      for (colorType in this.initialPalette) {
        if (currentPixel === this.initialPalette[colorType].toString()) {
          imageData.data.set(this.newColors[colorType], x);
          continue;
        }
      }
    }

    // Update the temporary canvas and replace the main Spritesheet with recolored image
    this.canvasContext.putImageData(imageData, 0, 0);
    this.spritesheet.src = this.canvasContext.canvas.toDataURL();

    domManipulator.recolorAllElements(this.newColors);

    this.lastPickedColors = this.newColors;
  };

  /**
   * Creates a new palette of randomized colors, taking locked colors into account
   */
  private generateNewColorPalette = (): IColorTable => {
    const newPalette: IColorTable = {} as IColorTable;

    // Define a temporary type just to not make a class out of it
    type KeysEnum<T> = { [P in keyof Required<T>]: true };
    const colorTypes: KeysEnum<IColorTable> = {
      background: true,
      highlight: true,
      primary: true,
      secondary: true,
    };

    let colorType: keyof IColorTable;
    for (colorType in colorTypes) {
      // Disallow changing the locked pixel color, just set it to the initial color and continue
      if (domManipulator.colorElements[colorType].isLocked()) {
        newPalette[colorType] = this.lastPickedColors[colorType];
        continue;
      }

      newPalette[colorType] = this.getRandomColorFromRange(colorType);
    }

    return newPalette;
  };

  /**
   * Generates a random number for the given color type from the palette within its defined range
   *
   * @param   {keyof}              colorType    Type of the color from the palette. @see IColorTable (keys)
   */
  private getRandomColorFromRange = (colorType: keyof IColorTable): Uint8ClampedArray => {
    return Colors.randomColor(this.colorRanges[colorType][0], this.colorRanges[colorType][1]);
  };
}

export const spriteManager = new SpriteManager();
