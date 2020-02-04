import {FilterTypes} from "../utils/const";
import {SortType} from "../components/sort";
import {getFilmsByFilter} from "../utils/filter";
import {getSortedFilms} from "../utils/sort";

export default class Movies {
  constructor() {
    this._filmList = [];
    this._activeFilterType = FilterTypes.DEFAULT;
    this._activeSortType = SortType.DEFAULT;
    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  get filmListDefault() {
    return this._filmList;
  }

  get sortType() {
    return this._activeSortType;
  }

  get filterType() {
    return this._activeFilterType;
  }

  set filmList(filmList) {
    this._filmList = Array.from(filmList);
  }

  set sortType(type) {
    this._activeSortType = type;
  }

  getFilmList() {
    let filmList = this._filmList;

    if (this._activeFilterType !== FilterTypes.DEFAULT) {
      filmList = getFilmsByFilter(this._filmList, this._activeFilterType);
    }

    if (this._activeSortType !== SortType.DEFAULT) {
      filmList = getSortedFilms(filmList, this._activeSortType);
    }

    return filmList;
  }

  setComments(movieId, comments) {
    this._filmList.find((film) => film.id === movieId).comments = comments;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  updateFilm(id, film) {
    const index = this._filmList.findIndex((it) => it.id === id);

    if (index !== -1) {
      this._filmList[index] = film;
      this._dataChangeHandlers.forEach((handler) => handler());

      this._dataChangeHandlers.pop();
      return true;
    }

    return false;
  }

  onFilterChange(handler) {
    this._filterChangeHandlers.push(handler);
  }

  onDataChange(handler) {
    this._dataChangeHandlers.push(handler);
  }
}
