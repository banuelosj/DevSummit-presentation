import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ movies }) => {
   const movieCards = movies.map((movie) => {
      return <MovieCard card={movie} key={movie.movie} />;
   });

   return movieCards;
};

export default MovieList;