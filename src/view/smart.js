import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();

    this._state = {};
  }

  updateState(updatedState, isFullRenderRequired = true) {
    if (!updatedState) {
      return;
    }

    this._state = Object.assign(
      {},
      this._state,
      updatedState,
    );

    if (!isFullRenderRequired) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    const scrollPosition = prevElement.scrollTop;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    newElement.scrollTop = scrollPosition;

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
