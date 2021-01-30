import EditPointView from "../view/edit_existing_point.js";
import ExistingPointView from "../view/existing_point.js";

import {
  render,
  replace,
  remove,
  RenderTypes
} from "../utils/render.js";
import {
  isDateEqual,
  isCostEqual
} from "../utils/pointUtil.js";
import {
  UserAction,
  UpdateType
} from "../utils/common.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};


export default class PointPresenter {

  constructor(container, changePoint, changeMode, destinations, offers) {
    // 1) point - сама точка - объект, который генерируется в data.js и передается PointPresenter в board.js (в board.js он попадает из main.js)
    // 2) container - this._tripList в board.js - элемент DOM, в котором будут рендериться точки
    // 3) changePoint - метод _handlePointChange

    this._container = container;
    this._pointChangeHandler = changePoint;
    this._modeChangeHandler = changeMode;

    this._existingPointComponent = null;
    this._editingPointComponent = null;
    this._mode = Mode.DEFAULT;

    this._destinations = destinations;
    this._offers = offers;
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._openEditHandler = this._openEditHandler.bind(this);
    this._closeEditHandler = this._closeEditHandler.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(point) {
    this._point = point;

    const prevExistingPointComponent = this._existingPointComponent;
    const prevEditingPointComponent = this._editingPointComponent;

    this._existingPointComponent = new ExistingPointView(this._point);
    this._editingPointComponent = new EditPointView(this._point, this._destinations, this._offers);

    this._existingPointComponent.setFavoriteHandler(this._handleFavoriteClick);
    this._editingPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._existingPointComponent.setClickHandler(this._openEditHandler);
    this._editingPointComponent.setClickRollupHandler(this._closeEditHandler);
    this._editingPointComponent.setClickDeleteHandler(this._handleDeleteClick);

    if (prevExistingPointComponent === null || prevEditingPointComponent === null) {
      render(RenderTypes.APPEND, this._existingPointComponent.getElement(), this._container);
      return;
    }

    if (this._mode === Mode.EDITING) {
      // replace(this._editingPointComponent, prevEditingPointComponent);
      replace(this._existingPointComponent, prevEditingPointComponent);
      this._mode = Mode.DEFAULT;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._existingPointComponent, prevExistingPointComponent);
    }

    remove(prevExistingPointComponent);
    remove(prevEditingPointComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._existingPointComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._editingPointComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._editingPointComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._existingPointComponent.shake(resetFormState);
        this._editingPointComponent.shake(resetFormState);
        break;
    }
  }

  destroy() {
    remove(this._existingPointComponent);
    remove(this._editingPointComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeEditPoint();
    }
  }

  _openEditPoint() {
    replace(this._editingPointComponent, this._existingPointComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._modeChangeHandler();
    this._mode = Mode.EDITING;
  }

  _closeEditPoint() {
    replace(this._existingPointComponent, this._editingPointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      this._editingPointComponent.reset(this._point);
      this._closeEditPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _handleFavoriteClick() {
    this._pointChangeHandler(
        UserAction.CHANGE_POINT,
        UpdateType.MINOR,
        // копия объекта this._point, с измененным на противоположное значением isFavorite.
        Object.assign({}, this._point, {isFavorite: !this._point.isFavorite})
    );
  }

  _openEditHandler() {
    this._openEditPoint();
  }

  _closeEditHandler() {
    this._closeEditPoint();
  }

  _handleFormSubmit(update) {
    const isMinorUpdate =
      !isDateEqual(this._point.beginningTime, update.beginningTime) ||
      !isDateEqual(this._point.finishTime, update.finishTime) ||
      !isCostEqual(this._point.cost, update.cost);

    this._pointChangeHandler(
        UserAction.CHANGE_POINT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        update);
    this._closeEditPoint();
  }

  _handleDeleteClick(point) {
    this._pointChangeHandler(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }
}
