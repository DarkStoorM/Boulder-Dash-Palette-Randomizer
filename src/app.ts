// Initialize before the constructors!!!
/**
 * Defines the default, fine-tuned color ranges for each color in the Palette
 */
export const baseColorRange: Record<keyof IColorTable, [number, number]> = {
  background: [0, 36],
  highlight: [150, 201],
  primary: [85, 166],
  secondary: [50, 106],
};

import { domManipulator, DOMManipulator } from "./DOMManipulator";
import { spriteManager } from "./SpriteManager";
import { IColorTable } from "./interfaces/IColorTable";

// Not strictly a button, but it does not matter here
const rollButton = document.getElementById("reroll") as HTMLDivElement;
const rerollSingleButton = document.querySelectorAll(".color-components__reroll-single");
const lockButtons = document.querySelectorAll(".color-components__fill__container--lock");
const unlockAllButton = document.getElementById("unlock-all") as HTMLDivElement;

/*
 * --------------------------------------------------------------------------
 * EVENT LISTENERS
 * --------------------------------------------------------------------------
 *
 * Register all listeners for interactive elements, such as color regeneration
 * or color locking
 *
 */
lockButtons.forEach((lockButton) => lockButton.addEventListener("click", lockColor.bind(lockButton)));
rerollSingleButton.forEach((rerollSingle) =>
  rerollSingle.addEventListener("click", rerollSingleColor.bind(rerollSingle))
);
rollButton.addEventListener("click", spriteManager.recolorSpritesheet.bind(this, undefined)); // TODO argument
unlockAllButton.addEventListener("click", domManipulator.unlockAllColors);

/**
 * Locks the selected color, preventing the generator from overriding it
 *
 * @param   {Element}  this  Clicked Button
 */
function lockColor(this: Element): void {
  const current = this as HTMLDivElement;
  const currentState = current.dataset.locked?.toLowerCase() == "true";

  DOMManipulator.changeLockState(current, currentState);
}

/**
 * Rerolls the color from the selected element
 */
function rerollSingleColor(this: Element): void {
  const current = this as HTMLDivElement;
  const colorType = current.parentElement?.id;

  if (!colorType) {
    throw new Error(`Could not resolve the id from parent element ${current.id}`);
  }

  spriteManager.recolorSpritesheetWithSingle(colorType as keyof IColorTable);
}
