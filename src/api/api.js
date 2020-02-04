import Movie from "../models/movie";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const StatusCode = {
  OK: 200,
  MULTIPLE: 300
};

const AUTHORIZATION = `Basic hANlvlLwAAZzd30xOOp=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

export default class Api {
  getMovies() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(Movie.parseMovieList);
  }

  getComments(id) {
    return this._load({url: `comments/${id}`})
      .then((response) => response.json());
  }

  updateMovie(id, newData) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(Movie.toRAW(newData)),
      headers: new Headers({'Content-Type': `application/json`})
    }).then((response) => response.json());
  }

  createComment(id, data) {
    return this._load({
      url: `comments/${id}`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    }).then((response) => response.json());
  }

  deleteComment(id) {
    return this._load({
      url: `comments/${id}`,
      method: Method.DELETE
    });
  }

  sync(data) {
    return this._load({
      url: `/movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    }).then((response) => response.json());
  }

  _checkStatus(response) {
    if (response.status >= StatusCode.OK && response.status < StatusCode.MULTIPLE) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, AUTHORIZATION);

    return fetch(`${END_POINT}/${url}`, {method, body, headers})
      .then(this._checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
