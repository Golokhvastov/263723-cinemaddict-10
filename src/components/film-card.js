import {formatTime, getYear} from "../utils/helpers";
import SmartComponent from "./smart-component";
import {debounce} from "../utils/debounce";
import {Films} from "../utils/const";

export default class FilmCard extends SmartComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  set film(newFilm) {
    this._film = newFilm;
  }

  getTemplate() {
    const description = this._film.description.length > Films.COMMENT_LENGTH ? this._film.description.substring(0, Films.COMMENT_LENGTH) + `...` : this._film.description;

    return `<article class="film-card">
    <h3 class="film-card__title">${this._film.title}</h3>
    <p class="film-card__rating">${this._film.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${getYear(this._film.date)}</span>
      <span class="film-card__duration">${formatTime(this._film.duration)}</span>
      <span class="film-card__genre">${this._film.genres.join(`, `)}</span>
    </p>
    <img src="./${this._film.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${this._film.commentIds.length} comments</a>
    ${this.getCardControlsTemplate()}
  </article>`;
  }

  getCardControlsTemplate() {
    const film = this._film;

    return `<form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${film.isInWatchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${film.isWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${film.isFavorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
    </form>`;
  }

  rerender() {
    this.getElement().querySelector(`.film-card__controls`).innerHTML = this.getCardControlsTemplate();
    this.getElement().querySelector(`.film-card__comments`).textContent = `${this._film.commentIds.length} comments`;

    this.recoverListeners();
  }

  recoverListeners() {
    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.addEventListener(`click`, this._onFilmClick);
    element.querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._onAddToWatchlistClick);
    element.querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._onMarkAsWatchedClick);
    element.querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._onFavoriteClick);
  }

  onFilmClick(handler) {
    this._onFilmClick = handler;
    this.getElement().addEventListener(`click`, handler);
  }

  onAddToWatchlistClick(handler) {
    this._onAddToWatchlistClick = (evt) => {
      evt.preventDefault();
      debounce(handler, evt);
    };
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._onAddToWatchlistClick);
  }

  onMarkAsWatchedClick(handler) {
    this._onMarkAsWatchedClick = (evt) => {
      evt.preventDefault();
      debounce(handler, evt);
    };
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._onMarkAsWatchedClick);
  }

  onFavoriteClick(handler) {
    this._onFavoriteClick = (evt) => {
      evt.preventDefault();
      debounce(handler, evt);
    };
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._onFavoriteClick);
  }
}
