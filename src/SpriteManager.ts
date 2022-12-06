import { domManipulator } from "./DOMManipulator";
import { baseColorRange } from "./app";
import { IColorTable } from "./interfaces/IColorTable";
import { Colors } from "./utils/Colors";

class SpriteManager {
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
  private initialSpritesheet =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABgAgMAAADnSZEKAAAADFBMVEVkZGQAAACjbjD///9vo1WOAAAC5klEQVRIx+SUoa7jMBBFhwwJ8a8NucSkv2ZiMqS/FhKyxNvTxN6UFSx6b6yrU1lHbTK6qv3/8fjumMWXp8R3x37U/N49jlGGeq3kkAJqHBITh27iGKleiUtvPsrzFKtr7bG8xLpVJ0Mq8M9+fWUZWnuMMfas59mlJyztOcQ8d609IvY8jx1hb24FUWF2rD0iRm+dpNeE28tErJluc3jGrXkSPVzQ0gaiS4+Pt+6ZThRd0K5v7FJ8iDW3JPk8iYnIzf2n91bTiVmzN2NDVLv1kbf21rdKxhED8gaIMcZx36NH1o0MrwNanGIdw+979H5NkQyam4uxIpz1jKmspEkJwy4xmz7X06oIpYDyNkvxKb60TrpUocIvsf8T6R4d5B5yB2eWSPfoIB7kDs6sPdI9OogIXQo4s/ZI9+ggIkSE86w90j06iAjdLOA8a490jw4iQkQ4Y2vS3n1EhF72gDPLo3t0EBEiwpml0T06iAgR4cwS6R4dRISIcGbtkU90EBHyMnDm/v9odBARIsKZtUe6RwcRIQuHc9Ye6R4dRISIcMbm0D06yEDu4MwS6R4dRITcwRljVvfi0N9269jGYRiIgqgT9seEMUu86phcwsMEA3hUwQG2hB9ZMIH1837tu+/TYTxiDvLzzvt0GI+YYw8yBQ3qMh4xxx7k0qAu4xFz7MG779agLuMRc+zBO28c8mA8Yo49yBEa1GU8Yo49qEeiy3jEHHuQOWpQl/GIOfYgc9SgLuMRc+xBpqBBXcYj5tiDeiS6jEfMsQeZowZ1GY+YYw8yRw3qMh4xBwqOeDqMR8yxB/Vo/KwezVq4TH/Ho1lj6tL+rkezXq+4pL/j0XvOMXRpf8ejNw/q0v6OR8PRurS/49Hw19Wl/R2Phm/Upf0dj2buM3Rpf8ej2XMcXdrf8WjWPkuX9nc8Gjvwvb/j0Wv9/MYl/R2Php9bl/Z3PBoe1KX9HY9mn310aX+/FdL3Pfz/XR85xz+tx9QBHWMZ1wAAAABJRU5ErkJggg==";
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
  private spritesheet = document.getElementById("spritesheet") as HTMLCanvasElement;
  private spritesheetContext: globalThis.CanvasRenderingContext2D;

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

    this.spritesheet.width = 160;
    this.spritesheet.height = 96;

    const context = this.spritesheet.getContext("2d");

    // Thanks, TypeScript.
    if (!context) {
      throw new Error("Could not resolve Canvas Context");
    }

    this.spritesheetContext = context;
    this.spritesheetContext.canvas.style.transform = "scale(3)";
    this.spritesheetContext.imageSmoothingEnabled = false;

    this.redrawCanvas(this.initialSpritesheet);
  }

  /**
   * Recolors all pixels on the source image with a new palette or with the provided palette
   *
   * @param   {IColorTable}  overrideColors  Color Palette to apply to this generation.
   */
  public recolorSpritesheet = (overrideColors?: IColorTable): void => {
    // No point in going further if all colors are locked
    if (
      Object.keys(domManipulator.colorElements).every((colorType) => {
        return domManipulator.colorElements[colorType as keyof IColorTable].isLocked();
      })
    ) {
      return;
    }

    // Prepare a new image and draw the main image on the canvas
    this.redrawCanvas(this.initialSpritesheet);

    const imageData = this.spritesheetContext.getImageData(0, 0, 160, 96);
    let currentPixel: string | null;

    // If no override was passed in from the user, generate a color palette
    this.newColors = overrideColors ?? this.generateNewColorPalette();

    // Recolor the entire Spritesheet, then read and replace data in this ImageBuffer
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
    this.spritesheetContext.putImageData(imageData, 0, 0);

    domManipulator.recolorAllElements(this.newColors);

    this.lastPickedColors = Object.assign({}, this.newColors);
  };

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

  /**
   * Re-draws a new source image on the canvas
   *
   * @param   {string}  source  Image to draw to
   */
  private redrawCanvas(source: string): void {
    const image = new Image();
    image.src = source;

    this.spritesheetContext.drawImage(image, 0, 0);
  }
}

export const spriteManager = new SpriteManager();
