import {formatTime, getCommentDate, getReleaseDate} from "../utils/helpers";
import SmartComponent from "./smart-component";
import {remove, render} from "../utils/render";
import LoadingRingComponent from "./loading-ring";
import moment from "moment";
import {Films, Styles} from "../utils/const";
import {debounce} from "../utils/debounce";

export default class FilmDetails extends SmartComponent {
  constructor(film) {
    super();
    this._film = film;
    this._subscribeOnEvents();
  }

  set film(newFilm) {
    this._film = newFilm;
  }

  get emotion() {
    return this._emotion;
  }

  getTemplate() {
    const genresMarkup = this._film.genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(`\n`);

    return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./${this._film.poster}" alt="">
            ${this._film.ageRating >= Films.AGE_RATING ? `<p class="film-details__age">18+</p>` : ``}
          </div>
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._film.title}</h3>
                <p class="film-details__title-original">Original: ${this._film.alternativeTitle}</p>
              </div>
              <div class="film-details__rating">
                <p class="film-details__total-rating">${this._film.rating}</p>
              </div>
            </div>
            <table class="film-details__table">
               ${this._film.director ? `<tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${this._film.director}</td>
                </tr>` : ``}
               ${this._film.writers.length ? `<tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${this._film.writers}</td>
              </tr>` : ``}
               ${this._film.actors.length ? `<tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${this._film.actors}</td>
              </tr>` : ``}
               ${this._film.date ? `<tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${getReleaseDate(this._film.date)}</td>
              </tr>` : ``}
               ${this._film.duration ? `<tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formatTime(this._film.duration)}</td>
              </tr>` : ``}
               ${this._film.country ? `<tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._film.country}</td>
              </tr>` : ``}
               ${this._film.genres.length ? `<tr class="film-details__row">
                <td class="film-details__term">${this._film.genres.length > 1 ? `Genres` : `Genre`}</td>
                <td class="film-details__cell">
                  ${genresMarkup}
              </tr>` : ``}
            </table>
            <p class="film-details__film-description">
                 ${this._film.description}
            </p>
          </div>
        </div>
        ${this._getFilmControlsTemplate()}
        ${this._getMiddleContainerTemplate()}
      <div class="form-details__bottom-container">
         <section class="film-details__comments-wrap">
            ${this._getCommentsWrapTemplate()}
         </section>
      </div>
    </form>
  </section>`;
  }

  rerender() {
    this.getElement().querySelector(`.film-details__controls`).outerHTML = this._getFilmControlsTemplate();
    this.getElement().querySelector(`.form-details__middle-container`).outerHTML = this._getMiddleContainerTemplate();
    this.getElement().querySelector(`.film-details__comments-wrap`).innerHTML = this._getCommentsWrapTemplate();

    this.recoverListeners();
  }

  show(container) {
    const openedPopups = container.querySelectorAll(`.film-details`);

    if (openedPopups) {
      openedPopups.forEach((popup) => popup.remove());
    }

    render(container, this);
    this._subscribeOnEvents();
    document.addEventListener(`keydown`, this._onKeydown);
  }

  hide() {
    remove(this);
    this.removeElement();
    document.removeEventListener(`keydown`, this._onKeydown);
  }

  renderComments() {
    const sortedComments = this._film.comments.slice()
      .sort((a, b) => moment(a.date) - moment(b.date));

    return sortedComments.map((comment) =>
      `<li class="film-details__comment" data-id="${comment.id}">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji">
        </span>
        <div>
          <p class="film-details__comment-text">${comment.comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author}</span>
            <span class="film-details__comment-day">${getCommentDate(comment.date)}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`).join(`\n`);
  }

  _getFilmControlsTemplate() {
    return `<section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._film.isInWatchlist ? `checked` : ``} disabled>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._film.isWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._film.isFavorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
        </div>`;
  }

  _getMiddleContainerTemplate() {
    return `<div class="form-details__middle-container" ${!this._film.isWatched ? `hidden` : ``}>
    <section class="film-details__user-rating-wrap">
      <div class="film-details__user-rating-controls">
        <button class="film-details__watched-reset" type="button">Undo</button>
      </div>
      <div class="film-details__user-score">
        <div class="film-details__user-rating-poster">
          <img src="./${this._film.poster}" alt="film-poster" class="film-details__user-rating-img">
        </div>
        <section class="film-details__user-rating-inner">
          <h3 class="film-details__user-rating-title">${this._film.title}</h3>
          <p class="film-details__user-rating-feelings">How you feel it?</p>
          <div class="film-details__user-rating-score">
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1" ${this._film.personalRating === 1 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-1">1</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2" ${this._film.personalRating === 2 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-2">2</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3" ${this._film.personalRating === 3 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-3">3</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4" ${this._film.personalRating === 4 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-4">4</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5" ${this._film.personalRating === 5 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-5">5</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6" ${this._film.personalRating === 6 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-6">6</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7" ${this._film.personalRating === 7 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-7">7</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8" ${this._film.personalRating === 8 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-8">8</label>
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" ${this._film.personalRating === 9 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-9">9</label>
          </div>
        </section>
      </div>
    </section>
  </div>`;
  }

  _getCommentsWrapTemplate() {
    if (!this._film.comments.length) {
      const loadingRing = new LoadingRingComponent();
      loadingRing.width = `100px`;
      loadingRing.height = `100px`;

      return loadingRing.getElement().outerHTML;
    }

    return `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._film.comments.length}</span></h3>
          <ul class="film-details__comments-list">
          ${this.renderComments()}
          </ul>
          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label">
            </div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="puke">
              <label class="film-details__emoji-label" for="emoji-gpuke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>`;
  }

  _selectEmoji(selectedEmoji) {
    const emoji = selectedEmoji.cloneNode();
    const emojiLabel = selectedEmoji.parentNode;

    emoji.style.width = Styles.EMOJI_SIZE;
    emoji.style.height = Styles.EMOJI_SIZE;

    this.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = ``;
    this.getElement().querySelector(`.film-details__add-emoji-label`).appendChild(emoji);
    this._emotion = emojiLabel.parentNode.querySelector(`#${emojiLabel.getAttribute(`for`)}`).value;
  }

  recoverListeners() {
    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._onAddToWatchlistClick);
    element.querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._onMarkAsWatchedClick);
    element.querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._onFavoriteClick);
    element.querySelector(`.film-details__user-rating-score`).addEventListener(`click`, this._onRatingClick);
    element.querySelector(`.film-details__watched-reset`).addEventListener(`click`, this._onUndoClick);

    element.querySelectorAll(`.film-details__comment-delete`)
      .forEach((it) => it.addEventListener(`click`, this._onCommentDeleteClick));

    element.querySelectorAll(`.film-details__emoji-label img`)
      .forEach((it) => it.addEventListener(`click`, (evt) => {
        this._selectEmoji(evt.target);
      }));

    element.querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
      this.hide();
    });
  }

  onAddToWatchlistClick(handler) {
    this._onAddToWatchlistClick = (evt) => {
      evt.preventDefault();
      debounce(handler, evt);
    };
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._onAddToWatchlistClick);
  }

  onMarkAsWatchedClick(handler) {
    this._onMarkAsWatchedClick = (evt) => {
      evt.preventDefault();
      debounce(handler, evt);
    };
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._onMarkAsWatchedClick);
  }

  onFavoriteClick(handler) {
    this._onFavoriteClick = (evt) => {
      evt.preventDefault();
      debounce(handler, evt);
    };
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._onFavoriteClick);
  }

  onCommentDeleteClick(handler) {
    this._onCommentDeleteClick = handler;

    this.getElement().querySelectorAll(`.film-details__comment-delete`)
      .forEach((it) => it.addEventListener(`click`, handler));
  }

  onRatingClick(handler) {
    this._onRatingClick = handler;

    this.getElement().querySelector(`.film-details__user-rating-score`).addEventListener(`click`, handler);
  }

  onUndoClick(handler) {
    this._onUndoClick = handler;

    this.getElement().querySelector(`.film-details__watched-reset`).addEventListener(`click`, handler);
  }

  onKeydown(handler) {
    this._onKeydown = handler;
  }
}
