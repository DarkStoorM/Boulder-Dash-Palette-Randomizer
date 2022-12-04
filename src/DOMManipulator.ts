import { IColorTable } from "./interfaces/IColorTable";
import { Colors } from "./utils/Colors";

type ColorElement = {
  /**
   * Element used to visualize the newly generated color
   */
  fill: HTMLDivElement;
  /**
   * Element containing the Lock "button". This is not strictly a button, since this app does not rely on navigation
   */
  lockButton: HTMLDivElement;
  /**
   * Element containing the final Hex color code
   */
  outputText: HTMLDivElement;
  /**
   * Shortcut for checking if this button is "locked" to prevent modifying this color
   */
  isLocked: () => boolean;
};

/**
 * Describes a structure of DOM elements of the color components separated by the color type from the palette
 */
export type ColorElementType = Record<keyof IColorTable, ColorElement>;

export class DOMManipulator {
  public colorElements: ColorElementType = {
    background: {},
    highlight: {},
    primary: {},
    secondary: {},
  } as ColorElementType;

  public constructor() {
    // Get all color elements holding their respective Fill/Lock nodes
    let colorType: keyof IColorTable;
    for (colorType in this.colorElements) {
      const label = colorType as keyof ColorElementType;

      this.colorElements[label].fill = document.getElementById(`${label}-fill`) as HTMLDivElement;
      this.colorElements[label].outputText = document.getElementById(`${label}-output`) as HTMLDivElement;
      this.colorElements[label].lockButton = document.getElementById(`${label}-lock`) as HTMLDivElement;
      this.colorElements[label].isLocked = (): boolean => {
        return this.colorElements[label].lockButton.dataset.locked?.toLowerCase() == "true";
      };
    }
  }

  /**
   * Updates the Lock button, changing its icon/color depending on the Locked state, toggles the state internally on
   * the button elements
   *
   * @param   {HTMLDivElement}  element  Color Element Lock button to update
   * @param   {boolean}         state    Current button Locked state (automatically assigned)
   */
  public static changeLockState = (element: HTMLDivElement, state: boolean): void => {
    const newState = !state;

    element.innerText = DOMManipulator.getStateIcon(newState);
    element.style.backgroundColor = DOMManipulator.getStateColor(newState);

    element.dataset.locked = String(newState);
  };

  /**
   * Recolors all initialized color elements from the DOM with the given color palette
   *
   * @param   {IColorTable}  colorPalette  Palette containing the spritesheet colors used to recolor the corresponding elements
   */
  public recolorAllElements = (colorPalette: IColorTable): void => {
    let colorType: keyof IColorTable;
    for (colorType in colorPalette) {
      const color = colorPalette[colorType];
      const newHex = Colors.rgbToHex(color[0], color[1], color[2]);

      this.colorElements[colorType].fill.style.backgroundColor = `#${newHex}`;
      this.colorElements[colorType].outputText.innerText = newHex;
    }
  };

  /**
   * Resets the Locked state on all color lock buttons
   */
  public unlockAllColors = (): void => {
    let colorType: keyof IColorTable;
    for (colorType in this.colorElements) {
      DOMManipulator.changeLockState(this.colorElements[colorType].lockButton, true);
    }
  };

  /**
   * Returns a hex color code depending on the given state.
   *
   * @param   {boolean}  state  State to test - only used to return Red/Green for the Color Lock button
   */
  private static getStateColor = (state: boolean): string => {
    return state ? "#843535" : "#358435";
  };

  /**
   * Returns a specific icon depending on the given state
   *
   * @param   {boolean}  state  State to test - only used to return a Locked/Unlocked icon for the Color Lock button
   */
  private static getStateIcon = (state: boolean): string => {
    return state ? "🔒" : "🔓";
  };
}

export const domManipulator = new DOMManipulator();
