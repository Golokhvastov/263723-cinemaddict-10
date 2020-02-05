export const Films = {
  TOTAL_AMOUNT: 10,
  INITIAL_AMOUNT: 5,
  LOAD_AMOUNT: 5,
  EXTRA_FILM_AMOUNT: 2,
  COMMENT_LENGTH: 139,
  AGE_RATING: 18
};

export const FilterTypes = {
  DEFAULT: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export const FilterTitles = {
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`
};

export const Colors = {
  BORDER_ERROR: `2px solid #cc0000`,
  ERROR: `#cc0000`,
};

export const Styles = {
  PENDING_OPACITY: `0.5`,
  EMOJI_SIZE: `55px`
};

export const userRanks = [
  {
    title: ``,
    min: 0,
    max: 0
  },
  {
    title: `Novice`,
    min: 1,
    max: 10
  },
  {
    title: `Fan`,
    min: 11,
    max: 20
  },
  {
    title: `Movie Buff`,
    min: 21,
    max: Infinity
  }
];
