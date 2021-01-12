import {render, replace, remove, RenderTypes} from "../utils/render.js";
import EditPointView from "../view/edit_existing_point.js";
import ExistingPointView from "../view/existing_point.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class RootPointPresenter {

  constructor(container, changePoint, changeMode) {
    // 1) point - сама точка - объект, который генерируется в data.js и передается RootPointPresenter в board.js (в board.js он попадает из main.js)
    // 2) container - this._tripList в board.js - элемент DOM, в котором будут рендериться точки
    // 3) changePoint - метод _handlePointChange

    this._container = container;
    this._changePoint = changePoint;
    this._changeMode = changeMode;

    this._existingPointComponent = null;
    this._editingPointComponent = null;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init(point) {
    this._point = point;

    const prevExistingPointComponent = this._existingPointComponent;
    const prevEditingPointComponent = this._editingPointComponent;

    this._existingPointComponent = new ExistingPointView(this._point);
    this._editingPointComponent = new EditPointView(this._point);

    this._existingPointComponent.setFavoriteHandler(this._handleFavoriteClick);

    this._editingPointComponent.setFormSubmitHandler(this._handleFormSubmit);

    this._existingPointComponent.setClickHandler(() => {
      this._rollupOldPoint();
    });

    this._editingPointComponent.setClickRollupHandler(() => {
      this._retrieveOldPoint();
    });

    this._editingPointComponent.setClickResetHandler(() => {
      this._retrieveOldPoint();
    });

    if (prevExistingPointComponent === null || prevEditingPointComponent === null) {
      render(RenderTypes.APPEND, this._existingPointComponent.getElement(), this._container);
      return;
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editingPointComponent, prevEditingPointComponent);
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._existingPointComponent, prevExistingPointComponent);
    }

    remove(prevExistingPointComponent);
    remove(prevEditingPointComponent);
  }

  _rollupOldPoint() {
    replace(this._editingPointComponent, this._existingPointComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _retrieveOldPoint() {
    replace(this._existingPointComponent, this._editingPointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      this._editingPointComponent.reset(this._point);
      this._retrieveOldPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _handleFavoriteClick() {
    // вызывает метод _changePoint, который передается точке из board presenter (то же что и _handlePointChange).
    // В качестве аргумента ему отдается описанное ниже.
    this._changePoint(
    // копия объекта this._point, с измененным на противоположное значением isFavorite.
        Object.assign({}, this._point, {isFavorite: !this._point.isFavorite})
    );
  }

  _handleFormSubmit(point) {
    this._changePoint(point);
    this._retrieveOldPoint();
  }

  destroy() {
    remove(this._existingPointComponent);
    remove(this._editingPointComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._retrieveOldPoint();
    }
  }
}
