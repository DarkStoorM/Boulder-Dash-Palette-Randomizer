import { domManipulator, DOMManipulator } from "./DOMManipulator";
import { spriteManager } from "./SpriteManager";

// Not strictly a button, but it does not matter here
const rollButton = document.getElementById("reroll") as HTMLDivElement;
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
