import Component from "./component";

export default class MoviesCount extends Component {
  constructor(moviesInDatabase) {
    super();
    this._countMovies = moviesInDatabase;
  }

  getTemplate() {
    return `<section class="footer__statistics">
      <p>${this._countMovies} movies inside</p>
    </section>`;
  }
}
