import Observer from "../utils/observer.js";

export default class PointsModel extends Observer {

  static adaptToClient(point) {
    let transformedOptions = {};

    point.offers.forEach((element) => {
      transformedOptions[element.title] = element.price;
    });

    let transformedPhotos = [];
    point.destination.pictures.forEach((element) => {
      transformedPhotos.push(element.src);
    });

    let transformedPhotosDescription = [];
    point.destination.pictures.forEach((element) => {
      transformedPhotosDescription.push(element.description);
    });

    const adaptedPoint = Object.assign(
        {},
        point,
        {
          pointType: point.type,
          pointName: point.destination.name,
          beginningTime: new Date(point.date_from),
          finishTime: new Date(point.date_to),
          cost: point.base_price,
          description: point.destination.description,
          options: transformedOptions,
          photos: transformedPhotos,
          photosDescription: transformedPhotosDescription,
          isFavorite: point.is_favorite,
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.type;
    delete adaptedPoint.base_price;
    delete adaptedPoint.offers;
    delete adaptedPoint.destination;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedOffers = [];
    Object.keys(point.options).forEach((element) =>{
      adaptedOffers.push({
        title: element,
        price: point.options[element]
      });
    });

    const adaptedPictures = [];
    point.photos.forEach((element) =>{
      adaptedPictures.push({
        src: element,
        description: ``
      });
    });

    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "id": String(point.id),
          "type": point.pointType,
          "destination": {
            "name": point.pointName,
            "description": point.description,
            "pictures": adaptedPictures,
          },
          "date_from": point.beginningTime.toISOString(),
          "date_to": point.finishTime.toISOString(),
          "base_price": point.cost,
          "offers": adaptedOffers,
          "is_favorite": point.isFavorite,
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.pointType;
    delete adaptedPoint.pointName;
    delete adaptedPoint.description;
    delete adaptedPoint.options;
    delete adaptedPoint.beginningTime;
    delete adaptedPoint.finishTime;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.photos;
    delete adaptedPoint.photosDescription;
    delete adaptedPoint.cost;

    return adaptedPoint;
  }


  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

}
