import {FilterTypes, FilterTitles} from "./const";

export const getFilmsByFilter = (filmList, filterType) => {
  let result = [];

  switch (filterType) {
    case FilterTypes.DEFAULT:
      result = filmList;
      break;
    case FilterTypes.FAVORITES:
      result = filmList.filter((film) => film.isFavorite);
      break;
    case FilterTypes.HISTORY:
      result = filmList.filter((film) => film.isWatched);
      break;
    case FilterTypes.WATCHLIST:
      result = filmList.filter((film) => film.isInWatchlist);
  }

  return result;
};

export const calculateMenuFilters = (films) => {
  return [
    {
      title: FilterTitles.WATCHLIST,
      type: FilterTypes.WATCHLIST,
      count: getFilmsByFilter(films, FilterTypes.WATCHLIST).length
    },
    {
      title: FilterTitles.HISTORY,
      type: FilterTypes.HISTORY,
      count: getFilmsByFilter(films, FilterTypes.HISTORY).length
    },
    {
      title: FilterTitles.FAVORITES,
      type: FilterTypes.FAVORITES,
      count: getFilmsByFilter(films, FilterTypes.FAVORITES).length
    }
  ];
};
